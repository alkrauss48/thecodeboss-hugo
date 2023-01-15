---
title: "Programming Concepts: The Stack and the Heap"
date: "2014-10-04"
categories:
- blog
tags:
- Programming Concepts
draft: "false"
description: In this Programming Concepts series, we'll be reviewing 2 major memory concepts - the Stack and the Heap
---
**Programming Concepts Series:**

*   The Stack and the Heap
*   [Compiled and Interpreted Languages](/2015/07/programming-concepts-compiled-and-interpreted-languages/)
*   [Concurrency](/2015/10/programming-concepts-concurrency/)
*   [Static vs. Dynamic Type Checking](/2015/11/programming-concepts-static-vs-dynamic-type-checking/)
*   [Type Introspection and Reflection](/2016/02/programming-concepts-type-introspection-and-reflection/)
*   [Core Functional Programming Concepts](/2016/12/core-functional-programming-concepts/)
*   [Garbage Collection](/2017/01/programming-concepts-garbage-collection/)

* * *

As we continue to use more advanced programming languages, we’re able to get some seriously powerful development done with much less code that does increasingly more awesome stuff, but that comes at a price. Since we don’t deal as often with low-level computation and processing anymore, it’s only normal that we don’t always have a full understanding about topics like what the stack is versus the heap, or how compilation really works, or what static vs dynamic typing is, or type introspection, or garbage collection, etc. Now I’m not saying every developer is ignorant of these, as most of us certainly aren’t, but I do feel like it’s worth revisiting some of the _old-school_ important topics that we may miss out on these days.

I know I’ve opened up a wormhole of topics just now, but right now I’m only focusing on one: **the** **stack vs. the heap**. Both the stack and the heap refer to different locations where memory (typically for variables) is managed, but with significantly different strategies.

The Stack
---------

The stack is a region of RAM that gets created on every thread that your application is running on. It works in a LIFO (Last In, First Out) manner, meaning that as soon as you allocate – or “push” – memory on to the stack, that chunk of memory will be the first to be deallocated – or “popped.” Every time a function declares a new variable, it is “pushed” onto the stack, and after that variable falls out of scope (such as when the function closes), that variable will be deallocated from the stack automatically. Once a stack variable is freed, that region of memory becomes available for other stack variables.

Due to the pushing and popping nature of the stack, memory management is very logical and is able to be handled completely by the CPU; this makes it very quick, especially since each byte in the stack tends to be reused very frequently which means it tends to be mapped to the processor’s cache. However, there are some cons to this form of strict management. The size of the stack is a fixed value, and allocating more onto the stack than it can hold will result in a stack overflow. The size of the stack is decided when the thread is created, and each variable has a maximum size that it can occupy based on its data type; this prevents certain variables such as integers from ever growing beyond a certain value, and forces more complex data types such as arrays to specify their size prior to runtime since the stack won’t let them be resized. Variables allocated on the stack also are always local in nature because they are always next in line to be popped (unless more variables are pushed prior to the popping of earlier variables).

Overall, the stack really exceeds in managing memory in the most efficient way possible – but what if you need data structures that can be dynamic, such as a dynamically sized array, or what if you need global variables? This is where the heap comes into play.

The Heap
--------

The heap is a memory store also in RAM that allows for dynamic memory allocation, and does not work on a stack-like basis; this means there is no notion of pushing and popping variables, and it’s more just a hub of storage for you to define your variables. Once you allocate a memory location on the heap to store a variable, that variable can be accessed at any point in time not only throughout just the thread, but throughout the application’s entire life. This is how you can define global variables. Once an application ends, all of the allocated memory locations are reclaimed by the CPU. The heap size is set on application startup, but unlike the stack there are no size restrictions on the heap (aside from the physical limitations of your machine), which means it can get ever larger as you allocate more memory to it. This is what allows you to create variables that can be dynamically resized, since the heap itself is dynamic in size.

You interact with the heap via references typically called ‘pointers,’ which are variables whose values are the address of another variable, such as a memory location. By creating a pointer, you ‘point’ at a memory location on the heap, which is what signifies the initial location of your variable and tells the program where to access the value. Due to the dynamic nature of the heap, it is completely unmanaged by the CPU aside from initial allocation and heap resizing; in non-garbage collected languages such as C and C++, this requires you as the developer to manage memory and to manually free memory locations when they are no longer needed. Failing to do so can create memory leaks and cause memory to become fragmented, which will cause reads from the heap to take longer and makes it difficult to continuously allocate more memory onto the heap.

Compared to the stack, the heap is slower to access because variables are scattered across memory instead of always sitting at the top of the stack. Improper memory management of the heap can also slow down reading from the heap; however, this shouldn’t detract from its importance – you absolutely need it to create any type of variable dynamically, or a global variable.

Final Thoughts
--------------

So there you have it – the basics of the stack and the heap. In a nutshell, the stack is an amazingly fast memory store with a LIFO allocation algorithm that is managed completely by the CPU, and you don’t have to manage it at all. However, these benefits force the stack to have a limited size and a specific method for retrieving values, so you are only allowed to allocate fixed memory sizes (i.e. fixed-length variables) and local variables on it. To make up for these limitations, the heap allows you to create dynamically allocated variables during runtime, as well as global variables – but either you or the garbage collector must handle memory management, and it is quite a bit slower than using the stack.

The importance of the stack and the heap really comes into play with non-garbage collected languages where you need to manage memory yourself – and while modern languages do abstract away the need for this, they’re all still doing it under the scenes. Different languages use the stack and the heap differently; C and C++ allocate to the stack automatically, and you as the developer manually have to allocate and deallocate from the heap, where more modern languages such as Go and Java allocate to both the stack and the heap automatically, and have a garbage collector that handles heap deallocation on its own. There are even languages like Ruby and Python where everything is allocated on the heap and don’t use a stack at all.

I hope this helped to provide some historic programming knowledge that we tend to miss out on these days! I plan on continuing this series over core programming concepts in future blog posts, which you also may enjoy if you found this interesting. For more information on the stack and the heap, google away – the answers are at your doorstep (or browser)!
