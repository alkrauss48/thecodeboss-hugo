---
title: Core Functional Programming Concepts
date: "2016-12-01"
categories:
- blog
tags:
- Programming Concepts
draft: "false"
description: In this Programming Concepts series, we'll be learning about some of the core concepts that make up functional programming.
---
**Programming Concepts Series:**

*   [The Stack and the Heap](/2014/10/programming-concepts-the-stack-and-the-heap/)
*   [Compiled and Interpreted Languages](/2015/07/programming-concepts-compiled-and-interpreted-languages/)
*   [Concurrency](/2015/10/programming-concepts-concurrency/)
*   [Static vs. Dynamic Type Checking](/2015/11/programming-concepts-static-vs-dynamic-type-checking/)
*   [Type Introspection and Reflection](/2016/02/programming-concepts-type-introspection-and-reflection/)
*   Core Functional Programming Concepts
*   [Garbage Collection](/2017/01/programming-concepts-garbage-collection/)

* * *

If you’re a developer like me, then you probably grew up learning about Object-Oriented Programming and how that whole paradigm works. You may have messed with Java or C++ – or been lucky enough to use neat languages like Ruby, Python, or C# as your first true language – so chances are that you’re at least mildly comfortable with terms such as _classes_, _objects_, _instance variables_, _static methods_, etc. What you’re probably not as comfortable with are the core concepts behind this weird paradigm called functional programming – which is pretty drastically different from not only just object-oriented programming, but also procedural, prototypal, and a slough of other common paradigms out there.

