---
title: "Building a JSON API with Rails – Part 5: Afterthoughts"
date: "2015-12-11"
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
*   [Part 2 – Serialization](/2015/03/building-a-json-api-with-rails-part-2-serialization/)
*   [Part 3 – Authentication Strategies](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/)
*   [Part 4 – Implementing Authentication](/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/)
*   Part 5 – Afterthoughts
*   [Part 6 – The JSON API Spec, Pagination, and Versioning](/2017/02/building-a-json-api-with-rails-part-6-the-json-api-spec-pagination-and-versioning/)

* * *

This post has been a long time coming, but I wanted to address some topics about building a JSON API with rails that didn’t fully fit into the actual building process of our API. If you’re unfamiliar about building a JSON API with rails at all, then I’ll direct you to the [very first post](/2015/02/building-a-json-api-with-rails-part-1-getting-started/) in this series and you can start there. In this final post, I wanted to discuss some topics such as testing, CORS, filtering data, nested vs. flat routing architecture, and more. Basically things that I find valuable to know about as I build my own rails APIs. Let’s get to it!

Flat vs Nested Routing Architecture
-----------------------------------

Which is better to use – flat or nested routes? I get asked this question quite a bit, and before I get into it, let me demonstrate what each route type means. Let’s say that I have a **comment** with an ID of 4. Whether I use nested or flat routes, my GET request to this endpoint would look like this:

{{< highlight shell "linenos=table" >}}
GET /comments/4
{{< / highlight >}}

And that’s it – very easy. Now let’s take that up a notch. What if I want to find all **comments** that exist for a certain **post**, and that post has an ID of 1. Here is where we deviate between these two routing types. A nested route to this endpoint might look something like this:


{{< highlight shell "linenos=table" >}}
# Nested Route

GET /posts/1/comments
{{< / highlight >}}

While a flat route would look like this:

{{< highlight shell "linenos=table" >}}
# Flat Route

GET /comments?post_id=1
{{< / highlight >}}

See the difference? Nested routes make use of nesting resource names and/or IDs, while flat routes limit the route endpoint to just one resource name and pass in the rest of the necessary information as URL parameters. So which one is better?

Well, nested routing looks prettier, I think we all agree there – but I prefer to use flat routing as I’m building out my API endpoints. Why, you might ask? Well, for two reasons:

