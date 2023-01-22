---
title: "How WebSockets Work – With Socket.io Demo"
date: "2016-04-29"
categories:
- Blog
tags:
- Javascript
- How Things Work
draft: "false"
---
As a developer you may have heard the term [WebSockets](https://en.wikipedia.org/wiki/WebSocket) thrown around in the past few years, without fully understanding what they are. At least I was in that boat for a long time before I started using them. WebSockets really aren’t too difficult to understand and implement, and they can lead to some really cool functionality in your app. Whether you agree or disagree that WebSockets have enhanced the current state of web development, it’s at least a good idea to understand how they actually work. Before I get into the nitty-gritty about how WebSockets function, I want to provide some real-life examples of how they could be used to make sure we all know what they are.

Imagine you’re using a browser-based instant messaging application and you’re chatting with a friend – how do those messages automatically appear in your browser without you having to refresh? While the app doesn’t necessarily _have_ to be using WebSockets – there’s a good chance that it is. Same thing if you’re on a company’s homepage and you see a stock ticker changing regularly, or if you’re on a sports site keeping track of a game score that’s updating on its own. These are all examples of how WebSockets can be used in the wild. WebSockets create links, or “sockets,” between two parties and allow for two-way communication. Back to the instant message example, whenever you send a new instant message in a chatroom, your client would alert the server of the new message, then the server would immediately broadcast that message to all of the other clients, and finally those clients would immediately receive and render the message.

Traditional Web Sites
---------------------

The way you traditionally interact with a web site is by issuing an HTTP request from your client (i.e. your browser) to the server and receiving all the necessary data to load the webpage as a response from the server. This can be HTML, CSS, Javascript, images, and more. You can even make asynchronous requests to load additional data (often in the form of JSON or XML) while you’re interacting with the web page, which is how single-page apps work. What you _can’t_ do however is rely on the server to automatically send the client information on its own. Traditionally, there’s always a request from the client involved, and we can’t change how HTTP works to account for this (nor would we want to). We can build a semi-workaround for this by implementing [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)) – meaning we just issue asynchronous requests to the server every second or so to see if data has changed, in which case we would want to render it onto the screen (such as a new instant message) – but that means we’re issuing several needless requests over and over again. That impacts both the client and the server, and that’s not good.

It seems like it would be really helpful if we could establish an open connection between the server and the client so that they can communicate bi-directionally, but how would we do this? Enter WebSockets.

What are WebSockets
-------------------

WebSockets represent a standard for bi-directional communication between a client and a server which involves creating a TCP connection that links them together. The TCP connection sits outside of HTTP, and thus runs a separate server to manage this communication. To initialize this connection, a _handshake_ is performed between the client and the server; here’s the general process:

1) The client makes an HTTP request to the server with an **upgrade** header, indicating that the client wishes to establish a WebSocket connection. Notice the **ws** URI scheme (short for WebSocket). **wss** is also available for secure WebSocket communication.

{{< highlight html "linenos=table" >}}
GET ws://websocket.example.com/ HTTP/1.1
Origin: http://example.com
Connection: Upgrade
Host: websocket.example.com
Upgrade: websocket
{{< / highlight >}}

2) If the server supports the WebSocket protocol, then it will agree to the upgrade and send a response back.

{{< highlight html "linenos=table" >}}
HTTP/1.1 101 WebSocket Protocol Handshake
Date: Wed, 16 Jan 2016 10:07:34 GMT
Connection: Upgrade
Upgrade: WebSocket
{{< / highlight >}}

3) The handshake is complete, and all further communication will follow the WebSocket protocol and will use the same underlying TCP port. The returning status code is 101, which stands for **Switching Protocols**.

Demo with Socket.io
-------------------

