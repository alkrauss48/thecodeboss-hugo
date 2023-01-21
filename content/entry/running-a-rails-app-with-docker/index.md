---
title: "Running a Rails App with Docker"
date: "2017-09-17"
categories:
- Blog
tags:
- Ruby
- Devops
draft: "false"
---
[Docker](https://www.docker.com/) is quickly becoming the new cool-kid tool around town, and despite the fact that it’s still in rapid development, it has become stable enough over the past couple of years to the point where you can actually use it for some of your production apps. If you Google around, you’re bound to find plenty of tutorials that review how to get started with Docker and (_insert your favorite language_) – but I want to take it a step further. I don’t want to just show you how to run a Rails app with Docker; I want to build with you an actual use-case scenario where using Docker makes a ton of sense. See, where Docker truly excels is when you have multiple services that are all communicating together. These services can be practically anything: a web server, app server, database, background job processor, etc. – and when you start having a bunch of services all relying on each other, it makes development more difficult, especially collaborative development. What if my computer’s running a different version of one of these services than yours is? That could easily cause inconsistencies if we’re developing in a team environment. In order to eliminate these kinds of issues, incorporating something like Docker really becomes appealing.

To take things a step further, we’ll also be talking about [docker-compose](https://docs.docker.com/compose/overview/) – a wonderful tool by the Docker team that helps manage the running of multiple containers.

Let’s talk a bit about what we actually want to build.

The Scenario
------------

![ERD over Rails Docker Blog demo](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/running-a-rails-app-with-docker/erd.png)

We want to build a simple Rails blog API with **user**, **post**, and **comment** resources; you can see the ERD of our planned database just above. Whenever we create a comment (i.e. make a successful POST request to **/comments**), we want to send an email to the creator of the post, letting them know a comment was created. However – we don’t want to send this email synchronously; we want to offload it to a background job processor to handle the actual sending of the email. Last but not least, instead of actually sending this email to a real person while in development, we just want to capture the email so that we can inspect and debug it. To do this, we’ll use a really cool tool called [maildev](https://github.com/djfarrelly/MailDev) which sets up an SMTP server to capture emails, as well as an HTTP server to allow us to view the emails.

This may sound like a lot going on – but don’t overthink it; we’re just sending an email when a comment is created. It just so happens that we have a few more services needed in order to make this happen – which is why this is a perfect scenario to showcase how powerful Docker is.

What is Docker?
---------------

Just to make sure we’re all on the same page, let’s briefly review what Docker actually is. Docker is a platform for running and managing what are called [containers](https://www.docker.com/what-container) – i.e. lightweight pieces of software that are geared to running a single specific process. They’re sort of like virtual machines, but much, much smaller and they each have a specific job to do. Containers are also designed to be spun up and down very quickly, which helps make them appealing. In our above example, we would have separate services running for the Rails app, background job processor, maildev – and more.

Getting Started
---------------

**Note:** For the following code, we’ll be using **Rails** **v5.0.2**.

We’re ready to start building our app – but for this first segment, we’re not even gonna use Docker. There’s a little bit of setup for us to get through before we take that step.

Run the following command line commands to get our base database structure going (for a real app, we would use a serious database such as PostgreSQL, MySQL, etc.; for now, we’ll stick with the default SQLite).

{{< highlight bash "linenos=table" >}}
rails new blog --api

# Let rails do its thing

cd blog

# Scaffold out our resources

rails g scaffold user first_name:string last_name:string email:string
rails g scaffold post title:string body:text user:references
rails g scaffold comment body:text user:references post:references
{{< / highlight >}}

Before we migrate our database, let’s add some simple seeds – just to get some dummy data in there:

{{< highlight ruby "linenos=table" >}}
# db/seeds.rb

user1 = User.create(first_name: 'John', last_name: 'test', email: 'john@test.com')
user2 = User.create(first_name: 'Sam',  last_name: 'test', email: 'sam@test.com')
post1 = Post.create(title: 'Foo', body: 'Bar', user_id: user1.id)
{{< / highlight >}}

Good, now we can migrate our database and run our seeds:

{{< highlight shell "linenos=table" >}}
rake db:migrate
rake db:seed
{{< / highlight >}}

Once we have all of that set up, let’s go ahead and add the [sidekiq](https://github.com/mperham/sidekiq) gem to our Gemfile, because that’s what we’ll be using as our background job processor.

{{< highlight ruby "linenos=table" >}}
# Gemfile

gem 'sidekiq'
{{< / highlight >}}

Sidekiq depends on Redis – which means we’ll be tying that into our setup later on as well!

Now install the gem:

{{< highlight shell "linenos=table" >}}
bundle install
{{< / highlight >}}

We now have our app set up, so let’s go ahead and generate our mailer:

{{< highlight shell "linenos=table" >}}
rails g mailer Comment
{{< / highlight >}}

This will create the file **app/mailers/comment_mailer.rb** – which we’ll now edit to add in a new_comment mailer function:


{{< highlight ruby "linenos=table" >}}
# app/mailers/comment_mailer.rb

class CommentMailer < ApplicationMailer
  default from: "notifications@example.com"
 
  def new_comment(comment)
    @comment = comment
    mail(to: @comment.post.user.email, subject: "New Comment")
  end
end
{{< / highlight >}}

As you can see, this mailer will send only to the author of the post that this comment is for. But exactly what does it send? That’s what we need to add next – our HTML and text email templates. First we need to create the templates:

{{< highlight shell "linenos=table" >}}
touch app/views/comment_mailer/new_comment.html.erb
touch app/views/comment_mailer/new_comment.text.erb
{{< / highlight >}}

And now we need to add some brief content into each of them:

{{< highlight html "linenos=table" >}}
# app/views/comment_mailer/new_comment.html.erb

<h1>New Comment</h1>
<p>Your post received a new comment from <%= @comment.user.first_name %> <%= @comment.user.last_name %></p>
<p>Comment: <%= @comment.body %></p>
{{< / highlight >}}

{{< highlight text "linenos=table" >}}
# app/views/comment_mailer/new_comment.text.erb

New Comment
Your post received a new comment from <%= @comment.user.first_name %> <%= @comment.user.last_name %>

Comment: <%= @comment.body %>
{{< / highlight >}}

Perfect, now that we’ve got our mailers set up – we actually need to update our **comments_controller.rb** to deliver that email (and specifically we need to update the **create** action):

{{< highlight ruby "linenos=table" >}}
# app/controllers/comments_controller.rb

class CommentsController < ApplicationController
  .
  .
  # POST /comments
  def create
    @comment = Comment.new(comment_params)
 
    if @comment.save
      CommentMailer.new_comment(@comment).deliver_later
      render json: @comment, status: :created, location: @comment
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end
  .
  .
end
{{< / highlight >}}

The only line we need to add is line #9 where we make the **CommentMailer** call. Also, notice that we’re using the [deliver_later](http://apidock.com/rails/v4.2.7/ActionMailer/MessageDelivery/deliver_later) method when we haven’t even hooked up a queuing system yet. This function tells ActionMailer to use ActiveJob to send out the emails – and if you don’t have any background job processor in place yet, then ActionMailer will just process the job synchronously. Fun fact.

Go ahead and start your server. As of right now, if you issue a POST request to **/comments** – such as this one below – then Rails will successfully create a comment and _try_ to send an email.

{{< highlight shell "linenos=table" >}}
rails s

# Then, in a new terminal pane, run:
curl -X POST 'http://localhost:3000/comments' -d "comment[body]=foo" -d "comment[user_id]=2" -d "comment[post_id]=1"
{{< / highlight >}}

You should see a successful response from your curl command, as well as Rails logging out its intent to send out an email. No emails will actually send right now because we haven’t hooked up any email settings such as SMTP credentials – but don’t worry, we’ll fix that in a bit. It’s time to start integrating what we currently have with Docker.

Adding in Docker
----------------

**Note:** From this point on, you’ll need to have both the Docker Engine and Compose installed. If you’re on Windows or Mac, you can just install the [Docker Toolbox](https://www.docker.com/products/docker-toolbox) to get both (and more). Otherwise, you’ll need to install them separately.

* * *

To implement Docker, we first need to add in a Dockerfile so that we can build our Rails app as a Docker image. Add in the following **Dockerfile** to the root of your project:

{{< highlight dockerfile "linenos=table" >}}
# Dockerfile

FROM ruby:2.3.3
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /myapp
WORKDIR /myapp
ADD Gemfile /myapp/Gemfile
ADD Gemfile.lock /myapp/Gemfile.lock
RUN bundle install
ADD . /myapp
{{< / highlight >}}

There’s nothing special about this Dockerfile; at the time of this writing, you can find this exact example straight from [the Docker site](https://docs.docker.com/compose/rails/) about how to create an image from a Rails app. We could now issue a “docker build” command to create this image – but let’s hold off on that. I mentioned in the intro that we’ll be using docker-compose to both build and run all of our images. To use docker-compose, however, we first need to add in another file called **docker-compose.yml** to the root of our project:

{{< highlight yaml "linenos=table" >}}
# docker-compose.yml

version: '2'
services:
  web:
    build: .
    command: bundle exec rails s -p 3000 -b '0.0.0.0'
    volumes:
      - .:/myapp
    ports:
      - "3000:3000"
  maildev:
    image: djfarrelly/maildev
    ports:
      - "1080:80"
  redis:
    image: redis
  sidekiq:
    build: .
    command: bundle exec sidekiq -q mailers
    volumes:
      - .:/myapp
    depends_on:
      - redis
{{< / highlight >}}

I won’t lie – it looks like there’s a lot going on here, but stay with me. All we’re doing here is preparing 4 different images (2 of which are built with this project’s Dockerfile) that will all be run at the same time – in the same network. That last statement’s really important, because networks in Docker are really cool. Since each container technically has its own unique address – it’s a little difficult for images to know how to communicate with each other. Docker networks are great because they will automatically resolve the hostname of a container based on what you name it – so that if you want to communicate with a container that’s titled **sidekiq** in the docker-compose.yml file, then you only have to specify its address by its name – “sidekiq”! You do still need to include any ports that the service is running on, though.

If this all sounds confusing – don’t worry, you’re not alone. This is difficult to get a grasp on the first time you see it (and many times after that, too) – but believe it or not, we’re almost done here, so let’s keep going.

Next, we need to add a few settings in our **development.rb** config file to set up SMTP to send to the Maildev container’s SMTP server:

{{< highlight ruby "linenos=table" >}}
# config/environments/development.rb

config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  :address => 'maildev',
  :port => 25,
  :openssl_verify_mode => 'none'
}
{{< / highlight >}}

The Maildev container’s SMTP server runs on port 25 – which is the default port for SMTP – and you can see here that we’re locating the server just by the string “**maildev**.” This works because when we run our setup using docker-compose, it creates a network which will resolve that hostname and send the request to the right container. Port 25 is also exposed by default on that container – but only to other containers in the network; you can’t access it outside of the Docker network.

Now, we need to tell [ActiveJob](http://edgeguides.rubyonrails.org/active_job_basics.html) (Rails’ built-in background job wrapper) that we want to use the **sidekiq** adapter to queue up our jobs. This officially throws Sidekiq into our application:

{{< highlight ruby "linenos=table" >}}
# config/application.rb

config.active_job.queue_adapter = :sidekiq
{{< / highlight >}}

Finally – there’s one last thing; sidekiq by default assumes that redis is running on **localhost:6379** – but since the redis server is running in a different container than our Rails app, we need to change this. We need to instead direct our redis traffic to the actual redis container, which we can easily do by using the hostname “**redis**.” To do that – we just need to add a simple initializer:

{{< highlight ruby "linenos=table" >}}
# config/initializers/sidekiq.rb

Sidekiq.configure_server do |config|
  config.redis = { url: 'redis://redis:6379' }
end
 
Sidekiq.configure_client do |config|
  config.redis = { url: 'redis://redis:6379' }
end
{{< / highlight >}}

And that’s it – we’re done!

Running our Application
-----------------------

This part’s super easy; we’ve set everything up, and now we just need to run our app with docker-compose!

{{< highlight shell "linenos=table" >}}
docker-compose up
{{< / highlight >}}

# This may take a while the first time you run it

This will handle building all of the images that are custom, as well as pulling down and installing the other images from [Docker Hub](https://hub.docker.com/). Our app is officially up and running now with Docker, so let’s test it with the same curl command we had before:

{{< highlight shell "linenos=table" >}}
curl -X POST 'http://localhost:3000/comments' -d "comment[body]=foo" -d "comment[user_id]=2" -d "comment[post_id]=1"
{{< / highlight >}}

If everything’s set up properly, you should get a successful JSON response that includes the comment record you just created. This command still works because we’re mapping port 3000 of our Rails app container to port 3000 on the Docker host (which is our local machine) – so we can communicate with it the same way we did before. After you issue that POST request, jump to http://localhost:1080 to see Maildev in action – and you can see the exact email you just created!

![Example of Maildev](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/running-a-rails-app-with-docker/maildev-example.png)

Final Thoughts
--------------

While Docker is definitely a hot topic right now, will it stand the test of time? Who knows – but the concepts behind containerization are here to stay – that much we know for sure, and Docker is really helping to push that movement forward. If you enjoyed this post about Docker and want to check out how companies use containerization in the real world, you should read more into the [microservice](https://en.wikipedia.org/wiki/Microservices) architecture. Microservices have been around for a while, but with the popularization of Docker (and containers in general), it’s being talked about a lot more as a viable architecture for even small- to mid-size projects.

You’ve now got the knowledge, so when you get a chance, play around with Docker and see if it’s right for your Rails app. The answer could be yes – or it could be no, and either is okay! Docker is a neat tool, but only you can decide if it fits your project’s needs.

P.S. If you’d like to pull down the code we discussed here, check out [the demo](https://github.com/alkrauss48/demos/tree/master/rails-docker-blog-demo) based on this blog post.