**It keeps things simpler**. With flat routes, I only have one way to access exactly the data that I need. This becomes important when we start dealing with [associative entities](https://en.wikipedia.org/wiki/Associative_entity). For example, a comment can belong to either a post or a user. With nested resources, that means I have multiple endpoints that I can access comments with: /comments, /users/1/comments, or /posts/1/comments. With flat routing – I just have one: /comments.

**It works better with client-side packages such as [Ember Data](https://github.com/emberjs/data), [RESTangular](https://github.com/mgonto/restangular), [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource), etc.** By default, these libraries like to use flat routes and are much easier to work with if you do keep the routes flat and just pass in the necessary data as URL params.

tl;dr – I like flat routes much better, and always use them over nested routes when building a JSON API.

CORS
----

[CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) is short for Cross-Origin Resource Sharing, which is a mechanism that allows for resources to be accessed by domains that are outside of the host domain. By default, this is turned off, which means that if your API exists on another domain than where you’re requesting the data, then that request will be denied unless CORS is turned on for that domain. **Note:** This only affects client-side requests. Server-side requests or cURL will still work just fine, regardless of CORS.

Rails has a built-in way to configure CORS, and I used that for a bit, but it honestly got to be a pain to deal with after a while. Instead, I recommend you use the gem [rack-cors](https://github.com/cyu/rack-cors) to handle all of your CORS needs. With this gem installed, for example, in order to allow GET, POST, and OPTIONS requests for all domains, this is all you need to add into your config/application.rb:


{{< highlight ruby "linenos=table" >}}
# config/application.rb

config.middleware.insert_before 0, "Rack::Cors" do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :options]
  end
end
{{< / highlight >}}

See how easy that is! And with rack-cors’ nice DSL, you can see it’s really easy to configure CORS just like you want to.

No Views
--------

If you followed along with this series and built a JSON API alongside while reading, then you may have noticed that there are no views or layouts. This is completely intentional, and the reason we don’t have those are because we don’t need them! All we’re doing in a JSON API is returning JSON – no HTML/CSS/JS necessary. This simplifies things immensely compared to a full rails web app. You can sort of substitute serializers for views however, since they modify our response, but they’re still significantly easier to deal with than full view templates.

No #edit or #new Controller Actions
-----------------------------------

If you’ve built a rails app before, you may be familiar with the 7 default controller actions that a resource has: Index, Show, New, Create, Edit, Update, and Delete. But in our API, we’re missing two of those – Edit and New. Why?

Edit and New, contrary to their names, actually both correspond to GET requests and are specifically triggered when you access a page (typically that has a form) which will eventually submit a POST or PUT request. You need this preliminary GET request to happen in order to provide any necessary data prior to submitting your POST or PUT request.

With a JSON API, you don’t have any web pages that you’re interacting with, so you don’t need to load anything prior to submitting your POST or PUT request – you just submit it. Because of that simplicity, you don’t need the Edit or New actions anymore, so we just remove them all together. See, using rails just as an API is simpler than using it as a full web application platform!

Filtering Resources
-------------------

Earlier, I recommended using flat routes over nested routes, and part of that is because of how easy it allows you to filter resources based on your URL params. In order to filter our resources by any data attribute at all, all we need to do is change one line in our index actions – let’s do an example with our comments controller.

This is the original code for the **index** action:

{{< highlight ruby "linenos=table" >}}
# app/controllers/comments_controller.rb

def index
  @comments = Comment.all

  render json: @comments
end
{{< / highlight >}}

And we’re just going to change the first line of the action to this:

{{< highlight ruby "linenos=table" >}}
# app/controllers/comments_controller.rb

def index
  @comments = Comment.where(comment_params)

  render json: @comments
end
{{< / highlight >}}

And that’s it! Now, we can filter comments not only by post\_id or user\_id, but by any attribute that our strong parameters method whitelists – such as body. For example, any of these will work as expected:

{{< highlight shell "linenos=table" >}}
GET /comments?user_id=1
GET /comments?post_id=1
GET /comments?body=This is a body
{{< / highlight >}}

Testing
-------

Last but not least, I wanted to cover testing a JSON API. This could easily be a blog post on its own – or a series of blog posts, really – so I just want to give the gist of how to begin testing your API. There are multiple libraries that provide testing features for your rails apps – some of the common ones being:

*   TestUnit
*   Cucumber
*   Minitest
*   RSpec

My personal preference for a testing library is [RSpec](http://rspec.info/). When you test an API, a majority of your tests will mostly likely test the controller, but there are more categories of tests that you should write than just controller tests. I’ll list out the categories that I test for, with an example of each (examples given using RSpec):

### Routing Tests

Routing tests should be written in order to verify that each of your individual request types end up making it to their intended controller action:

{{< highlight ruby "linenos=table" >}}
# routing_test.rb

it "routes to #index" do
  expect(get: "/comments").to route_to("comments#index")
end
{{< / highlight >}}

### Request Tests

Request tests should be written in order to verify that your basic requests either respond successfully (200 status code) or unsuccessfully (400 status code) – due to good or bad authentication. These would need to be written with your specific API auth structure in mind, but here’s a simple example:

{{< highlight ruby "linenos=table" >}}
# request_test.rb

it "won't work without authentication" do
  get comments_path
  expect(response.status).to be(401)
end

it "will work with authentication" do
  get comments_path, {}, valid_session
  expect(response.status).to be(200)
end
{{< / highlight >}}

### Model Tests

These are tests you may be familiar with, and are written in order to test out model methods, validations, scopes, and more things that are defined in the models. For our example, let’s assume that in order to successfully create a comment, it requires both a post\_id and a user\_id. To test for that, we could write a test like this:

{{< highlight ruby "linenos=table" >}}
# model_test.rb

it "should have errors if created with no user or post id" do
  comment = Comment.create
  expect(comment.save).to eq(false)
  expect(comment.errors.messages).to have_key(:user)
  expect(comment.errors.messages).to have_key(:post)
end
{{< / highlight >}}

### Controller Tests

Controller tests are going to be where all of your business logic should be tested – and thus these are usually the most complex. At the very least, you should test for both **successes** and **failures** for all of your controller actions – and thus test out all necessary request types such as GET, POST, PUT/PATCH, and DELETE. If you have any additional logic – which you probably will – then you’ll want to build tests for those too. 100% code coverage is the goal – so if you add in new logic, make sure you build some tests for it! Because there are a ton of different controller tests you can build, I’m just gonna show you two simple tests – one for a GET request to the #show action, and one for a POST request to the #create action:

{{< highlight ruby "linenos=table" >}}
# controller_tests.rb

RSpec.describe CommentsController, type: :controller do
  describe "GET show" do
    it "assigns the requested comment as @comment" do
      comment = Comment.create! valid_attributes
      get :show, {id: comment.to_param}, valid_session
      expect(assigns(:comment)).to eq(comment)
    end
  end

  describe "POST create" do
    it "creates a new Comment" do
      expect {
        post :create, valid_attributes, valid_session
      }.to change(Comment, :count).by(1)
    end
  end
end
{{< / highlight >}}

Like I said, these are pretty basic examples of how to write API tests, but you should always make sure that you do actually build tests for your project. Personally, I don’t practice TDD – I usually write my tests after I have written my actual logic, and then fix anything that came up, but regardless of what testing practices you follow, having your project supported by tests will make it much less brittle when updating and will be significantly easier for you and/or your team to manage in the future.

If your API has mailers, then you’ll want to write tests for those too. In addition to RSpec, I like to use the gems [Factory Girl](https://github.com/thoughtbot/factory_girl) – to help spawn dummy objects easier – and [Database Cleaner](https://github.com/DatabaseCleaner/database_cleaner) – to ensure that my testing environment stays clean between tests.

Conclusion
----------

We covered a lot of various topics here, and this was kind of my concluding post to address the different things that might be important to know as you’re starting to build out your own JSON API using rails. This is officially the final post of this series, so I hope you enjoyed it! If you’re new to this series, then I highly recommend you begin back at [the first post](/2015/02/building-a-json-api-with-rails-part-1-getting-started/) which talks about getting started on how to build a JSON API with rails.

Now that you have the skills – make sure you use them responsibly. Just like Captain Planet says, _the power is yours!_
