---
title: "Building a JSON API with Rails – Part 1: Getting Started"
date: "2015-02-20"
categories:
- Blog
tags:
- Ruby
draft: "false"
---
**Foreword**:

This series has been rewritten as of **November 11, 2016** based on the new API features in Rails 5. Formerly, this post covered the use of the rails-api gem, which has now been merged into core Rails 5.

If you want to skip all the reading and just see an example API built using the exact technologies I’ll be discussing in this series of posts, check out my [GitHub repo](https://github.com/alkrauss48/talks/tree/master/okcrb-api) over a Ruby talk I gave where we live-coded a full API.

* * *

**Table of Contents**

*   Part 1 – Getting Started
*   [Part 2 – Serialization](/2015/03/building-a-json-api-with-rails-part-2-serialization/)
*   [Part 3 – Authentication Strategies](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/)
*   [Part 4 – Implementing Authentication](/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/)
*   [Part 5 – Afterthoughts](/2015/12/building-a-json-api-with-rails-part-5-afterthoughts/)
*   [Part 6 – The JSON API Spec, Pagination, and Versioning](/2017/02/building-a-json-api-with-rails-part-6-the-json-api-spec-pagination-and-versioning/)

* * *

How can you go about supporting your Angular/Ember/Backbone app, iOS app, Android app, Windows phone app, etc., all with a single back-end? Here?s how: by breaking up your backend server into its own API service, and Rails is just the framework to help make it simple and awesome.

This service separation is dubbed Service Oriented Architecture ([SOA](http://en.wikipedia.org/wiki/Service-oriented_architecture)), and by following it and building a JSON API that’s separate from the front-end, you’ll be able to support all of your related apps with this single service and keep your back-end incredibly simple, logical, and easily maintainable.

In order to build a solid API, we’re going to break our goal up into 3 different tasks:

*   Build out our models and our data
*   Serialize our data
*   Add Authentication

Adding authentication is always an optional step, but most of the time you’re going to want to prevent unauthorized users from accessing your API. We’re going to tackle just the first task in this post, and save the rest for the next two parts. Ready to start? Good.

Starting Out
------------

First off, we install rails similarly to how you’ve always done it – but with the new Rails 5 API flag.

{{< highlight bash "linenos=table" >}}
rails new my_blog --api
cd my_blog
{{< / highlight >}}

As you can probably see, we’re going to be creating a blog, and it will have the following database structure:

*   User has many Posts
*   User has many Comments
*   Posts has many Comments

Building the API
----------------

Just a simple 3-table database will suffice, so let’s use the rails generators to scaffold out our 3 models:

{{< highlight bash "linenos=table" >}}
rails g scaffold user email:string password:string auth_token:string
rails g scaffold post title:string body:text user:references
rails g scaffold comment body:text user:references post:references
rake db:migrate
{{< / highlight >}}

If you’re familiar with Rails, then this looks very familiar to you. In fact, you can probably tell very easily what each attribute’s purpose is – except for **auth\_token** perhaps. We’re going to make use of that attribute later on when we discuss and build in authentication, so don’t worry about it for now.

After you migrate your database, then you have a fully functioning API! Start up your local rails server and navigate to

{{< highlight shell "linenos=table" >}}
http://localhost:3000/users
{{< / highlight >}}

to see your API live. It should look like an empty array set, which is what we want – just pure JSON.

Seeding the Database
--------------------

{{< highlight ruby "linenos=table" >}}
# db/seeds.rb

u1 = User.create(email: 'user@example.com', password: 'password')
u2 = User.create(email: 'user2@example.com', password: 'password')
 
p1 = u1.posts.create(title: 'First Post', body: 'An Airplane')
p2 = u1.posts.create(title: 'Second Post', body: 'A Train')
 
p3 = u2.posts.create(title: 'Third Post', body: 'A Truck')
p4 = u2.posts.create(title: 'Fourth Post', body: 'A Boat')
 
p3.comments.create(body: "This post was terrible", user: u1)
p4.comments.create(body: "This post was the best thing in the whole world", user: u1)
{{< / highlight >}}

Now, all you need to do to run these seeds is update your User and Post model files with the necessary **has\_many** relationships like so:

{{< highlight ruby "linenos=table" >}}
# app/model/user.rb

class User < ActiveRecord::Base
  has_many :posts
  has_many :comments
end
{{< / highlight >}}

{{< highlight ruby "linenos=table" >}}
# app/model/post.rb

class Post < ActiveRecord::Base
  has_many :comments
end
{{< / highlight >}}

And then run the seed command to pre-populate your database:

{{< highlight shell "linenos=table" >}}
rake db:seed
{{< / highlight >}}

Now your database has real data!

Issuing Requests
----------------

Because we scaffolded our resources, we created controllers that are fully capable of handling the standard HTTP requests types: **GET**, **POST**, **PUT/PATCH**, and **DELETE**. If you’re a little unfamiliar with these names, you can map it to the common **CRUD** acronym:

*   **C**reate (POST)
*   **R**ead (GET)
*   **U**pdate (PUT/PATCH)
*   **D**elete (DELETE)

The URLs for issuing any of these requests are:

{{< highlight html "linenos=table" >}}
http://localhost:3000/users
http://localhost:3000/posts
http://localhost:3000/comments
{{< / highlight >}}

You can obviously issue GET requests by visiting these pages in your browser, or you can use the **curl** command from your terminal (or similar command) to issue any of these requests. Everything will work as expected.

That’s it?
----------

No, of course that’s not it, but look at what we’ve done so far – we’ve built a relational database with a fully functioning JSON API on top that can handle any of the 4 main request types, and we did it in practically no time flat. We have a lot more to talk about such as serialization, authentication, and an overview post discussing some of the bigger questions that come up when you’re building an API, so if you’re ready, feel free to [move onto part 2](http://thesocietea.org/2015/03/building-a-json-api-with-rails-part-2-serialization/ "Building a JSON API with Rails ? Part 2: Serialization").

Happy API Building!
