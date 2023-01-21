---
title: Debugging a Simple Web Server
date: "2015-06-12"
categories:
- Blog
tags:
- Ruby
draft: "false"
---
This is the second part of a short series on how to build a web server using Sinatra. [In the previous post](/2015/05/building-a-simple-web-server-with-sinatra) we discussed the initial buildout of a simple [Sinatra](http://www.sinatrarb.com/) web server, so to make sure we’re all on the same page, you may want to start there if you haven’t read it already. In this post we’ll be reviewing how you can easily debug that web server.

Debugging Tools
---------------

We’re going to talk about 3 debugging tools you can use in order to fully test your web server:

*   [cURL](http://curl.haxx.se/)
*   [pry](https://github.com/pry/pry)
*   [Ngrok](https://ngrok.com/)

What we won’t be covering however are conventional ruby testing libraries such as TestUnit, RSpec, Cucumber, etc. There are a lot of other posts about how to use those tools, and we’re going to focus specifically on manual testing.

For starters, you can test your web server just by spinning it up (assuming your app is set up like [the previous post](/2015/05/building-a-simple-web-server-with-sinatra)):

{{< highlight shell "linenos=table" >}}
ruby app.rb
{{< / highlight >}}

You can now open up your browser and navigate to **http://localhost:4567** to see your web server. But that will only get you so far since you can really only issue GET requests that way – plus it’s slow and tedious. We can do a lot better.

* * *

Issuing Requests with cURL
--------------------------

Chances are that you’ve heard of [cURL](http://curl.haxx.se/) and may use it regularly, but if you haven’t, it’s a super neat tool that allows you to issue HTTP requests from the command line. While browsers do have the capability to issue any type of HTTP request, as a user you’re mostly limited to just GET requests. CURL can help with that. To issue a GET request using cURL, run:

{{< highlight shell "linenos=table" >}}
curl http://127.0.0.1:4567
{{< / highlight >}}

And you’ll get back an HTML response saying that Sinatra doesn’t know how to handle that route. You’ll also see in your server logs that a GET request was made:

{{< highlight shell "linenos=table" >}}
127.0.0.1 - - [09/Apr/2015 17:38:43] "GET / HTTP/1.1" 404 437 0.0006
{{< / highlight >}}

Let’s check out some other request types:

{{< highlight shell "linenos=table" >}}
# POST request
curl -X POST http://127.0.0.1:4567/posts --data "param1=value1&param2=value2"
 
# PUT request
curl -X PUT http://127.0.0.1:4567/posts/1 --data "param1=value1&param2=value2"
 
# DELETE request
curl -X DELETE http://127.0.0.1:4567/posts/1
{{< / highlight >}}

Now you have the full capabilities to issue any request you want to your web server without ever leaving your command line – assuming you like the command line. This ends up being much faster than manual requests through your browser.

* * *

Breakpoints with Pry
--------------------

This next debugging tool isn’t specific to Sinatra – you can apply it to any ruby development you do. There’s a good chance you’ve heard about it too, and perhaps even use it. I’m talking about the gem called [pry](https://github.com/pry/pry).

Pry is an immensely handy tool that any ruby developer should have in his/her arsenal. It allows you to halt the runtime of any script and expose the scope of the currently executing line in an interactive [REPL](http://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) (Read-Eval-Print-Loop) shell that allows you to debug any issues you have. This is very similar to how a lot of IDE’s work (and even Chrome Dev Tools when debugging javascript) in that you set your **breakpoints** at a certain line and your code stops executing there to allow you to debug the current state of your program. I like pry because regardless of what tools you use to execute your script (IDE, command line, etc.), pry still works the exact same way – it halts your script and allows you to get deep in debugging. It’s environment agnostic!

To install pry, add the gem to your Gemfile:

{{< highlight ruby "linenos=table" >}}
# Gemfile

gem 'pry'
{{< / highlight >}}

You can wrap it up in a _group: :development_ block if you’d like too, since you’ll never use pry in production. Now install it:

{{< highlight shell "linenos=table" >}}
bundle install
{{< / highlight >}}

Include it in your main script and give it a whirl.

{{< highlight ruby "linenos=table" >}}
# app.py

require 'pry'
 
get '/' do
  binding.pry # Execution stops here!
end
{{< / highlight >}}

Now restart your Sinatra server and let’s check out pry in action. If you make a GET request to your root endpoint, your request will look like it hangs forever, but really your program is just waiting on you to finish debugging! Let’s go ahead and make that GET request to our root endpoint via curl:

{{< highlight shell "linenos=table" >}}
curl http://127.0.0.1:4567
{{< / highlight >}}

And then if you look at your server logs, you’ll notice it has turned into a REPL you can play with!

{{< highlight ruby "linenos=table" >}}
    13:
    14: get '/' do
 => 15:   binding.pry
    16: end
    17:
    18: post '/posts' do
    19:   # POST stuff ...
    20:
 
[1] pry(#<Sinatra::Application>)>
{{< / highlight >}}

This is an interactive shell just like IRB and works the exact same way, except that you’re now in the scope in which your program stopped, so you have access to all the variables, objects, classes, methods, etc. that you normally would at that point in runtime.

Whenever you’re done, just type **exit** to resume normal runtime. There’s a ton more you can do with pry, but I’ll let you [explore the docs](https://github.com/pry/pry) to see what all it has to offer.

* * *

Expose Your Web Server with Ngrok
---------------------------------

Lastly, I want to talk about ngrok. [Ngrok](https://ngrok.com/) is a wonderful dev tool that allows you to securely expose any of your localhost ports to a publicly accessible URL. What that means is that you can use ngrok to create a public URL that maps to your server on localhost:4567, and now anyone can have access to it!

Before we get into ngrok too much, let me explain why this is so nice. Because the purpose of this web server is to handle remotely small tasks, there’s a good chance that you don’t want to put a ton of time into building testing frameworks or scaffolding out a needless client-side app to talk to your web server. There’s also a good chance that you’re integrating this web server with something that already exists, such as a third-party API or external database – and those services can’t see your localhost. But they can sure see a public URL, which is what ngrok gives you.

Ngrok is available for download as a binary file at [the main site](https://ngrok.com/), but it’s also installable as a global npm module, so we’ll install it that way:

{{< highlight shell "linenos=table" >}}
npm install ngrok -g
{{< / highlight >}}

To expose the port that our web server is running on, we just run:

{{< highlight shell "linenos=table" >}}
ngrok http 4567
{{< / highlight >}}

Ngrok will then take over our terminal pane and show us the public URLs it created:

![ngrok](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/debugging-a-simple-web-server/ngrok.png)

We can now access the url **http://58a4d66f.ngrok.com** in the exact same way as localhost:4567 – and all external services can see that URL. You could even navigate to another website and use chrome dev tools to issue an HTTP request via AJAX to our web server, and it will all work. As you can see in the picture above, ngrok also creates a URL that uses HTTP over SSL, so you can even integrate it with fully secure sites too. Just like normal server logs, ngrok tracks and displays which requests were made to which resources:

![ngrok logs](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/debugging-a-simple-web-server/ngrok.png)

Pretty neat, huh? You may not always need ngrok for your web server, but it’s a great tool to have in your dev toolbox for any project. Exposing your localhost to a public URL for testing purposes is a game changer when you just quickly want to see how things might work in production.

The last neat thing about ngrok is that it still allows you to use your other debug tools too, like pry. Earlier we placed a breakpoint in our GET handler for our root endpoint using pry, which allowed us to stop the runtime of our program to debug it. Because ngrok merely maps our localhost ports to public URLs, all the code is exactly the same and updates in real-time (no need to restart ngrok, ever), so if you make a GET request to the root endpoint of our ngrok URL, the interactive REPL through pry will still get triggered in our normal Sinatra server logs, just as if we made a request to localhost!

* * *

Overview
--------

Though there’s many more ways you can test your web server, these are some of my favorite tools that I’ve used lately. Sinatra is a really powerful mini web framework if you’re familiar with ruby, and if you don’t know much about it then feel free to check out my first post on [how to build a web server](/2015/05/building-a-simple-web-server-with-sinatra) using Sinatra.

Today we went over:

*   using **cURL** to issue requests quickly
*   using **pry** to debug our ruby scripts through breakpoints and REPLs
*   using **ngrok** to expose our localhost ports to a public URL

None of these tools are specific to Sinatra or even mini web-servers in general, and you can therefore use them in a lot of different situations – which I recommend you do. Regardless of which tools you do use to test your web servers, I hope I provided you with at least a couple more ideas on how to manually debug your web projects.

Happy building!
