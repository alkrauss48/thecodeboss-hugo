---
title: "Building a JSON API with Rails – Part 3: Authentication Strategies"
date: "2015-04-17"
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
*   Part 3 – Authentication Strategies
*   [Part 4 – Implementing Authentication](/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/)
*   [Part 5 – Afterthoughts](/2015/12/building-a-json-api-with-rails-part-5-afterthoughts/)
*   [Part 6 – The JSON API Spec, Pagination, and Versioning](/2017/02/building-a-json-api-with-rails-part-6-the-json-api-spec-pagination-and-versioning/)

* * *

We just wrapped up our discussion on serialization [in the last post](/2015/03/building-a-json-api-with-rails-part-2-serialization/), and technically at this point you have a fully functioning base API and don’t need to do any more work (if you’ve been following along in this series). However, there’s one caveat – we don’t have any security. So far anyone can request data from any endpoint without considering data that’s private to certain users or data that requires certain privileges to view. That may be okay if you’re building a completely public API where any user can make any type of request at any point in time, such as a public wiki, but chances are that you need to put at least a little bit of security in there.

And if you still aren’t biting, wouldn’t you like to at least know which user is actually making the requests, so that you can tailor some of the data you return to them? You can’t do that right now, but you’ll be able to by the end of this topic. Let’s begin.

Some Background
---------------

