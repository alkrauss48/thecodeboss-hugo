---
title: "Building a JSON API with Rails – Part 4: Implementing Authentication"
date: "2015-04-30"
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
*   Part 4 – Implementing Authentication
*   [Part 5 – Afterthoughts](/2015/12/building-a-json-api-with-rails-part-5-afterthoughts/)
*   [Part 6 – The JSON API Spec, Pagination, and Versioning](/2017/02/building-a-json-api-with-rails-part-6-the-json-api-spec-pagination-and-versioning/)

* * *

After reading the last post discussing [authentication strategies](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/), we now have a firm understanding on how we’re going to add authentication into our API. To recap – we’re going to use **basic authentication** for our initial username/password submission, and then **token-based authentication** on every subsequent request in which we just pass around a token to authenticate ourselves. We didn’t cover any code last time, but I promise it’ll be nothing but code this time.

Phase 1: The Initial Request
----------------------------

First off, we need to add a route that we can access in order to receive a token based on our submitted username and password. To do that, create this route in your **routes.rb** file:

{{< highlight ruby "linenos=table" >}}
# config/routes.rb

get :token, controller: 'application'
{{< / highlight >}}

To handle this route, we’re going to add a **token** action in our **application\_controller.rb**. We’re putting it there because this logic doesn’t belong to any specific controller:

