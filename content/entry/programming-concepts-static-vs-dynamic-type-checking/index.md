---
title: "Programming Concepts: Static vs Dynamic Type Checking"
date: "2015-11-20"
categories:
- blog
tags:
- Programming Concepts
draft: "false"
description: In this Programming Concepts series, we'll be learning about and comparing static and dynamic type checking.
---
**Programming Concepts Series:**

*   [The Stack and the Heap](/2014/10/programming-concepts-the-stack-and-the-heap/)
*   [Compiled and Interpreted Languages](/2015/07/programming-concepts-compiled-and-interpreted-languages/)
*   [Concurrency](/2015/10/programming-concepts-concurrency/)
*   Static vs. Dynamic Type Checking
*   [Type Introspection and Reflection](/2016/02/programming-concepts-type-introspection-and-reflection/)
*   [Core Functional Programming Concepts](/2016/12/core-functional-programming-concepts/)
*   [Garbage Collection](/2017/01/programming-concepts-garbage-collection/)

* * *

When learning about programming languages, you’ve probably heard phrases like _statically-typed_ or _dynamically-typed_ when referring to a specific language. These terms describe the action of **type checking**, and both static type checking and dynamic type checking refer to two different **type systems**. A type system is a collection of rules that assign a property called type to various constructs in a computer program, such as variables, expressions, functions or modules, with the end goal of reducing the number of bugs by verifying that data is represented properly throughout a program.

Don’t worry, I know that all sounds confusing, so before we get further let’s start at the beginning. What is type checking, and while we’re at it, what’s a type?

A Type
------