All this talk about WebSockets is great, but why don’t we build a small demo to really show off how they work? [Socket.io](http://socket.io/) is perhaps the most popular WebSocket library out there right now, and it’s built to work with node.js. We’re going to create a drop-dead simple instant messaging application that uses WebSockets. This app will allow clients to submit text through a form, which will in turn display that text in realtime on _every_ client’s DOM. For starters, let’s start a new node project and install socket.io:

{{< highlight shell "linenos=table" >}}
npm init # Answer the questions
npm install --save-dev socket.io express
{{< / highlight >}}

We also installed [express](http://expressjs.com/) in order to add some basic routing features later on. Now let’s add our first file called index.js, where we’ll write our server-side code. Starting off simple, it takes only three lines to build a working WebSocket server.

{{< highlight javascript "linenos=table" >}}
// index.js

var io = require('socket.io')();
io.on('connection', function(socket){});
io.listen(3000);
{{< / highlight >}}

To run this server, we just execute the following command:

{{< highlight shell "linenos=table" >}}
node index
{{< / highlight >}}

Using WebSockets can’t get any easier than this – we’re literally just opening a TCP connection and listening. Once you run this, you’ll see your terminal hang, showing that the server is working – but if you navigate to http://localhost:3000 in your browser, you won’t actually see any UI. That’s because we don’t have an HTTP server running to return anything to our browser – it’s strictly WebSockets for now. Let’s change that by rebuilding our code to instead **attach** our WebSocket server to an HTTP server, which will allow us to run both on the same port. For now, let’s just build a simple HTTP server, leaving out WebSockets. Baby steps.

{{< highlight javascript "linenos=table" >}}
// index.js

var express = require('express');
var app = express();
var server = require('http').createServer(app);
 
// Routing
app.use(express.static(__dirname + '/public'));
 
server.listen(3000);
{{< / highlight >}}

As you can see on line 7, we’re routing our pages to the **/public** directory. That means before we run this server, we need to create and add an index HTML template in that directory with some basic structure. Something like this will do nicely:

{{< highlight html "linenos=table" >}}
# public/index.html

<html>
<head>
  <meta charset="utf-8">
 
  <title>WebSockets Demo</title>
 
</head>
<body>
  <h1>WebSocket Demo</h1>
  <div class="messages">
 
  </div>
  <form class="submit-message" method="post">
    <input type="text" name="" id="my-message" value="" />
    <input type="submit" name="" id="" value="Submit" />
  </form>
 
  <script src="https://code.jquery.com/jquery-1.12.0.min.js" type="text/javascript" charset="utf-8"></script>
</body>
</html>
{{< / highlight >}}

Nothing too crazy here – just a header, an empty div, a simple form with an input and submit button, and a script call to grab jQuery from a CDN. Now run this server and visit http://localhost:3000, and you should see something that looks like this.

![websocket-screenshot-1](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/how-websockets-work-with-socket-io-demo/websocket-screenshot.jpeg)

Now the plan here is to allow the user to enter text and submit the form, and that text will automatically display beneath the **WebSocket** **Demo** heading on _every_ client that’s currently viewing the page, without them having to do anything. It’ll be like magic.

In order to do that, we need to add back in and update the WebSocket portion of our server Javascript file; whenever a client _emits_ a message to the WebSocket server, we want the server to _broadcast_ that message to all the client browsers so they can update their own display in realtime.

{{< highlight javascript "linenos=table" >}}
// index.js

var express = require('express');
var app = express();
var server = require('http').createServer(app);
 
// Routing
app.use(express.static(__dirname + '/public'));
 
var io = require('socket.io')(server);
io.on('connection', function(socket){
 
  socket.on('message', function (data) {
    console.log(data);
 
    // we tell the client to execute 'message'
    socket.broadcast.emit('message', {
      message: data
    });
  });
});
 
server.listen(3000);
{{< / highlight >}}

Here’s our updated file, and this will actually be the last edit we have to make here. After making these changes, be sure to restart your server. The rest of the logic will be some simple client-side Javascript.

Let’s jump back to our HTML template and add in a link to another Javascript file (**main.js**) that we’ll build ourselves to handle the client-side WebSocket logic. Additionally, now that we have WebSockets working on the server, we need to link to the client-side socket.io library.

{{< highlight html "linenos=table" >}}
# public/index.html

  .
  .
  <script src="/socket.io/socket.io.js" type="text/javascript" charset="utf-8"></script>  
  <script src="main.js" type="text/javascript" charset="utf-8"></script>
</body>
</html>
{{< / highlight >}}

If you look at the socket.io.js file path, you might be thinking that we never put that file in our project – and you’d be correct. When we attach our WebSocket connection to our HTTP connection, that file is served automatically by our server. Now let’s create main.js in **/public** and start building our logic handlers. We’ll start off by wrapping all of our code in an [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) and using jQuery to help build the callback for when the user submits the form. Then, we’ll render the message in our own browser and clear the input after it’s been submitted.

{{< highlight javascript "linenos=table" >}}
// public/main.js

(function(){
  $('.submit-message').submit(function(event){
    event.preventDefault();
    $('.messages').append('<p>' + $('#my-message').val() + '</p>');
 
    $('#my-message').val('');
  });
})();
{{< / highlight >}}

If you submit this form now, you should see your message appear beneath the **WebSocket Demo** header, and then your input will be cleared. Now let’s take this a step further; inside this callback, we can grab the submission data and use the socket.io library to emit a message to our WebSocket server (which is attached to our HTTP server). To do that, we just have to add in two lines:

{{< highlight javascript "linenos=table" >}}
// public/main.js

(function(){
  var socket = io();
 
  $('.submit-message').submit(function(event){
    event.preventDefault();
    $('.messages').append('<p>' + $('#my-message').val() + '</p>');
 
    socket.emit('message', $('#my-message').val());
    $('#my-message').val('');
  });
})();
{{< / highlight >}}

Now reload the page and submit the form with “**foobar**” entered into the text input; you should see this output from your server:

{{< highlight shell "linenos=table" >}}
> node index
foobar
{{< / highlight >}}

This means you’ve been successful in sending a message via WebSockets to your server! Now if you were to open up your browser development tools and watch as you make this submission, you won’t see any sort of logging for the message. That’s because it’s not following the HTTP protocol – it’s following the WebSockets protocol. I want to make absolutely certain we’re all on the same page here. This isn’t a form of AJAX going on behind the scenes, it’s full on WebSockets. HTTP isn’t involved in the least bit after the initial handshake.

So our server is receiving our message, which is cool, but that’s not where we want it to end. We want the server to now broadcast that message to all of the clients so that they can render the message to the screen. Our server is already good to go, so all that’s left is to build the handlers on the client-side to receive the messages and render them to the screen.

At the bottom of /public/main.js, we’ll add a few lines of code to take care of this.

{{< highlight javascript "linenos=table" >}}
// public/main.js

(function(){
  var socket = io();
 
  $('.submit-message').submit(function(event){
    event.preventDefault();
 
    $('.messages').append('<p>' + $('#my-message').val() + '</p>');
    socket.emit('message', $('#my-message').val());
    $('#my-message').val('');
  });
 
  socket.on('message', function (data) {
    $('.messages').append('<p>' + data.message + '</p>');
  });
})();
{{< / highlight >}}

Boom – we’re done! This is our last bit of code to add; all it does is wait to receive a message from the server, and when it does, it will append the message to the DOM just like it would for the user who submits the form. One word of note here is that the client who sends the initial message will **not** receive any messages back from the server for that particular message. This is good, because the original client already knows when the action takes place without needing WebSockets.

To test everything out, open up multiple browser windows and navigate to http://localhost:3000. Now you’ll notice that when you submit the form from one client, the message will appear in all clients automatically! The power of WebSockets!

If you don’t want to build all of this out, feel free to check out the [live demo](https://websockets.thecodeboss.dev) instead; the code’s all on on [GitHub](https://github.com/alkrauss48/labs/tree/master/socketio) too.

Concerns
--------

In addition to being one of those cool new-ish technologies, WebSockets are nice because they make more efficient use of server and client resources and because data transmitted is truly realtime – but they’re not without their downfalls.

**Browser support**. WebSockets aren’t completely supported, especially in older browsers. Firefox 6, Safari 5, Chrome 14, IE 10, and Opera 12.10 all support WebSockets, but older versions of these browsers don’t – at least not fully. Most modern mobile browsers do support WebSockets, but not opera mini, which has a sizable market share of mobile browsing – especially in non-industrialized nations.

**Potential for an extra server running**. To use WebSockets, you have to open up a TCP connection which means maintaining another service for your application to fully function. Like we did in this demo, you can establish this connection on the same port as HTTP, but if you choose not to do this, then that’s another service to manage.

**More complexity**. Not only could you have another service running, but WebSockets almost always result in more code written (though often times it’s cleaner code). You’re at least usually depending on another library of code to help manage the connection, like socket.io.

You definitely need to weigh the pros and cons to see if WebSockets are right for you – but for me, the pros vastly outweigh cons. WebSockets open up the doors for countless possibilities in the realm of today’s web development.

Final Thoughts
--------------

There you have it – how WebSockets work and with a demo to show it all off. I personally think they’re really cool, and jump at the opportunity to implement them if they apply to a specific use case – but [not everyone’s a fan](https://samsaffron.com/archive/2015/12/29/websockets-caution-required). Depending on your app’s requirements, it may even be wiser to instead implement long polling or [server-sent events](https://en.wikipedia.org/wiki/Server-sent_events). Whether you choose to use them regularly in your projects is up to you, but I do highly recommend using them at least one time to help you get a deeper understanding about how they really work. Even if they become obsolete within the next decade (which I strongly doubt will happen), they represent a fundamental type of communication which HTTP just can’t compete with – because it wasn’t designed to.

Now go forth and build!
