---
title: Building a Simple Web Server with Sinatra
date: "2015-05-22"
categories:
- Blog
tags:
- Ruby
draft: "false"
---
You might have run into a few different scenarios in which you need some type of server-side logic to happen on the web, but you don’t need anything massive to warrant the use of large frameworks like Rails, Django, Grails, ASP.Net, etc. No, you haven’t run into those situations? I doubt that, but let me spell out a few different instances where you might want this:

*   To proxy a client-side HTTP request, either to avoid [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) or to avoid Javascript
*   To relay HTTP requests from one site to another, formatting data along the way.
*   To provide a simple API to interact with a database
*   To easily render HTML pages with dynamic content

The list goes on and on, but the point I’m trying to make is that this need does exist. What do you do when you need something like this, but don’t want to make a large project? Different languages have different mini-frameworks to handle this need, and today we’re going to be talking about one that really played a role in starting this mini-framework movement. Ruby’s [Sinatra](http://www.sinatrarb.com/).

What is Sinatra?
----------------

Straight from the main site, Sinatra is a [DSL](http://en.wikipedia.org/wiki/Domain-specific_language) for quickly creating web applications in Ruby with minimal effort. There is heavy emphasis on the “minimal effort” part of that definition, as you’re about to see.

Getting Started
---------------

To get started, create an empty directory. Inside that directory, create a Gemfile and add the following to it:

{{< highlight ruby "linenos=table" >}}
# Gemfile

gem 'sinatra'
{{< / highlight >}}

Then to install sinatra, run:

{{< highlight shell "linenos=table" >}}
# Gemfile

gem 'sinatra'
{{< / highlight >}}

Now let’s create our actual main app.rb file:

{{< highlight ruby "linenos=table" >}}
# app.rb

require 'sinatra'

get '/' do
  puts 'hello world'
end
{{< / highlight >}}

And that’s literally all you need for the simplest web server. Run your app using:

{{< highlight bash "linenos=table" >}}
ruby app.rb
{{< / highlight >}}

And Sinatra will start up a default WEBrick server (just like Rails) on port 4567. Navigate to http://localhost:4567 now and you’ll see a blank screen. If you use your browser to navigate there, you won’t see anything, but you can look at your server logs to see the ‘hello world’ response. Look at that – we just created a simple web server. It doesn’t do much right now, but you’re a programmer – that’s your job to make it do real stuff.

Getting Deeper
--------------

Sinatra, just like most web frameworks, has a concept of routes in order to handle various HTTP request types – with the most common requests abiding by a [REST](http://en.wikipedia.org/wiki/Representational_state_transfer)ful architecture. Currently, our app just handles one GET request, as is identified by the **get** method call which accepts a route string and a block. To handle POST, PUT, or DELETE requests, you can write handlers such as:

{{< highlight ruby "linenos=table" >}}
# app.rb

post '/post' do
  # Create a post
end

put '/post/:id' do
  # Update a post
end

delete '/post/:id' do
  # Delete a post
end
{{< / highlight >}}

We just defined 4 basic handlers that would respond to various request types to a **post** endpoint. You might have noticed something though – we have a strange **:id** field in our route string. That indicates a parameter value that you can access via a global **params** variable, much like how a Rails controller works. This means that PUT requests to both /post/1 and /post/3 would activate the same handler, but you have easy access to your unique parameter.

Here’s an example:

{{< highlight ruby "linenos=table" >}}
# app.rb

put '/post/:id' do
  @post = Post.find(params[:id]) # Assuming ActiveRecord is installed
end
{{< / highlight >}}

Rendering Views
---------------

Want to render a template when a route is navigated to? That’s easy:

{{< highlight ruby "linenos=table" >}}
# app.rb

get '/' do
  erb :index
end
{{< / highlight >}}

And this will pull up the template found in views/index.erb. You can also easily swap out ERB for a templating engine of your choice, like Haml or Slim:

{{< highlight ruby "linenos=table" >}}
# app.rb

get '/' do
  haml :index, :format => :html5
end
{{< / highlight >}}

Just make sure you have the gem required!

Handling JSON Responses
-----------------------

A lot of the reasons I listed in the intro as to why you might want to use Sinatra involve nothing graphical – just some logic happening. You may even want to handle JSON responses for your request, and Sinatra makes that a breeze. Just call the content\_type method and define that you want to use JSON:

{{< highlight ruby "linenos=table" >}}
# app.rb

get '/post/:id' do
  content_type :json

  @post = Post.find(params[:id])
  @post.attributes.to_json # JSON Response
end
{{< / highlight >}}

It’s that easy! You can define your content\_type on an application-level, but it adds a little more complexity that you can get into yourself if you choose to use Sinatra. Still, it’s super easy.

Handling Errors
---------------

You can’t beat error handling in Sinatra. It’s so simple, and follows the same format as our other handlers have followed. Let’s say you want to catch a 422 error – that means unprocessable entity. Here’s how you would define it:

{{< highlight ruby "linenos=table" >}}
# app.rb

# Unprocessable Entity
error 422 do
  { error: "You haz an error" }
end
{{< / highlight >}}

Now if you want to manually throw that error from a controller, you would do that like this:

{{< highlight ruby "linenos=table" >}}
# app.rb

# Unprocessable Entity
get '/' do
  return 422
end
{{< / highlight >}}

Sinatra will see your return value and know to call the 422 error code handler. This means that you probably shouldn’t return single integer values from your RESTful controllers – but you probably don’t do that anyway.

Deploying to [Heroku](https://www.heroku.com/)
----------------------------------------------

Last but not least, possibly one of my favorite things about using Sinatra is that it is fully Heroku supported! This means that you don’t even have to worry about manually deploying this app – Heroku will handle everything and you can slap it on a free heroku domain to get up and running right away. If you’re unfamiliar with Heroku or how to get going with a heroku app, check out their [Getting Started](https://devcenter.heroku.com/start) page.

In order to tell Heroku how to run our Sinatra app, we need to add either a Procfile or a config.ru. We’ll choose to do a config.ru to tell Heroku to run it as a [rack](http://rack.github.io/) app, but a Procfile is just as easy. Create this file at the root level of your project dir (the same directory where your app.rb should currently be):

{{< highlight ruby "linenos=table" >}}
# config.ru

require './app'

run Sinatra::Application
{{< / highlight >}}

All we’re doing here is requiring the main app file that you just wrote, and then telling Sinatra to do its thing. Now commit all of your work with Git and push this whole repo up to your heroku account:

{{< highlight bash "linenos=table" >}}
git push heroku master
{{< / highlight >}}

And watch while the magic happens. You’ve just created a simple web server using Sinatra, and Heroku is happy to host it for you completely free of charge.

* * *

There’s so much more Sinatra can do, and we just touched on some very light basics. If you need a full blown RESTful application hooked up to a large relational database, then yeah, use a framework that’s geared towards handling that large scale. But if you need something small or medium in size, then check out Sinatra or some other micro-frameworks. Sinatra’s popularity has inspired similar frameworks in other languages too like Java’s [Spark](http://sparkjava.com/), Python’s [Flask](http://flask.pocoo.org/), PHP’s [Slim](http://www.slimframework.com/), and [a bunch of others](http://en.wikipedia.org/wiki/Sinatra_%28software%29#Frameworks_inspired_by_Sinatra).

For more about using Sinatra, check out the [documentation](http://www.sinatrarb.com/intro.html). Next time we’ll talk about some neat tools you can use to help debug your Sinatra app before you deploy. Happy building!
