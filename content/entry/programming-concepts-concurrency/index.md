---
title: "Programming Concepts: Concurrency"
date: "2015-10-09"
categories:
- blog
tags:
- Programming Concepts
draft: "false"
description: In this Programming Concepts series, we'll be learning about concurrency.
---
**Programming Concepts Series:**

*   [The Stack and the Heap](/2014/10/programming-concepts-the-stack-and-the-heap/)
*   [Compiled and Interpreted Languages](/2015/07/programming-concepts-compiled-and-interpreted-languages/)
*   Concurrency
*   [Static vs. Dynamic Type Checking](/2015/11/programming-concepts-static-vs-dynamic-type-checking/)
*   [Type Introspection and Reflection](/2016/02/programming-concepts-type-introspection-and-reflection/)
*   [Core Functional Programming Concepts](/2016/12/core-functional-programming-concepts/)
*   [Garbage Collection](/2017/01/programming-concepts-garbage-collection/)

* * *

For the third post in this Programming Concepts series, we’ll be discussing concurrency. [Concurrency](https://en.wikipedia.org/wiki/Concurrency_(computer_science)) is a property of systems (program, network, computer, etc.) in which several computations are executing simultaneously, and potentially interacting with each other. The computations start, run, and complete in overlapping time periods; they can run at the exact same instant (e.g. [parallelism](https://en.wikipedia.org/wiki/Parallel_computing)), but are not required to.

Concurrency in Programming
--------------------------

Concurrency is implemented in programming logic by explicitly giving computations or processes within a system their own separate execution point or _thread of control_. This allows these computations to avoid waiting for all other computations to complete – as is the case in sequential programming.

Concurrent Computing vs. Parallel Computing
-------------------------------------------

Although concurrent computing is considered a parent category that encompasses parallel programming, they share some distinct differences.

In [parallel computing](https://en.wikipedia.org/wiki/Parallel_computing), execution occurs at the exact same instant typically with the goal of optimizing modular computations. This forces parallel computing to utilize more than one processing core because each thread of control is running simultaneously and takes up the core’s entire clock cycle for the duration of execution – and thus parallel computing is impossible on a single-core machine. This differs from concurrent computing which focuses on the _lifetime_ of the computations overlapping and not necessarily their moments of execution. For example, the execution steps of a process can be broken up into [time slices](https://en.wikipedia.org/wiki/Time-sharing), and if the entire process doesn’t finish during its time slice then it can be paused while another process begins.

Why use Concurrent Programming?
-------------------------------

The ultimate benefit of concurrent programming is to utilize the resources of the executing machine to the fullest extent. This typically results in a speed boost in execution time because the program is no longer subject to normal sequential behavior. Starting in the early 2000’s, a common trend in personal computers has been to use multi-core processing units instead of a single omni-powerful CPU core. This helps to optimize the total execution time of a process with multiple threads by spreading the load across all cores. How processes and threads get scheduled is best left to its own discussion and getting down to that level of task scheduling is OS-specific, so I won’t dig deeper into how processes and threads are scheduled – but feel free to read up on some of the [synchronization](https://en.wikipedia.org/wiki/Synchronization_%28computer_science%29) patterns employed.

The concept of concurrency is employed in modern programming languages typically through a process called [multithreading](https://en.wikipedia.org/wiki/Thread_(computing)#Multithreading). Multithreading allows a program to run on multiple threads while still under the same parent process, thus providing the benefits of parallelization (faster execution, more efficient use of the computer’s resources, etc.) but also carrying with it the problems of parallelization too (discussed more below), which is why some languages make use of a mechanism called the [Global Interpreter Lock](https://en.wikipedia.org/wiki/Global_Interpreter_Lock) (GIL). The GIL is found most commonly in the standard implementations of Python and Ruby (CPython and Ruby MRI, respectively), and prevents more than one thread from executing at a time – even on multi-core processors. This might seem like a massive design flaw, but the GIL exists to prevent any [thread-unsafe](https://en.wikipedia.org/wiki/Thread_safety) activities – meaning that all code executing on a thread does not manipulate any shared data structures in a manner that risks the safe execution of the other threads. Typically language implementations with a GIL increase the speed of single-threaded programs and make integrations with C libraries easier (because they are often not thread-safe), but all at the price of losing multithreading capabilities.

However, if concurrency through a language implementation with a GIL is a strong concern, there are usually ways around this hindrance. While multithreading is not an option, applications interpreted through a GIL can still be designed to run on different _processes_ entirely – each one with their own GIL.

Problems with Concurrent Programming
------------------------------------

It has been said that the first rule of concurrent programming is _it’s hard_. Because the idea behind concurrency is to execute computations simultaneously, the potential exists for these separate tasks to access and unintentionally distort shared resources among them (e.g. thread-unsafe behavior). When shared resources are accessed, a programmatic [arbiter](https://en.wikipedia.org/wiki/Arbiter_(electronics)) is typically involved which handles the allocation of those resources – but this type of activity can ultimately create indeterminacy and lead to issues such as [deadlock](https://en.wikipedia.org/wiki/Deadlock "Deadlock") (where multiple computations are waiting on each other to finish, and thus never do), and [starvation](https://en.wikipedia.org/wiki/Resource_starvation "Resource starvation") (where resources are constantly denied to a certain task).

This makes coordination when executing concurrent tasks extremely important because even areas where the developer has little control – such as memory allocation on [the stack or the heap](/2014/10/programming-concepts-the-stack-and-the-heap/) – can become indeterminate.

The Future of Concurrent Programming
------------------------------------

Concurrent programming is incredibly powerful even given its obvious flaws, and thus it has been a very active field in theoretical computer science research. In programming, several languages have provided phenomenal support to give developers the tools to take advantage of concurrent behavior; this is perhaps most evident in the API behind [Go](https://golang.org/), one of the newest popular languages created by developers at Google. Other languages, such as Python and Ruby, see the negative power of concurrency and thus default to using a GIL.

Countless models have been built to better understand concurrency and describe various theories, such as the Actor Model, CSP Model, and Disruptor Model. However, just as with most programming concepts, there is no silver bullet for concurrent programming. If you build an application that employs concurrency, be sure to plan it carefully and know what’s going on at all times – or else you risk the cleanliness of your data.