A [type](https://en.wikipedia.org/wiki/Data_type), also known as a data type, is a classification identifying one of various types of data. I hate to use the word type in its own definition, so in a nutshell a type describes the possible values of a structure (such as a variable), the semantic meaning of that structure, and how the values of that structure can be stored in memory. If this sounds confusing, just think about Integers, Strings, Floats, and Booleans – those are all types. Types can be broken down into categories:

*   **Primitive types** – these range based on language, but some common primitive types are integers, booleans, floats, and characters.
*   **Composite types** – these are composed of more than one primitive type, e.g. an array or record (not a hash, however). All composite types are considered [data structures](https://en.wikipedia.org/wiki/Data_structure).
*   **Abstract types** – types that do not have a specific implementation (and thus can be represented via multiple types), such as a hash, set, queue, and stack.
*   **Other types** – such as [pointers](https://en.wikipedia.org/wiki/Pointer_(computer_programming)) (a type which holds as its value a reference to a different memory location) and functions.

Certain languages offer built-in support for different primitive types or data structures than other languages, but the concepts are the same. A type merely defines a set of rules and protocols behind how a piece of data is supposed to behave.

Type Checking
-------------

The existence of types is useless without a process of verifying that those types make logical sense in the program so that the program can be executed successfully. This is where type checking comes in. [Type checking](https://en.wikipedia.org/wiki/Type_system#Type_checking) is the process of verifying and enforcing the constraints of types, and it can occur either at compile time (i.e. statically) or at runtime (i.e. dynamically). Type checking is all about ensuring that the program is [type-safe](https://en.wikipedia.org/wiki/Type_safety), meaning that the possibility of type errors is kept to a minimum. A type error is an erroneous program behavior in which an operation occurs (or trys to occur) on a particular data type that it’s not meant to occur on. This could be a situation where an operation is performed on an integer with the intent that it is a float, or even something such as adding a string and an integer together:
{{< highlight bash "linenos=table" >}}
x = 1 + "2"
{{< / highlight >}}

While in many languages both strings and integers can make use of the **+** operator, this would often result in a type error because this expression is usually not meant to handle multiple data types.

When a program is considered not type-safe, there is no single standard course of action that happens upon reaching a type error. Many programming languages throw type errors which halt the runtime or compilation of the program, while other languages have built-in safety features to handle a type error and continue running (allowing developers to exhibit poor type safety). Regardless of the aftermath, the process of type checking is a necessity.

* * *

Now that we have a basic understanding of what types are and how type checking works, we can start getting into the two primary methods of type checking: **static type checking** and **dynamic type checking**.

Static Type Checking
--------------------

A language is statically-typed if the type of a variable is known at **compile time** instead of at runtime. Common examples of statically-typed languages include Ada, C, C++, C#, JADE, Java, Fortran, Haskell, ML, Pascal, and Scala.

The big benefit of static type checking is that it allows many type errors to be caught early in the development cycle. Static typing usually results in compiled code that executes more quickly because when the compiler knows the exact data types that are in use, it can produce optimized machine code (i.e. faster and/or using less memory). Static type checkers evaluate only the type information that can be determined at compile time, but are able to verify that the checked conditions hold for all possible executions of the program, which eliminates the need to repeat type checks every time the program is executed.

A static type-checker will quickly detect type errors in rarely used code paths. Without static type checking, even code coverage tests with 100% coverage may be unable to find such type errors. However, a detriment to this is that static type-checkers make it nearly impossible to manually raise a type error in your code because even if that code block hardly gets called – the type-checker would almost always find a situation to raise that type error and thus would prevent you from executing your program (because a type error was raised).

Dynamic Type Checking
---------------------

Dynamic type checking is the process of verifying the type safety of a program at **runtime**. Common dynamically-typed languages include Groovy, JavaScript, Lisp, Lua, Objective-C, PHP, Prolog, Python, Ruby, Smalltalk and Tcl.

Most type-safe languages include some form of dynamic type checking, even if they also have a static type checker. The reason for this is that many useful features or properties are difficult or impossible to verify statically. For example, suppose that a program defines two types, A and B, where B is a subtype of A. If the program tries to convert a value of type A to type B, which is known as [downcasting](https://en.wikipedia.org/wiki/Downcasting "Downcasting"), then the operation is legal only if the value being converted is actually a value of type B. Therefore, a dynamic check is needed to verify that the operation is safe. Other language features that dynamic-typing enable include [dynamic dispatch](https://en.wikipedia.org/wiki/Dynamic_dispatch "Dynamic dispatch"), [late binding](https://en.wikipedia.org/wiki/Late_binding "Late binding"), and [reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming) "Reflection (computer programming)").

In contrast to static type checking, dynamic type checking may cause a program to fail at runtime due to type errors. In some programming languages, it is possible to anticipate and recover from these failures – either by error handling or poor type safety. In others, type checking errors are considered fatal. Because type errors are more difficult to determine in dynamic type checking, it is a common practice to supplement development in these languages with [unit testing](https://en.wikipedia.org/wiki/Unit_testing).

All in all, dynamic type checking typically results in less optimized code than does static type checking; it also includes the possibility of runtime type errors and forces runtime checks to occur for every execution of the program (instead of just at compile-time). However, it opens up the doors for more powerful language features and makes certain other development practices significantly easier. For example, [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) – especially when using [_eval_ functions](https://en.wikipedia.org/wiki/Eval) – is not impossible in statically-typed languages, but it is much, much easier to work with in dynamically-typed languages.

Common Misconceptions
---------------------

#### Myth #1: Static/Dynamic Type Checking == Strong/Weak Type Systems

A common misconception is to assume that all statically-typed languages are also strongly-typed languages, and that dynamically-typed languages are also weakly-typed languages. This isn’t true, and here’s why:

A **strongly-typed language** is one in which variables are bound to specific data types, and will result in type errors if types to not match up as expected in the expression – regardless of when type checking occurs. A simple way to think of strongly-typed languages is to consider them to have high degrees of type safety. To give an example, in the following code block repeated from above, a strongly-typed language would result in an explicit type error which ends the program’s execution, thus forcing the developer to fix the bug:

{{< highlight bash "linenos=table" >}}
x = 1 + "2"
{{< / highlight >}}

We often associate statically-typed languages such as Java and C# as strongly-typed (which they are) because data types are explicitly defined when initializing a variable – such as the following example in Java:

{{< highlight java "linenos=table" >}}
// Java
String foo = new String("hello world");
{{< / highlight >}}

However, ruby and python (both of which are dynamically-typed) are also strongly-typed languages and the developer makes no verbose statement of data type when declaring a variable. Below is the same java example above, but written in ruby.

{{< highlight ruby "linenos=table" >}}
# Ruby
foo = "hello world"
{{< / highlight >}}

Both of the languages in these examples are strongly-typed, but employ different type checking methods. Languages such as ruby, python, and javascript which do not require manually defining a type when declaring a variable make use of [type inference](https://en.wikipedia.org/wiki/Strong_and_weak_typing#Type_inference) – the ability to programmatically infer the type of a variable based on its value. Some programmers automatically use the term weakly typed to refer to languages that make use of type inference, often without realizing that the type information is present but implicit. Type inference is a separate feature of a language that is unrelated to any of its type systems.

A **weakly-typed language** on the other hand is a language in which variables are not bound to a specific data type; they still have a type, but type safety constraints are lower compared to strongly-typed languages. Take the following PHP code for example:

{{< highlight php "linenos=table" >}}
// PHP
$foo = "x";
$foo = $foo + 2; // not an error
echo $foo; // 2
{{< / highlight >}}

Because PHP is weakly-typed, this would not error. Just as the assumption that all strongly-typed languages are statically-typed, not all weakly-typed languages are dynamically-typed; PHP is a dynamically-typed language, but C – also a weakly-typed language – is indeed statically-typed.

Myth officially busted.

While they are two separate topics, static/dynamic type systems and strong/weak type systems are related on the issue of type safety. One way you can compare them is that a language’s static/dynamic type system tells _when_ type safety is enforced, and its strong/weak type system tells _how_ type safety is enforced.

#### Myth #2: Static/Dynamic Type Checking == Compiled/Interpreted Languages

It is true that most statically-typed languages are usually compiled when executed, and most dynamically-typed languages are interpreted when executed – but you can’t always assume that, and there’s a simple reason for this:

When we say that a language is statically- or dynamically-typed, we are referring to that **language as a whole**. For example, no matter what version of Java you use – it will always be statically-typed. This is different from whether a language is compiled or interpreted, because in that statement we are referring to a **specific language implementation**. Thus in theory, any language can be compiled or interpreted. The most common implementation of Java is to compile to bytecode, and have the JVM interpret that bytecode – but there are other implementations of Java that compile directly to machine code or that just interpret Java code as is.

If this still is unclear, hop on over to my previous post on [Compiled vs. Interpreted Languages](/2015/07/programming-concepts-compiled-and-interpreted-languages/), where we dig into this topic at length.

Conclusion
----------

I know we went over a lot – but you’re a good developer, so I knew you could handle it. I debated on breaking strongly-typed and weakly-typed languages out from this post, but that topic alone isn’t large enough to warrant its own post – plus I needed to break up the myths that a strong/weak type system is related to type checking.

There’s no answer to if statically-typed languages are better than dynamically-typed languages, and vice versa – they’re just different type systems with their own sets of pros and cons. Some languages  – like Perl and C# – even allow you to choose between static and dynamic type safety throughout your code. Understanding the type systems of your favorite programming languages will allow you to better understand why some errors may or may not pop up in the places that they do, and why.

I hope you learned a little bit today – I promise reviewing core programming concepts like these will help make you a better developer because you’re getting more of a grip on what’s going on behind the scenes of your code. Thanks for reading, and stick around for more posts in this Programming Concepts series!