Before we get into adding code, we need to discuss how different authentication strategies work according to the HTTP spec and what options are available to us. You can always use a third-party authentication package like [OAuth](http://oauth.net/), which provides a very high-calibur authentication system that is completely free to use – but a lot of these systems are a tad bit complicated to implement. Should we be building a massive app, this may be something to look into, but since we’re building a small blog **AND** the main purpose here is to educate, we’re going to build our own simple yet very powerful authentication system.

We’re going to use two different authentication methodologies in this app: **Basic** authentication and **Token-Based** authentication. Why use two? Because we’re using them for different purposes. Check it out.

Basic Authentication
--------------------

Basic authentication is what we’re going to use to accept a **username** and **password** from the user in order to make the initial authentication request to our application. Whenever you log into any application that asks for a username and password, chances are that they’re using basic authentication when you make that initial login. Basic authentication is actually a part of the HTTP 1.1 spec under [rfc 2617](http://tools.ietf.org/html/rfc2617), and thus has a specified format that we can use. It looks like this:

{{< highlight bash "linenos=table" >}}
Authorization: Basic username:password
{{< / highlight >}}

We’re doing a few things here:

*   Setting an HTTP Header called **Authorization**
*   Submitting the value of that header to be “Basic username:password”

HTTP requests can have headers such as _Content-Type_, _Host_, _User-Agent_, _Cookie_, etc. and the one we use to authenticate is called _Authorization_. The first part of our header is the word **Basic**; this is how we state that we’re using _basic_ authentication instead of a different form of authentication. The second part of our header is the concatenation of our username and password, separated by a colon. But, I left out **one major part**: Our username and password chunk isn’t in plain text – it’s [Base64 encoded](http://en.wikipedia.org/wiki/Base64). What does that look like? Here’s an example with username foo and password barbaz:

{{< highlight bash "linenos=table" >}}
"foo:barbaz" => Base64 Encoded = "Zm9vOmJhcmJheg==\n"
{{< / highlight >}}

So after it’s all said and done, our full Authorization request header would look like this:

{{< highlight bash "linenos=table" >}}
Authorization = Basic Zm9vOmJhcmJheg==\n
{{< / highlight >}}

Now you might ask, why do we Base64 encode the username and password? Your immediate thought might be to add security so that our password isn’t in plain text, and while it sure looks that way, that’s not true. We eventually need to decode that username and password block on the server, and there’s no secret on how to do that – so if anyone gets a hold of that Base64 encoded block while the request is being made, they can decode it in a heartbeat. The real reason Base64 encoding is employed is to make the request header fully URL safe. There are a lot of characters that aren’t URL safe that we use in our passwords and perhaps even in our usernames, and Base64 encoding ensures that all of that gets encoded into a string that is fully HTTP transferable.

Back to our app. As I mentioned earlier, we’re going to use basic authentication to submit our **username**  and **password** to our API, and it will return a **token** to us – a token being just a random hash of letters and/or numbers. So what good does that do us? It does us a lot of good because now we can use token-based authentication.

Token-Based Authentication
--------------------------

We received a token back from our initial request using basic authentication, and now we’re going to use that token on **every subsequent request** that we make to our API to authenticate ourselves. We do this because it’s actually a core principle of Representational State Transfer (REST) for the server to not maintain any concept of state, so therefore each unique request is responsible for providing all of the necessary authentication data every single time. Will this be ridiculous to implement? No, it won’t be bad at all – it just means that we’re going to set another header on every normal request we make to our API. Although token-based authentication isn’t specified in the HTTP spec like basic authentication, there is a very agreed upon format to structure your token-based Authorization header that looks very similar to basic authentication:

{{< highlight bash "linenos=table" >}}
Authorization = Token token=your_token
{{< / highlight >}}

See? Very similar structure, and this one’s even a little simpler because instead of providing two values, we only have to supply one: our token. Now remember, our token is just a random hash of letters and numbers that don’t mean anything – so why do we use it? The idea behind passing a token around on every request is that it is a way to represent the user making the request without having to pass around any important data. On our server, we would associate a user with a certain token (if you remember back in [part 1](/2015/02/building-a-json-api-with-rails-part-1-getting-started/ "Building a JSON API with Rails ? Part 1: Getting Started"), this is when we’ll actually use the **auth\_token** attribute we created on our User table); because our server is aware of this association, we can authenticate that user solely based on his/her token. That’s using just one value to authenticate, instead of having to pass around a username and password on every request.

Let’s say that we submit our username and password using basic authentication, and our server responds with a 200 (i.e. successful) status code and the following JSON:

{{< highlight bash "linenos=table" >}}
{ token: "a2b38czzzelli888afvx" }
{{< / highlight >}}

That means we got our token! We can now change our Authorization header to use that token for every normal request we make to our API:

{{< highlight bash "linenos=table" >}}
Authorization = Token token=a2b38czzzelli888afvx
{{< / highlight >}}

And this will handle both authorizing us as a valid user and it will let the server know who the requesting user is so that we don’t have to worry about explicitly telling the server through query parameters or other headers.

#### Worst Case Scenario

What happens if that token is compromised? Well the only way that could really happen is if someone is listening to the requests you make via some shared connection like public wifi. If a black-hat hacker does get a hold of your token, then they can make a few requests – but as soon as it’s discovered that you’ve been hacked, then we just reset your token. That would require you, the rightful user, to have to log in again, but that’s all you have to do – the server handles issuing you a new token and authenticating with that one. The hacker that has your old token, he can’t do anything with it now. That’s much nicer than having a hacker compromise your actual username and/or password, because:

*   You may use that username and/or password on multiple sites
*   You would need to manually change your password if the hacker compromised it

Sounds like a pain. This is why token-based authentication has really gained traction over the past several years.

* * *

No Code?
--------

We didn’t touch on any code here, and I apologize for that. But I needed to make sure we covered these authentication strategies before we actually start implementing them so that you know why and how we’re going to use them. As I mentioned earlier, [OAuth](http://oauth.net/) is an example of a great third-party authentication package that takes token-based authentication to the max – but for the sake of simplicity and education, we’re going to build our own strong auth into our API.

So get ready for [the next post](/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/) where we’ll be doing nothing but code. We got through the learning part here, now we can move to the fun stuff. Rails provides some seriously awesome support for these authentication strategies, and now that we know how they work, we can push the power of Rails as an API to the absolute max.

[Part 4: Implementing Authenticatation](/2015/04/building-a-json-api-with-rails-part-4-implementing-authentication/)