Functional programming is becoming a pretty hot topic – and for very good reason. This paradigm is hardly new too; [Haskell](https://www.haskell.org/) is potentially the most corely-functional language out there and has existed since 1990. Other languages such as Erlang, Scala, Clojure also fall into the functional category – and they all have a solid following. One of the major benefits of functional programming is the ability to write programs that run concurrently and that do it properly (check out my [post on concurrency](/2015/10/programming-concepts-concurrency/) if you need a refresher on what that means) – meaning that common concerns such as deadlock, starvation, and thread-safety really aren’t an issue. Concurrency in procedural-based languages is a nightmare because state can change at any given moment. Objects have state that can change, practically any function can change any variable as long as they’re in lexical scope (or dynamic scope, for the few languages that use it) – it’s very powerful, but very bad at keeping tabs on state.

Functional programming touts many benefits – but the ability to take advantage of all of a CPU’s cores via concurrent behavior is what makes it really shine compared to the other popular programming languages today – so I want to go over some of the core concepts that power this language paradigm.

* * *

**Foreword****:** All of these concepts are language-agnostic (in fact, many functional languages don’t even fully abide by them), but if you had to associate them with any one language, it would most likely fit best with Haskell, since Haskell most strictly abides by core functional concepts. The following 5 concepts are strictly theory-driven and help define the functional paradigm in the purest sense.

1\. Functions are Pure
----------------------

This is easily the foremost rule of functional programming. All functions are _pure_ in the sense that they abide by two restrictions:

1.  A function called multiple times with the same arguments will always return the same value. Always.
2.  No [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) occur throughout the function’s execution.

The first rule is relatively simple to understand – if I call the function **sum(2, 3)** – then it should always return the same value every time. Areas where this breaks down in more procedural-coding is when you rely on state that the function doesn’t control, such as global variables or any sort of randomized activity. As soon as you throw in a **rand()** function call, or access a variable not defined in the function – then the function loses its purity, and that can’t happen in functional programming.

The second rule – no side effects – is a little bit more broad in nature. A side effect is basically a state change in something other than the function that’s currently executing. Modifying a variable defined outside the function, printing out to the console, raising an exception, and reading data from a file are all examples of side effects which prevent a function from being pure. At first, this might seem like a big constraint for functional programming – but think about it. If you know for sure that a function won’t modify any sort of state outside the function itself, then you have full confidence that you can call this function in any scenario. This opens so many doors for concurrent programming and multi-threaded applications.

2. Functions are First-Class and can be Higher-Order
----------------------------------------------------

This concept isn’t exclusive to functional programming (it’s used pretty heavily in Javascript, PHP, and among other languages too) – but it is a requirement of being functional. In fact – there’s a whole Wikipedia article over the concept of [first-class functions](https://en.wikipedia.org/wiki/First-class_function). For a function to be first-class, you just have to be able to set it to a variable. That’s it. This allows you to handle the function as if it were a normal data type (such as an integer or string), and still be able to execute the function at some other point in runtime.

Higher-order functions build off of this concept of “functions as first-class citizens” and are defined as functions that either accept another function as an argument, or that return a function themselves. Common examples of higher-order functions are [map](https://en.wikipedia.org/wiki/Map_(higher-order_function)) functions which typically iterate over a list, modify the data based on a passed-in function, and return a new list, and [filter](https://en.wikipedia.org/wiki/Filter_(higher-order_function)) functions, which accept a function specifying how elements of a list should be selected, and return a new list with the selections.

3\. Variables are Immutable
---------------------------

This one’s pretty simple. In functional programming, you can’t modify a variable after it’s been initialized. You just can’t. You can create new variables just fine – but you can’t modify existing variables, and this really helps to maintain state throughout the runtime of a program. Once you create a variable and set its value, you can have full confidence knowing that the value of that variable will never change.

4. Functions have Referential Transparency
------------------------------------------

Referential transparency is a tricky definition to pinpoint, and if you ask 5 different developers, then you’re bound to get 5 different responses. The most accurate definition for referential transparency that I have come across (and that I agree with) is that if you can replace the value of a function call with its return value everywhere that it’s called _and_ the state of the program stays the same, then the function is referentially transparent. This might seem obvious – but let me give you an example.

Let’s say we have a function in Java that just adds 3 and 5 together:

{{< highlight java "linenos=table" >}}
// Java

public int addNumbers(){
  return 3 + 5;
}
 
addNumbers() // 8
{{< / highlight >}}

It’s pretty obvious that anywhere I call the **addNumbers()** function, I can easily replace that whole function call with the return value of 8 – so this function is referentially transparent. Here’s an example of one that’s not:

{{< highlight java "linenos=table" >}}
// Java

public void printText(){
  System.out.println("Hello World");
}
 
printText() // Returns nothing, but prints "Hello World"
{{< / highlight >}}

This is a void function, so it doesn’t return anything when called – so for the function to be referentially transparent, we should be able to replace the function call with nothing as well – but that obviously doesn’t work. The function changes the state of the console by printing out to it – so it’s not referentially transparent.

This is a tricky topic to get, but once you do, it’s a pretty powerful way to understand how functions really work.

5. Functional Programming is Based on Lambda Calculus
-----------------------------------------------------

Functional programming is heavily rooted in a mathematical system called [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus). I’m not a mathematician, and I certainly don’t pretend to be, so I won’t go into the nitty-gritty details about this field of math – but I do want to review the two core concepts of lambda calculus that really shaped the structure of how functional programming works:

1.  In lambda calculus, all functions can be written anonymously without a name – because the only portion of a function header that affects its execution is the list of arguments. In case you ever wondered, this is where _lambda_ (or anonymous) functions get their name in modern-day programming – because of lambda calculus. _\*Brain explosion\*_.
2.  When invoked, all functions will go through a process called [currying](https://en.wikipedia.org/wiki/Currying). What this means is that when a function with multiple arguments is called, it will execute the function once but it will only set one variable in the parameter list. At the end, a new function is returned with 1 less argument – the one that was just applied – and this new function is immediately invoked. This happens recursively until the function has been fully applied, and then a final result is returned. Because functions are pure in functional programming – this works. Otherwise, if state changes were a concern, currying could produce unsafe results.

As I mentioned earlier, there’s much more to lambda calculus than just this – but I wanted to review where some of the core concepts in functional programming came from. At the very least, you can bring up the phrase _lambda calculus_ when talking about functional programming, and everyone else will think you’re really smart.

Final Thoughts
--------------

Functional programming involves a significantly different train of thought than what you’re probably used to – but it’s really powerful, and I personally think this topic is going to come up again and again with CPUs these days offering more cores to handle processes instead of just using one or two beefed up cores per unit. While I mentioned Haskell as being one of the more pure functional languages out there – there are a handful of other popular languages too that are classified as functional: [Erlang](https://www.erlang.org/), [Clojure](https://clojure.org/), [Scala](http://www.scala-lang.org/), and [Elixir](http://elixir-lang.org/) are just a few of them, and I highly encourage you to check one (or more) of them out. Thanks for sticking with me this long, and I hope you learned something!
