---
title: "Design Patterns: Dependency Injection"
date: "2017-03-30"
categories:
- Blog
tags:
- How Things Work
draft: "false"
---
If you’re a developer, you may have heard of the phrase [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) (DI) before as a possible design pattern you can use. It’s been around for a long time, and many popular frameworks such as [Angular.js](https://en.wikipedia.org/wiki/Dependency_injection#AngularJS_example) use it by default. In standard code, it’s common to declare a dependency in the same lexical scope where you actually plan use that dependency. Nothing sounds crazy about that, right? DI flips this on its head – and for good reason too. The core concept of DI is to [invert the control](https://en.wikipedia.org/wiki/Inversion_of_control) of managing dependencies so that instead of the **client** (i.e. the scope where the code actually exists) having to manage its own dependencies, you instead delegate this responsibility to the code which actually _calls_ your client, typically passing in dependencies as arguments to that client. This is where the name “dependency injection” comes from – you _inject_ the dependencies into your client code during the execution of that code.

If you’re familiar with DI – then you haven’t learned anything new yet, but if this is your first go at understanding this design pattern, then surely you have some red flags popping up right now. This just seems to convolute how I would write my code, why would I do this? What are the benefits of DI? Is it difficult to implement? We’ll get to all of this. Keep following along.

Benefits of DI
--------------

Applications built with DI boast a fair number of benefits – and while there’s more than this, here’s a list of some of my favorites:

**Loose coupling.**

With DI, your code is by default more loosely coupled which makes it easier to “plug-and-play” throughout your application; for example, you don’t have to worry about using a dependency that was potentially declared in an external scope compared to where you’re actually using it. All your code needs to worry about is what it actually does – and not about what exists around it.

Taking loose coupling even further, DI is very functional in nature too in the sense that it helps your functions maintain a [pure](https://en.wikipedia.org/wiki/Pure_function) state. Including dependencies from outside of the immediate scope means that the state of your client code could change at any given time – and while using DI doesn’t force you to necessarily write pure functions – it helps guide you on that path more so than other design patterns.

**Testing is very simple.**

Imagine you want to test a function which makes a request to a third-party JSON API, and you need certain data to return from that service in order for it to execute properly. This is very difficult to test because not only do external HTTP requests take a significant amount of time compared to the rest of your test’s execution – it’s most likely not feasible or reliable for you to be making HTTP requests during testing. What if the third-party service goes down? What if you have a request quota? What if the service takes a few seconds to respond? There’s a ton of reasons why this might be an issue.

With DI, you would pass in this particular request library as an argument to your client code – but since you’re passing it in from your test code, it’s very simple for you to build a mock of this request library that simulates real behavior; instead of making an HTTP request, it could just immediately respond with test data that you would expect to get back as a response, and then continue on executing the rest of your client code in your test.

Here’s an example of how this library might be used with DI (and Javascript’s new [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) keywords):

{{< highlight javascript "linenos=table" >}}
// logic.js

function foo(httpLib) {
  var data = await httpLib.get('http://api.com/users/1')
  return data.id
}
{{< / highlight >}}

And here’s a simple unit test we could write for this function:

{{< highlight javascript "linenos=table" >}}
// logic.test.js

function testFoo() {
  var httpMock = {
    get: async function getStub(){
      return { id: 1 };
    }
  };
 
  var response = foo(httpMock);
  expect(response).to.be(1) // true
}
{{< / highlight >}}

**Single source of declaration**.

You don’t need to require the same files multiple times in a project – with DI, you only have to do this once. Requiring a file multiple times could needlessly increase the total size of your application – but even though most programming languages handle this so that you still only pull in the same file once, it’s still cleaner and easier to debug when you code it in just one spot.

Implementing DI
---------------

You can implement DI in a number of different ways, but there are [3 simple patterns](https://en.wikipedia.org/wiki/Dependency_injection#Three_types_of_dependency_injection) of doing so if you’re using a class-based object-oriented language: the constructor, setter, and interface patterns. All of them revolve around the concept of setting each dependency as an instance variable on an object so that you can access them just about anywhere.

Here’s a simple example of code **without** DI:

{{< highlight java "linenos=table" >}}
// without-di.java

public SomeClass() {
  this.myObject = factory.getObject();
}
{{< / highlight >}}

Here, factory is a dependency defined in the external lexical scope of this file. This is nice and simple – but what if you want to build a unit test, and factory.getObject is a very hard function to handle during your test? This is where DI really shines, and here’s a simple way you can transform this example to use it:


{{< highlight java "linenos=table" >}}
// with-di.java

public SomeClass (Factory factory) {
  this.factory = factory;
 
  // Now we can call this.factory.getObject() anywhere in the class!
}
{{< / highlight >}}

Here, we pass in a dependency and set it equal to an instance variable – and now we can use this dependency anywhere we see fit with this property. We’ve transformed the SomeClass constructor into a pure function which solely depends on the arguments passed in when it’s called. That, my friend, is loose coupling.

### Using an IoC Container

DI is a wonderful concept and is rather easy to implement on a small scale, but it can quickly get messy if you start needing to inject dependencies all over the place in various files. This is where using an IoC (inversion of control) container – also known as a DI container – comes in to play. The purpose of an IoC container is to handle settting up all the necessary dependencies so that you don’t have to duplicate convoluted instantiation code across your project; the IoC container is the only place you would write that.

Imagine code that looks like this:

{{< highlight java "linenos=table" >}}
// without-ioc-container.java

FooService foo = new FooService(new BarService(), 
   new BazService(), new FooBarService(), 
   new BazBarService(new Config()), 
   new Logger(new FooLogger(new Config())));
{{< / highlight >}}

There’s nothing logically wrong here – we’re following proper DI principles – but it’s still very messy. The real danger here is that if we wanted to ever instantiate an object of class FooService again, then we would need to duplicate all of this code, and that seems like a code smell.

Now imagine we’re using an IoC container. Our code could potentially look like this:

{{< highlight java "linenos=table" >}}
// with-ioc-container.java

FooService foo = IoC.Resolve<IFooService>();
{{< / highlight >}}

Here, we haven’t lost any of our logic – we’ve just delegated the instantiation of a FooService object to our IoC container, which handles creating this object just like our code before did; our benefit now is just that if we need to duplicate this behavior across our project, we just delegate that responsibility to our IoC container instead of our client code. Our IoC container becomes the single source for handling all of our dependencies – and that’s pretty nice.

Detriments of DI
----------------

While we’ve shown the benefits so far, DI isn’t without its faults. Here’s a couple valid reasons that might make DI less appealing depending on your situation.

**More difficult to trace.**

When you’re debugging code that’s using DI, if the error stems from a dependency, then you may need to follow your stack trace a little bit further to see where the error actually occurs. Because dependencies no longer exist in the same file and/or class as where your logic is happening, you need to know exactly what called the code in question to understand where the problem may lie.

On top of this, learning these types of traversal concepts may be more difficult for developers who are just joining a project for the first time.

**More upfront development.**

In almost all cases, building a project with the DI pattern will take more upfront development time than a traditional project. Most of this has to do with understanding how your project’s architecture should work, what constitutes a dependency, and potentially building an IoC container.

In the long run, however, DI could save you a lot of development time and headaches as you begin to add on more components to your project and also need to test those components.

Final Thoughts
--------------

DI is a nice design pattern and it’s helped me tremendously in the applications where I’ve used it. For the most part, my favorite use case for DI is how simple it is to test every component of your project. If there’s a third-party dependency that makes it difficult to test the rest of my logic, then I can easily mock that dependency and stub out any functionality it has.

But – it’s more complex than non-DI code, and that may be a turn off for many developers out there. Whether you decide to implement DI into some of your projects is always your decision – but if you want my opinion, give it a shot sometime. If it works out – great, you’ve found a nice design pattern you can really start using; if not, then at least you still hopefully learned something in the process!
