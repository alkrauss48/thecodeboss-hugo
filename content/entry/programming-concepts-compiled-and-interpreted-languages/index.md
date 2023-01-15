---
title: "Programming Concepts: Compiled and Interpreted Languages"
date: "2015-07-24"
categories:
- blog
tags:
- Programming Concepts
draft: "false"
description: In this Programming Concepts series, we'll be learning about and comparing compiled and interpreted languages.
---
**Programming Concepts Series:**

*   [The Stack and the Heap](/2014/10/programming-concepts-the-stack-and-the-heap/)
*   Compiled and Interpreted Languages
*   [Concurrency](/2015/10/programming-concepts-concurrency/)
*   [Static vs. Dynamic Type Checking](/2015/11/programming-concepts-static-vs-dynamic-type-checking/)
*   [Type Introspection and Reflection](/2016/02/programming-concepts-type-introspection-and-reflection/)
*   [Core Functional Programming Concepts](/2016/12/core-functional-programming-concepts/)
*   [Garbage Collection](/2017/01/programming-concepts-garbage-collection/)

* * *

As with my previous **Programming Concepts** post over [the Stack vs. the Heap](/2014/10/programming-concepts-the-stack-and-the-heap/ "Programming Concepts: The Stack and the Heap"), in this series I’m aiming to look back at core computing topics that affect everything about how we develop today, but are topics that most developers using higher level languages don’t ever need to deal with and thus may not fully understand them (myself included). In the same way that learning another programming language will make you a better developer, understanding the core of how different programming languages work will teach you a lot. Today’s topic: **Compiled Languages and Interpreted Languages**.

As developers, we often come across terms such as the _compiler_ or the _interpreter_ as we read blog posts, articles, StackOverflow answers, etc., but I feel like these are terms that we gloss over these days without really understanding them. Compilation and Interpretation are at the core of how all programming languages are executed; let’s take a look at how these concepts really work.

Introduction
------------

We depend on tools such as compilation and interpretation in order to get our written code into a form that the computer can execute. Code can either be executed natively through the operating system after it is converted to _machine code_ (via compilation) or can be evaluated line by line through another program which handles executing the code instead of the operating system itself (via interpretation).

A **compiled** **language** is one where the program, once compiled, is expressed in the instructions of the target machine; this machine code is undecipherable by humans. An **interpreted** **language** is one where the instructions are not directly executed by the target machine, but instead read and executed by some other program (which normally _is_ written in the language of the native machine). Both compilation and interpretation offer benefits and pitfalls, which is mainly what we’re going to talk about.

Before we get further, it needs to be said that most programming languages have both compiled implementations and interpretated implementations, and thus you can’t really classify an entire language as being compiled or interpreted – only a specific implementation. For the sake of simplicity however, I’ll be referring to either “compiled languages” or “interpreted languages” for the remainder of the post.

Compiled Languages
------------------

The major advantage of compiled languages over interpreted languages is their execution speed. Because compiled languages are converted directly into machine code, they run significantly faster and more efficiently than interpreted languages, especially considering the complexity of statements in some of the more modern scripting languages which are interpreted.

Lower-level languages tend to be compiled because efficiency is usually more of a concern than cross-platform support. Additionally, because compiled languages are converted directly into machine code, this gives the developer much more control over hardware aspects such as memory management and CPU usage. Examples of pure compiled languages include C, C++, Erlang, Haskell, and more modern languages such as Rust and Go.

Some of the pitfalls of compiled languages are pretty substantial however. In order to run a program written in a compiled language, you need to first manually compile it. Not only is this an extra step in order to run a program, but while you debug the program, you would need to recompile the program each time you want to test your new changes. That can make debugging very tedious. Another detriment of compiled languages is that they are not platform-independent, as the compiled machine code is specific to the machine that is executing it.

Interpreted Languages
---------------------

In contrast to compiled languages, interpreted languages do not require machine code in order to execute the program; instead, interpreters will run through a program line by line and execute each command. In the early days of interpretation, this posed a disadvantage compared to compiled languages because it took significantly more time to execute the program, but with the advent of new technologies such as [just-in-time compilation](http://en.wikipedia.org/wiki/Just-in-time_compilation), this gap is narrowing. Examples of some common interpreted languages include PHP, Perl, Ruby, and Python. Some of the programming concepts that interpreted languages make easier are:

*   Platform independence
*   [Reflection](http://en.wikipedia.org/wiki/Reflection_%28computer_programming%29)
*   [Dynamic typing](http://en.wikipedia.org/wiki/Type_system#Dynamic_type-checking_and_runtime_type_information)
*   Smaller executable program size
*   [Dynamic scoping](http://en.wikipedia.org/wiki/Scope_%28computer_science%29#Dynamic_scoping)

The main disadvantage of interpreted languages is a slower program execution speed compared to compiled languages. However, as mentioned earlier, just-in-time compilation helps by converting frequently executed sequences of interpreted instruction into host machine code.

* * *

Bonus: Bytecode Languages
-------------------------

Bytecode languages are a type of programming language that fall under the categories of both compiled and interpreted languages because they employ both compilation and interpretation to execute code. Java and the .Net framework are easily the most common examples of bytecode languages (dubbed **Common Intermediate Language** in .Net). In fact, the [Java Virtual Machine](http://en.wikipedia.org/wiki/Java_virtual_machine) (JVM) is such a common virtual machine to interpret bytecode that [several languages](http://en.wikipedia.org/wiki/List_of_JVM_languages) have implementations built to run on the JVM.

In a bytecode language, the first step is to compile the current program from its human-readable language into bytecode. **Bytecode** is a form of instruction set that is designed to be efficiently executed by an interpreter and is composed of compact numeric codes, constants, and memory references. From this point, the bytecode is passed to a virtual machine which acts as the interpreter, which then proceeds to interpret the code as a standard interpreter would.

In bytecode languages, there is a delay when the program is first run in order to compile the code into bytecode, but the execution speed is increased considerably compared to standard interpreted languages because the bytecode is optimized for the interpreter. The largest benefit of bytecode languages is platform independence which is typically only available to interpreted languages, but the programs have a much faster execution speed than interpreted languages. Similar to how interpreted languages make use of just-in-time compilation, the virtual machines that interpret bytecode can also make use of this technique to enhance execution speed.

* * *

Overview
--------

Most languages today can either be compiled or interpreted through their various implementations, making the difference between the two less relevant. One language execution style isn’t better than the other, but they certainly have their strengths and weaknesses.

In a nutshell, compiled languages are the most efficient type of programming language because they execute directly as machine code and can easily utilize more of the hardware specs of the running machine. In turn, this forces a significantly stricter coding style and a single program usually can’t be run on different operating systems. Interpreted languages on the other hand offer much more diversity in coding style, are platform-independent, and easily allow for dynamic development techniques such as metaprogramming. However, interpreted languages execute much slower than compiled languages – though just-in-time compilation has been helping to speed this up.

Bytecode languages are common as well, and try to utilize the strong points in both compiled and interpreted languages. This allows for programming languages that are platform independent like interpreted languages, while still executing at a speed significantly faster than interpreted languages.

I know there were no code examples here – but I really wanted to dig into this topic because I feel that this is one of those programming concepts that will always be relevant to us, no matter how abstract our higher-level languages get from the hardware level. Feel free to leave a comment if you want to see any specific **Programming Concepts** posts in the future!
