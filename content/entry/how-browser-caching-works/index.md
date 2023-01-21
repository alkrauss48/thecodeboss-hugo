---
title: How Browser Caching Works
date: "2016-05-27"
categories:
- Blog
tags:
- How Things Work
draft: "false"
---
Have you ever noticed that when you load a web page for the very first time, it takes a little bit longer than the second, third, etc. times that you visit that page? That’s not just coincidence my friend, that’s browser caching, and today we’re gonna explore everything about how it all works. Before we move to how caching works in the web though, we need to go over how caching in general works.

What is Caching?
----------------

[Caching](https://en.wikipedia.org/wiki/Cache_(computing)) is the concept of intelligently storing commonly-used data in quick-to-access locations so that requesting that data will happen as fast as possible. There are multiple types of caches out there such as CPU cache, GPU cache, disc cache, etc. Each cache system can be structured uniquely – for example, a CPU cache often has multiple layers of caches that are quicker to access than others, with the quickest-returning caches usually being smaller in size; usually these are named L1 (quickest) all the way to L2 or L3, before RAM is accessed. The [cache algorithms](https://en.wikipedia.org/wiki/Cache_algorithms) behind storing and retrieving cached data is a pretty big area of discussion among computational theorists.

When a requested resource is found in cache, it’s called a _cache hit_. Similarly, if a resource is not found in cache and had to be fully requested from its normal location, it’s called a _cache miss_. While a cache miss does take slightly longer than it would to normally request the data without a cache system in place, the boost in speed provided by frequent cache hits greatly offsets this loss.

For the purposes of browser caching, each browser has its own **web cache**, which is where resources like images and other web page assets are stored for quick access later on. The goal of browser caching is to save you **time** when requesting the same resource multiple times, and to save **bandwidth** by reducing the amount of data you request over a network. For the rest of this article when you read the term “caching,” we’ll be referring to web cache.

How Does the Browser Know What to Cache?
----------------------------------------

Good question. As defined in the HTTP spec, each request and response can have headers associated with it, and it’s through these headers that the server can tell the client what to cache and for how long. There are two modern HTTP response headers that define how a resource should be cached: **Cache-Control** and **ETag**.

### Cache-Control

[Cache-Control](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control) defines how, and for how long the individual response can be cached by the browser and other intermediate caches. When your browser requests resources from a server the first time, it stores the returning resources in its cache according to this header. These resources can be of any file type, but are usually HTML, stylesheets, scripts, or images. Then, when your browser needs to request that resource again, it will check its cache to see if the resource is there and that it still fits the Cache-Control specs; if it does, then your browser will just load that resource from cache and completely avoid having to make a request to the server. Ultimately, this ends up saving you many requests that would likely have been made to servers halfway around the world.

A response from the server with a valid Cache-Control header may look like this:

![cache-example](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/how-browser-caching-works/cache-example.png)

The Cache-Control header has a couple different parameters that can be set from the server:

**“no-cache”** or **“no-store”**:

*   **no-cache** means that regardless of the Cache-Control header, this resource should always be requested from the server instead of automatically loaded from cache. However, the protocol about ETags still applies (more on that below), and if the ETags for the client version and the server version match up (thus indicating no change), then the server will instruct the client to use its cached version. Often times you use this setting for HTML files, since you always want these to be up-to-date because they link to other resources. **no-store** is simpler in that it tells the browser to always request the resource from the server without checking ETags, thus always forcing a full-length download from the server.

**“public”** or **“private”**:

*   **public** means that a resource can be cached by anyone – but this usually isn’t necessary as by default, defining the max-age part of the header will also set it as public (unless private is explicitly stated). **private** means that only the user’s browser can cache the resource, and not any intermediaries such as a CDN. This is especially important when dealing with resources with personal information, such as when you log into your bank’s website.

**“max-age”**:

*   Finally, **max-age** determines the length of time in seconds that this resource should be cached. max-age=120 means that this resource can be cached and reused for 2 minutes.

Now that we have the knowledge to analyze the Cache-Control header above, we can see that this stylesheet can be cached by anyone for 10 years. Hopefully you’ll set your cache specs to be a little bit shorter than this one! Now the Cache-Control header does a lot for us – but what happens when the max-age runs out? We don’t necessarily know if the resource has been changed on the server, and we’d hate to make another full request and download it again if our cached version is still the most recent. That’s where ETags come in.

### ETag

The [ETag](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#validating-cached-responses-with-etags) header (short for _entity-tag_) provides a revalidation token that is automatically sent by the browser to check if the resource has changed since the last time it was requested. Your browser completely ignores the ETag header until it needs to access a resource that falls outside the cache bounds set in the Cache-Control header. Normally, if we fall inside the Cache-Control bounds, then the server is never requested for this resource – it’s all loaded from cache internally in the browser. With ETags, we do have to make a request to the server, but instead of re-downloading the entire resource, our goal is to check with the server to see if there’s been any modifications to it. If there haven’t been, then the server responds back with a **304** response code – meaning “Not-Modified” – and then the browser loads the file from its own cache instead. While using ETags does involve a request to the server, if it works as intended, then we don’t have to needlessly download the same resource again, and the response is handled much quicker.

An ETag is basically a random string that a server assigns to a resource, and reassigns it whenever that resource changes. When a request to the server comes in, the server checks the ETag of the request with the ETag that the server has for that resource. Here’s an example flow of a successful ETag match:

![etag-example](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/how-browser-caching-works/etag-example.png)

Image Source: [BetterExplained.com](http://betterexplained.com/articles/how-to-optimize-your-site-with-http-caching/)

This ends up being much quicker than if the server had to resend the whole resource again. Now, because we’re making a request to the server, in the event that the ETags _don’t match up_ then the server can go ahead and fully resend the resource we’re asking for – which is exactly what we would want. It seems like we’ve got this whole “caching” thing down to a good point – except for one caveat. What happens if the resource does change – but we’re still within the max-age of our local cached resource, and thus we’re never making a request to our server. How do we get the updated version? I’ll tell you how: we have to forcibly invalidate our cache response.

Invalidating an HTTP Cache Response Before Expiration
-----------------------------------------------------

This happens more often than you might think. Let’s say that you update a site’s stylesheet, go to lunch, come back, and realize that background color was supposed to be turquoise instead of sea foam green! You need to change it quickly, but you know you set a max-age of one day on that file, and you’re sure people have visited your site and cached that resource while you were at lunch. What can you do to make sure everyone has the most recent stylesheet? Simple my friend. You need to change the request URL for your resource in your actual HTML. By doing this, your browser will treat it as a completely new resource with no cache settings and will therefore complete a full request and response cycle for that resource. Let’s say that you’re updating a file called theme.css. You could change the link tag from this:

{{< highlight html "linenos=table" >}}
<link rel="stylesheet" type="text/css" href="theme.css" />
{{< / highlight >}}

to something like this:

{{< highlight html "linenos=table" >}}
<link rel="stylesheet" type="text/css" href="theme.123.css" />
{{< / highlight >}}

And that’ll do the trick. This method requires you to rename your file each time you want to invalidate a cached response – but what if you don’t like renaming your files every time you change them? For starters, there are several build automation tools to help with this, such as [usemin](https://github.com/yeoman/grunt-usemin) with Grunt or Gulp. Additionally, you don’t even have to change the actual _name_ of the file. You can just append a query string to the end of your URL instead, and change it whenever you update the file:

{{< highlight html "linenos=table" >}}
<link rel="stylesheet" type="text/css" href="theme.css?123" />
{{< / highlight >}}

That gets the job done just as well – no file-renaming necessary. Just change the query string whenever you want to force the user to grab the updated resource.

Building a Proper Cache Policy
------------------------------

With all this hubbub about caching, you might be asking yourself, “How am I supposed to know what to cache, and for how long?” Well, there’s no easy answer to this since it all pertains to your site in particular, but Google came up with a nice decision tree to help you figure it all out:

![cache-tree](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/how-browser-caching-works/cache-tree.png)

Image Source: [Google](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)

Things We Didn’t Cover
----------------------

There are two HTTP headers that are also related to browser caching that we didn’t cover simply because they’re older and are on their way towards becoming deprecated.

*   the **Expires** header – a pre-HTTP 1.1 header – is a header which prevents the client from requesting the resource again from the server until it “expires” in freshness; it has been replaced by Cache-Control. The Expires header contains an HTTP date, and after that date passes then the resource must be revalidated from the server. Though simple, there are problems with this header in that it’s easy to get time zones mixed up between the server and the client, and if you don’t manually update the Expires header often on the server, then it doesn’t work – because you may be expiring the resource at a time in the past. If you have both a Cache-Control and an Expires header, then the Cache-Control header will take precedence and the Expires header will be ignored.
*   the **Last-Modified** header – also a pre-HTTP 1.1 header – is a header which also contains an HTTP date stating when the resource was last modified; it has been replaced by ETag. The Last-Modified header serves the purpose of re-validating the resource with the server (just like ETag), but – even though it’s still largely in use today – it runs into the same time zone issue that the Expires header does since they both use HTTP dates.

The moral of the story is that anything involving dates is more difficult to manage, so modern caching techniques tend to avoid them. We also didn’t cover **server-side caching**, which is caching that exists solely on the server and revolves around caching database queries or dynamic fragments of a page that don’t need to be generated for every visitor. I plan to do a separate blog post about this topic in the future.

Conclusion
----------

And there you have it – the ins and outs of how caching works in the browser! You now have the power to enhance the load speed of your web pages tenfold, and you can go impress all of your non-developer friends at a cocktail party.