{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

def token
 
end
{{< / highlight >}}

Simple so far, right? Now to add some actual logic to that action. Let’s update it with a handy rails method:

{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

def token
  authenticate_with_http_basic do |email, password|
  end
end
{{< / highlight >}}

The **authenticate\_with\_http\_basic** method is incredibly helpful, and really shows how Rails can help build an awesome API application. This method will parse the incoming request and look specifically for basic authentication information – which is set in the _Authorization_ header. Not only does it automatically gather data from that header, but it will parse out the Base64 encoded username and password and return them to you as parameters inside of a block! How cool is that! As you can see above, I’ve appropriately named the two block parameters to represent this data.

Now if you try navigating to your **/token** endpoint, you’ll receive an error. That’s because the –api flag you used when you first created the project prevented many modules from being automatically included (since you often don’t need them in an API), such as the modules to handle the authenticate\_with\_http\_basic method. You’ll need to include these modules in your application\_controller.rb.

{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

include ActionController::HttpAuthentication::Basic::ControllerMethods
include ActionController::HttpAuthentication::Token::ControllerMethods
{{< / highlight >}}

The first module is the one we need right now. The second module is included to handle an equally awesome token-based authentication method that we’ll use here in a bit.

Let’s finish out this token action:

{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

def token
  authenticate_with_http_basic do |email, password|
    user = User.find_by(email: email)
    if user && user.password == password
      render json: { token: user.auth_token }
    else
      render json: { error: 'Incorrect credentials' }, status: 401
    end
  end
end
{{< / highlight >}}

That’s all we need to add to our token action. With this code, we are authenticating the user to verify they exist in our database and that the submitted password matches up with what we have stored for them. If so, we’ll return their token; otherwise, we return an error.

For the duration of this post, we’ll authenticate ourselves as a user with the username **user@example.com** and a password of **password**. If you included the seeds in your database that’s specified in the **db/seeds.rb** file we discussed in the [very first post](/2015/02/building-a-json-api-with-rails-part-1-getting-started/ "Building a JSON API with Rails ? Part 1: Getting Started"), then this user will already exist in your database.

Let’s make our first request to get this user’s token. First off, we need to get the Base64 encoded string of this user’s username and password. Open up your rails console and type in the following:

{{< highlight ruby "linenos=table" >}}
Base64.encode64("user@example.com:password")
# This returns dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA==\n
{{< / highlight >}}

Now we can build our request and issue it with cURL:

{{< highlight shell "linenos=table" >}}
curl http://localhost:3000/token -H 'Authorization: Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA==\n'
{{< / highlight >}}

This is a complete and valid request using basic authentication. If everything is set up properly, we should receive this back from the API:

{{< highlight shell "linenos=table" >}}
{token: null}
{{< / highlight >}}

Right off the bat it looks like we got an error, but everything’s working exactly as it’s supposed to. We just haven’t actually created any tokens for our users yet! By default, we want each user’s auth\_token to be created when that user is created. To do that, we’ll need to update our user model:


{{< highlight ruby "linenos=table" >}}
# app/models/user.rb

before_create -> { self.auth_token = SecureRandom.hex }
{{< / highlight >}}

Easy enough, right? Now when a new user is created, their auth\_token will be randomly generated. However, the easiest way to make this happen for our existing users is to reset the database and let the seeds run again. To do that, run:

{{< highlight shell "linenos=table" >}}
rake db:reset
{{< / highlight >}}

After the database is reset, we can rerun our initial request to get a valid token:

{{< highlight shell "linenos=table" >}}
curl http://localhost:3000/token -H 'Authorization: Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA==\n'
 
# Returns ...
{token: "861af99a9dbf5e052b8b55cfc41e69d7"}
{{< / highlight >}}

And bam! We got our user’s token! Keep in mind, your token will not be this exact same one since it’s randomized, but it will be in a similar format. Now we can build our token-based authentication, and feel safe knowing that we’ll never need to include our personal password in a request again.

Phase 2: Handling Every Other Request
-------------------------------------

We now have our token for the user that we’re authenticating as. Since we’ll be using this token on every subsequent request to this API, you’ll want to store it in some storage structure like a cookie, session storage, local storage, etc. Now let’s say we want to make a GET request to **/posts/1** to receive data about the first post. Keeping in mind the token-based authentication format that we discussed in [the previous post](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/), we will build our request like so:

{{< highlight shell "linenos=table" >}}
curl http://localhost:3000/posts/1 -H 'Authorization: Token token=861af99a9dbf5e052b8b55cfc41e69d7'
{{< / highlight >}}

In fact, if you make that request right now, it will go through – but that’s because we haven’t built any authentication yet! We want to prevent any resources from being accessed unless the requestor is properly authenticated. To add in the handlers for this authentication, we will again be editing our application\_controller.rb:

{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

before_filter :authenticate_user_from_token, except: [:token]
 
private
 
def authenticate_user_from_token
 
end
{{< / highlight >}}

We are adding a before\_filter hook that will call our created **authenticate\_user\_from\_token** method on every single request, except when the user is requesting the initial token (since they don’t know their token yet at that point). Let’s update that authenticate\_user\_from\_token method now:

{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

def authenticate_user_from_token
  unless authenticate_with_http_token { |token, options| User.find_by(auth_token: token) }
    render json: { error: 'Bad Token'}, status: 401
  end
end
{{< / highlight >}}

And this is actually all we need to add. Remember how we used a fancy authenticate\_with\_http\_basic method in our _token_ action to handle basic authentication? We’re using a similar method here in this hook to handle token-based authentication. The **authenticate\_with\_http\_token** method will look for an incoming request and parse the _Authorization_ header again, but in this case, it looks specifically for a token-based authentication format. We only pass in one value with this form of authentication (which is the token), and you can see above how this method will parse out our token and provide it as a block parameter. We additionally also receive an _options_ parameter, but we won’t be using that.

The logic that we added in our authenticate\_user\_from\_token method will parse an incoming request and validate not only that it is using token-based authentication, but that the token corresponds to an actual user. If the token is valid, then the request continues as normal to **/posts/1**; if the token is invalid (or completely missing), then we will receive an error.

As an example, if we submit this request again that we did earlier:

{{< highlight shell "linenos=table" >}}
curl http://localhost:3000/posts/1 -H 'Authorization: Token token=861af99a9dbf5e052b8b55cfc41e69d7'
{{< / highlight >}}

It will work perfectly and return the first post’s data. But if we change up the token just a little bit and remove that last character like so:

{{< highlight shell "linenos=table" >}}
curl http://localhost:3000/posts/1 -H 'Authorization: Token token=861af99a9dbf5e052b8b55cfc41e69d'
{{< / highlight >}}

Then we will receive the following error:

{{< highlight shell "linenos=table" >}}
{error: 'Bad Token'}
{{< / highlight >}}

And that’s it! You now have a pretty secure API with all the benefits of token-based authentication (don’t remember those benefits? Review them in [the last post](/2015/04/building-a-json-api-with-rails-part-3-authentication-strategies/ "Building a JSON API with Rails ? Part 3: Authentication Strategies")). For debugging purposes it’s often a pain to have to worry about authentication, and I kept that in mind as I was building this architecture. If you ever want to make a request to a resource without having to authenticate, then just comment out the **before\_filter** line:


{{< highlight ruby "linenos=table" >}}
# app/controllers/application_controller.rb

# before_filter :authenticate_user_from_token, except: [:token]
{{< / highlight >}}

And now all of your requests will go through without worrying about authentication. Just remember to turn it back on before you push anything to production!

Finale
------

You officially now have a thorough base API with a lot of the major concerns hammered out. This concludes the 3 major points that I wanted to discuss – scaffolding an API, serialization, and authentication. But, I still have a couple more parts I want to cover like **writing tests for an API** as well as a general overview of some other API topics such as **Rails vs Rails API file structure, nested vs. flat routes, CORS, and filtering resources based on query parameters** – so don’t think we’re quite done yet.

You can check out all those smaller concepts in the [next post in this series](/2015/12/building-a-json-api-with-rails-part-5-afterthoughts/) – Afterthoughts!

* * *

P.S. If you want to see an example JSON API built with Rails using everything that we’ve discussed so far, check out my [example API GitHub repo](https://github.com/alkrauss48/talks/tree/master/okcrb-api) based on a talk I gave at a local Ruby meetup.
