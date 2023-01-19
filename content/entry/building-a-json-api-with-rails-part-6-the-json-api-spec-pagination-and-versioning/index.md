---
title: "Building a JSON API with Rails – Part 6: The JSON API Spec, Pagination, and Versioning"
date: "2017-02-09"
categories:
- Blog
tags:
- Ruby
draft: "false"
---
**Table of Contents**

*   [Part 1 – Getting Started](/2015/02/building-a-json-api-with-rails-part-1-getting-started/)
*   [Part 2 – Serialization](/2015/03/building-a-json-api-with-rails-part-2-serialization/)
*   [Part 3 – Authentication Strategies](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/)
*   [Part 4 – Implementing Authentication](/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/)
*   [Part 5 – Afterthoughts](/2015/12/building-a-json-api-with-rails-part-5-afterthoughts/)
*   Part 6 – The JSON API Spec, Pagination, and Versioning

* * *

Throughout this series so far, we’ve built a really solid JSON API that handles serialization and authentication – two core concepts that any serious API will need. With everything we’ve learned, you could easily build a stable API that accomplishes everything you need for phase 1 of your project – but if you’re building an API that’s gonna be consumed by a large number of platforms and/or by a complex front-end, then you’ll probably run into some road blocks before too long. You might have questions like “what’s the best strategy to serialize data?,” or “how about pagination or versioning – should I be concerned that I haven’t implemented any of that yet?” Those are all good questions that we’re going to address in this post – so keep following along!

The JSON API Spec
-----------------

