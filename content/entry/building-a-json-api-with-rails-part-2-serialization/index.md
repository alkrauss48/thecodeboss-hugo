---
title: "Building a JSON API with Rails – Part 2: Serialization"
date: "2015-03-27"
categories:
- Blog
tags:
- Ruby
draft: "false"
---
**Foreword**:

This series has been rewritten as of **November 11, 2016** based on the new API features in Rails 5. Formerly, this post covered the use of the rails-api gem, which has now been merged into core Rails 5.

* * *

**Table of Contents**

*   [Part 1 – Getting Started](/2015/02/building-a-json-api-with-rails-part-1-getting-started/)
*   Part 2 – Serialization
*   [Part 3 – Authentication Strategies](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/)
*   [Part 4 – Implementing Authentication](/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/)
*   [Part 5 – Afterthoughts](/2015/12/building-a-json-api-with-rails-part-5-afterthoughts/)
*   [Part 6 – The JSON API Spec, Pagination, and Versioning](/2017/02/building-a-json-api-with-rails-part-6-the-json-api-spec-pagination-and-versioning/)

* * *

Welcome to part 2 of our API building adventure. If you haven’t read [Part 1: Getting Started](/2015/02/building-a-json-api-with-rails-part-1-getting-started/ "Building a JSON API with Rails ? Part 1: Getting Started") yet, then I highly recommend you go through that post real quick to make sure we’re all on the same page. We’ll be continuing to develop on our Blog API which uses three relational tables: **User**, **Post**, and **Comment**. In the last post, we focused on setting up a basic JSON API using Rails, preparing our database, and reviewing how to issue requests to that API. Today, we’re going to take the power of our API to another level with [serialization](http://en.wikipedia.org/wiki/Serialization).

Serialization
-------------

So what exactly does it mean to _serialize_ our API? Currently when we make a GET request to one of our API endpoints (like **/users/1** or **/posts/1**), we get back all of that object’s attributes from the database record (or multiple objects’ attributes, if querying an _index_ action). This might seem okay at first, but let me give you an example of how this is undesirable. When we query **/users/1**, we will get all of that user’s data – including the unencrypted password. That’s a huge security flaw. Additionally, what if we wanted to query that same endpoint and return each of that user’s posts in addition to their user attributes? We can’t do that right now. That’s where serialization will help us.

We employ serialization in APIs to properly handle the response from our GET requests to the API and format the data exactly how we want. Could we handle this directly in the controllers? Yes, but that gets real messy real quick, and it all goes back to our concept of [SOA](http://en.wikipedia.org/wiki/Service-oriented_architecture) – Service Oriented Architecture. Controllers are meant to handle the business logic of our app, and not focus on formatting a response – but handling response data is exactly what serializers are for, so let’s use them and keep our API clean and modular!

Setting It Up
-------------

There are different ways we can apply serialization in Rails, and all of them involve gems. The three most common serialization gems are:

*   [ActiveModelSerializers](https://github.com/rails-api/active_model_serializers)
*   [Rabl](https://github.com/nesquena/rabl)
*   [JBuilder](https://github.com/rails/jbuilder)

Each of these gems are very well supported and have hundreds of forks on GitHub, but I prefer to use ActiveModelSerializers (AMS) – predominantly because right out of the box it plays very nicely with Ember.js via Ember Data’s [ActiveModel Adapter](https://github.com/ember-data/active-model-adapter). If you’ve used Ember, then you know it’s very powerful, but you have to play by its rules – and using AMS allows you to do that. If you don’t use Ember, AMS is still a wonderful serializer and is very Rails-esque in syntax.

Let’s install AMS by adding it to our Gemfile:

{{< highlight ruby "linenos=table" >}}
# Gemfile

gem 'active_model_serializers', '~> 0.8.3'
{{< / highlight >}}

Then run a bundle install. AMS comes built-in with generators, so to create a serializer for our User resource for instance, we just run:

{{< highlight bash "linenos=table" >}}
rails g serializer user
{{< / highlight >}}

And that will create the following file:

{{< highlight ruby "linenos=table" >}}
# app/serializers/user_serializer.rb

class UserSerializer < ActiveModel::Serializer
  attributes :id
end
{{< / highlight >}}

Now, if you navigate to your **/users** URL, you should see JSON that looks like this:

{{< highlight json "linenos=table" >}}
// http://localhost:3000/users

{users: [{id: 1},{id: 2}]}
{{< / highlight >}}

This is different from what we’ve seen in two ways.

1.  We now have a root **users** key and are returning a JSON object instead of an array of JSON objects.
2.  We are only rendering the id, and no other data on the User objects. That means no more exposed passwords!

See how simple that was? This same serialization pattern will also carry over for all of your controller actions that handle GET requests that return JSON. Now go ahead and run the serializers for the remaining Post and Comment resources, and then we’ll get into some configuration:

{{< highlight bash "linenos=table" >}}
rails g serializer post
rails g serializer comment
{{< / highlight >}}

Configuring the Serializers
---------------------------

We won’t go into full configuration options here, as you’re better off checking the AMS [documentation](https://github.com/rails-api/active_model_serializers/tree/0-8-stable) for that, but we’ll go into the core options that will help you the most. If you want to return more model fields than just your ID, then you just need to add them to the **attributes** method call like so:

{{< highlight ruby "linenos=table" >}}
# app/serializers/user_serializer.rb

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at
end
{{< / highlight >}}

And now when you query your User endpoints, you’ll receive the _email_ and _created_at_ fields too – easy as pie! But that’s not all. Let’s say you wanted to query a User endpoint and return each of those user’s posts too. Well that’s easy, and here’s where you really see the Rails-y design of AMS:

{{< highlight ruby "linenos=table" >}}
# app/serializers/user_serializer.rb

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at

  has_many :posts
end
{{< / highlight >}}

And wallah! You are now returning each user’s posts when you query a user – and the JSON data for each post will also follow the configuration in the serializer created for the Post resource.

I just have one last serializer configuration I wanted to share. Occasionally, you may want to modify the data that you return in JSON, but because this specific alteration is only meant for serialization cases, you don’t want to dirty up the model files by creating a model method. AMS provides a solution for that. You can create a method inside your serializer and therein access the current object being serialized, and then call that method with the same syntax as if it were an attribute on that object. Doesn’t make sense? Take a look at this example:

{{< highlight ruby "linenos=table" >}}
# app/serializers/user_serializer.rb

class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :say_hello

  has_many :posts

  def say_hello
    "Hello #{object.email}!"
  end
end
{{< / highlight >}}

Now our serializer would spit out a **say_hello** JSON key that would have as its value the word “Hello” followed by that user’s email address. You access the current serialized object via the ‘object’ variable inside of any method you define inside your serializer. Nifty, huh? **Pro Tip**: You can also add model methods into your **attributes** method call, and don’t have to redefine them in the serializer.

One last thing (didn’t I already say that above?): If you don’t like the JSON syntax of having a root key like **user** or whatever resource you’re querying, then you can go back to the old syntax we had where it strictly returns either just the JSON representation of the object (e.g. show), or an array of JSON objects (e.g. index). You just have to add a short method in your application_controller.rb to set it globally:

{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

def default_serializer_options
  { root: false }
end
{{< / highlight >}}

Wrap Up
-------

That’s it for serializer configuration that we’re going to cover in this post, but there’s a lot of other neat options you can play with using AMS. As I mentioned earlier, I initially chose AMS over other serialization gems because of how nicely it plays with Ember.js, but it’s built to be completely agnostic of whatever front-end framework you use. For example, I’m currently working on a large Angular.js app, and AMS is still my chosen serialization gem of choice because it does everything I need it to (and beautifully at that).

We’ve now covered the actual [building of an API](/2015/02/building-a-json-api-with-rails-part-1-getting-started/ "Building a JSON API with Rails ? Part 1: Getting Started") and serializing our JSON response to format it exactly like we want. Technically this is all you need in your server-side API, but I want to review one more very important topic: **Authentication**. After all, there’s a big chance that you plan to build an API that houses personal data that you don’t want everybody in the whole world to be able to query. In the next post, we’ll cover how to authenticate your requests so that only you can access your personal data, and no one else can!

[Continue on in part 3](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/) of this series: Authentication Strategies.