[Active Model Serializers](https://github.com/rails-api/active_model_serializers) – my go-to Rails serialization gem of choice – makes it so simple to control what data your API returns in the body (check out my post on [Rails API serialization](/2015/03/building-a-json-api-with-rails-part-2-serialization/) to learn more about this topic). By default, however, there’s very little structure as to how your data is returned – and that’s on purpose; AMS isn’t meant to be opinionated – it just grants you, the developer, the power to manipulate what your Rails API is returning. This sounds pretty awesome, but when you start needing to serialize several resources, you might start wanting to follow a common JSON response format to give your API a little more structure as well as making documentation easier.

You can always create your own API response structure that fits your project’s needs – but then you’d have to go through and document why things are the way they are so that other developers can use the API and/or develop on it. This isn’t terrible – but it’s a pain that can easily be avoided because this need has already been addressed via the [JSON API Spec](http://jsonapi.org/).

The JSON API spec is a best-practice specification for building JSON APIs, and as of right now, it’s definitely the most commonly-used and most-documented format for how you should return data from your API. It was started in 2013 by [Yehuda Katz](http://yehudakatz.com/) (former core Rails team member) as he was continuing to help build [Ember.js](http://emberjs.com/), and it officially hit a stable 1.0 release in May of 2015.

If you take a look at the actual spec, you’ll notice that it’s pretty in-depth and might look difficult to implement just right. Luckily, AMS has got our back by making it stupid-simple to abide by the JSON API spec. AMS determines JSON structure based on an [adapter](https://github.com/rails-api/active_model_serializers/blob/master/docs/general/adapters.md), and by default, it uses what’s called the “attributes adapter.” This is the simplest adapter and puts your raw data as high up in the JSON hierarchy as it can, without thinking about any sort of structure other than what you have set in the serializer file. For a simple API, this works; but for a complex API, we should use the JSON API spec.

To get AMS to use the JSON API spec, we literally have to add one line of code, and then we’ll automatically be blessed with some super sweet auto-formatting. You just need to create an initializer, add the following line, and restart your server:

{{< highlight ruby "linenos=table" >}}
# config/initializers/active_model_serializers.rb

ActiveModelSerializers.config.adapter = :json_api
{{< / highlight >}}

Let’s do a quick show-and-tell, in case you want to see it in action before you try it. Assuming we have the following serializer for a **post**:

{{< highlight ruby "linenos=table" >}}
# app/serializers/post_serializer.rb

class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :body
 
  belongs_to :user
  has_many :comments
end
{{< / highlight >}}

Then our response will go from this:

Attributes Adapter

{{< highlight json "linenos=table" >}}
# Attributes Adapter

{
  "id": 1,
  "title": "Ruby - for when Python just can't cut it.",
  "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "user": {
    "id": 1,
    "first_name": "Johnny",
    "last_name": "User",
    "email": "user@example.com"
  },
  "comments": [
    {
      "id": 1,
      "body": "Ruby is pretty rootin' tootin' neat."
    }
  ]
}
{{< / highlight >}}

to this!

{{< highlight json "linenos=table" >}}
# JSON API Adapter

{
  "data": {
    "id": "1",
    "type": "posts",
    "attributes": {
      "title": "Ruby - for when Python just can't cut it.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    "relationships": {
      "user": {
        "data": {
          "id": "1",
          "type": "users"
        }
      },
      "comments": {
        "data": [
          {
            "id": "1",
            "type": "comments"
          }
        ]
      }
    }
  }
}
{{< / highlight >}}

The JSON API spec also sets a precedent for how paginated resource queries should be structured in the url – which we’re getting to next!

Pagination
----------

Pagination prevents a JSON response from returning every single record in a resource’s response all at once, and instead allows the client to request a filtered response that it can continue querying on as it needs more data. Pagination is one of those things where every project seems to do it differently; there’s very little standard across the board – but there is in fact a best practice way to do it in a JSON API. A paginated resource on the server should always at a minimum tell the client the total number of records that exist, the number of records returned in the current request, and the current page number of data returned. Better paginated resources will also create and return the paginated links that the client can use (i.e. first page, last page, previous page, next page), but they tend to do that in the response body – and that’s not good. The reason this is frowned upon is because while dumping pagination links in the response body may be easy, it really has nothing to do with the actual JSON payload that the client is requesting. Is it valuable information? Certainly – but it’s not raw data. It’s meta-data – and [RFC 5988](https://tools.ietf.org/html/rfc5988) created a perfect place to put such paginated links: the HTTP [Link](https://www.w3.org/wiki/LinkHeader) header.

Here’s an example of a link header:

{{< highlight shell "linenos=table" >}}
# Link Header

Link:
<http://localhost:3000/posts?page=1>; rel="first",
<http://localhost:3000/posts?page=1>; rel="prev",
<http://localhost:3000/posts?page=4>; rel="last",
<http://localhost:3000/posts?page=3>; rel="next"
{{< / highlight >}}

That might seem like a large HTTP header – but it’s blatantly obvious what’s going on, and we’re keeping our response body clean in the process. Now, just like with the JSON API spec, you might be asking if you have to manually add these links in when returning any paginated response – and the answer is no! There are gems out there that do this automatically for you while following best practices! Let’s get into the code.

To start with, we’ll need to use one of the two most popular pagination libraries in Rails: [will\_paginate](https://github.com/mislav/will_paginate) or [kaminari](https://github.com/kaminari/kaminari). It literally doesn’t matter which we pick, and here’s why: both libraries take care of pagination – but they’re really geared towards paginating the older styles of Rails apps that also return server-side rendered HTML views, instead of JSON. On top of that, neither of them follow the best practice of returning paginated links in the Link header. So, are we out of luck? No! There’s a wonderful gem that sits on top of either of these gems called [api-pagination](https://github.com/davidcelis/api-pagination) that takes care of what we need. Api-pagination doesn’t try to reinvent the wheel and create another implementation of pagination; instead, it uses either will\_paginate or kaminari to do the actual logic behind pagination, and then it just automatically sets the Link header (as well as making the code changes that you as the developer have to make much, much simpler).

We’ll use will\_paginate with api-pagination in this example. For starters, add this to your Gemfile:

{{< highlight ruby "linenos=table" >}}
# Gemfile

gem 'will_paginate'
gem 'api-pagination'
{{< / highlight >}}

Next, install them and restart your server:

{{< highlight shell "linenos=table" >}}
bundle install
rails s
{{< / highlight >}}

Let’s update our Post controller to add in pagination. Just like with the JSON API spec above, we only have to make a single line change. Update the post\_controller’s **index** action from this:

{{< highlight ruby "linenos=table" >}}
# app/controllers/posts_controller.rb
def index
  @posts = Post.all
 
  render json: @posts
end
{{< / highlight >}}

to this:

{{< highlight ruby "linenos=table" >}}
# app/controllers/posts_controller.rb
def index
  @posts = Post.all
 
  paginate json: @posts
end
{{< / highlight >}}

Do you see what we did? We just removed the **render** function call and instead added the **paginate** function call that api-pagination gives us. That’s literally it! Now if you query the following route, then you’ll receive a paginated response:

{{< highlight json "linenos=table" >}}
# http://localhost:3000/posts?per_page=1&page=2

{
  "data": [
    {
      "id": "2",
      "type": "posts",
      "attributes": {
        "title": "Who would win between a Ruby Warrior or a Ruby Rogue?",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      },
      "relationships": {
        "user": {
          "data": {
            "id": "1",
            "type": "users"
          }
        },
        "comments": {
          "data": [
            {
              "id": "2",
              "type": "comments"
            }
          ]
        }
      }
    }
  ],
  "links": {
    "self": "http://localhost:3000/posts?page%5Bnumber%5D=2&page%5Bsize%5D=1&per_page=1",
    "first": "http://localhost:3000/posts?page%5Bnumber%5D=1&page%5Bsize%5D=1&per_page=1",
    "prev": "http://localhost:3000/posts?page%5Bnumber%5D=1&page%5Bsize%5D=1&per_page=1",
    "next": "http://localhost:3000/posts?page%5Bnumber%5D=3&page%5Bsize%5D=1&per_page=1",
    "last": "http://localhost:3000/posts?page%5Bnumber%5D=4&page%5Bsize%5D=1&per_page=1"
  }
}

# Link Header
Link:
<http://localhost:3000/posts?page=1>; rel="first",
<http://localhost:3000/posts?page=1>; rel="prev",
<http://localhost:3000/posts?page=4>; rel="last",
<http://localhost:3000/posts?page=3>; rel="next"
{{< / highlight >}}

### Bonus

You’ll notice that after all my babbling about putting paginated links in the HTTP header instead of the response body, they still managed to find themselves in the response body! This is a neat feature of AMS if you’re using the JSON API adapter; it will recognize if you’re using either will\_paginate or kaminari, and will automatically build the right pagination links and set them in the response body. While it’s not a best practice to do this – I’m not too worried about removing them because we’re still setting the HTTP Link header. We’re sort of in this transition period where many APIs are still placing paginated links in the response body – and if the AMS gem wants to place them in there with requiring no effort from the developer, then be my guest. It may help ease the burden of having new clients transition to parsing the Link header.

Now, here’s a little caveat. The JSON API spec has a preferred way of querying paginated resources, and it uses the **page** query object to do so, like in this example:

{{< highlight shell "linenos=table" >}}
http://localhost:3000/posts?page[size]=1&page[number]=2
{{< / highlight >}}

This query is identical to our query above; we just swapped out **per\_page** for **page\[size\]**, and **page** for **page\[number\]**. By default, the links that AMS creates follow this new pattern, but api-pagination by default doesn’t know how to parse that. Don’t worry though, it’s as easy as just adding a simple initializer to allow api-pagination to handle both methods of querying for paginated resources:

{{< highlight ruby "linenos=table" >}}
# config/initializers/api_pagination.rb

ApiPagination.configure do |config|
 
  config.page_param do |params|
    if params[:page].is_a? ActionController::Parameters
      params[:page][:number]
    else
      params[:page]
    end
  end
 
  config.per_page_param do |params|
    if params[:page].is_a? ActionController::Parameters
      params[:page][:size]
    else
      params[:per_page]
    end
  end
 
end
{{< / highlight >}}

And wallah – add this initializer, restart your server, and now your API can handle paginated query params passed in as either **page/****per\_page**, and **page\[number\]**/**page\[size****\]**!

Versioning
----------

The last best practice topic we’ll be covering here is how to properly version your API. The concept of versioning an API becomes important when you need to make non-backwards-compatible changes; ideally, an API will be used by various client applications – and it’s unfeasible to update them all at the same time, which is why your API neds to be able to support multiple versions simultaneously. Because you don’t really need a solid versioning system early-on in the development phase, this is often an overlooked topic – but I really implore you to start thinking about it early because it becomes increasingly more difficult to implement down the road. Spend the mental effort now on a plan to version your API, and save yourself a good deal of technical debt down the road.

Now that I’ve got my soap box out of the way, let’s get down to the best practices of implementing a versioning system. If you Google around, you’ll find that there are two predominant methodologies to how you can go about it:

*   Version in your URLs (e.g. **/v1/posts**)
*   Version via the HTTP [Accept](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html) header

Versioning through your URLs is the easier of the two to understand, and it’s got a big benefit: it’s much easier to test. I can send you a link to a **v1** path as well as a **v2** path – and you can check them both out instantaneously. The drawback however – which is why this way isn’t a best practice – is because the path in your URL should be completely representative of the resource you’re requesting (think **/posts**, **/users/1**, etc.), and which version of the API you’re using doesn’t really fit into that. It’s important – sure – but there’s a better place to put that information: the HTTP Accept header.

The Accept header specifies which [media types](https://en.wikipedia.org/wiki/Media_type) (aka MIME types) are acceptable for the response; this is a perfect use-case for specifying which version of the API you want to hit, because responses from that version are the only ones that you’ll accept!

For our demo, we’re going to specify the version in a custom media type that looks like this:

{{< highlight shell "linenos=table" >}}
application/vnd.example.v1
{{< / highlight >}}

Here, you can easily see how we set the version to **v1** (If you’d like to know how we got this format of media type, check out how MIME [vendor trees](https://en.wikipedia.org/wiki/Media_type#Vendor_tree) work). If we want to query **v2**, then we’ll just swap out the last part of that media type.

Let’s get to some implementation. We won’t need any new gems, but there are a couple of things we do need to do first:

*   Move all of the files in our **app/controllers** directory into a **v1** directory. So the full path of our controllers would then be **app/controllers/v1**.
*   Move all of the code in our controllers into a **V1** module. That looks like this:

{{< highlight ruby "linenos=table" >}}
# app/controllers/v1/posts_controller.rb

module V1
  class PostsController < ApplicationController
  .
  .
  .
  end
end
{{< / highlight >}}

*   Wrap all of our routes in a **scope** function call, and utilize an instantiated object from a new **ApiConstraints** class that we’ll add in (this will filter our routes based on the Accept header).

{{< highlight ruby "linenos=table" >}}
# config/routes.rb

require 'api_constraints'
 
Rails.application.routes.draw do
  scope module: :v1, constraints: ApiConstraints.new(version: 1, default: true) do
    resources :comments
    resources :posts
    resources :users
  end
end
{{< / highlight >}}

We still need to add in the code for our ApiConstraints class, but you can kind of see what’s going on here. We’re specifying that this set of routes will specifically handle any **v1** calls – as well as being the default routes, in case a version isn’t specified.

The **constraints** option in the scope function is powerful and it works in a very specific way: it accepts any sort of object that can respond to a method called **matches?**, which it uses to determine if the constraint passes and allows access to those routes. Now for the last step; let’s add the logic for ApiConstraints. To do this, we’re going to add a file in the **/lib** directory called api\_constraints.rb:

{{< highlight ruby "linenos=table" >}}
# lib/api_constraints.rb

# By Ryan Bates - http://railscasts.com/episodes/350-rest-api-versioning
 
class ApiConstraints
  def initialize(options)
    @version = options[:version]
    @default = options[:default]
  end
 
  def matches?(req)
    @default || req.headers['Accept'].include?("application/vnd.example.v#{@version}")
  end
end
{{< / highlight >}}

You can see here that all this class does is handle the **matches?** method. In a nutshell, it parses the Accept header to see if the version matches the one you passed in – or it will just return true if the default option was set.

If you liked this neat little constraint – then I’m glad, but I take zero credit for this logic. Ryan Bates did a really great [RailsCast](http://railscasts.com/episodes/350-rest-api-versioning) over versioning an API a few years ago, and this is by-the-books his recommendation about how to parse the Accept header.

You’re now all set up with the best practice of specifying an API version via the Accept header! When you need to add a new version, you’ll create new controllers inside of a version directory, as well as add new routes that are wrapped in a versioned constraint. You don’t need to version models.

Final Thoughts
--------------

We covered a lot, but I hope it wasn’t too exhausting. If there’s one common goal towards building a best-practice JSON API, it’s to use HTTP as it’s meant to be used. It’s easy to dump everything in your response body in an unorganized manner – but we can do better than that. Just do your best to follow RESTful practices, and if you have any questions about what you’re doing, then don’t be afraid to look it up; the Internet will quickly guide you down the right path.
