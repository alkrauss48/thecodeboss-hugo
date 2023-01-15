---
title: "Programming Concepts: Garbage Collection"
date: "2017-01-26"
categories:
- Blog
tags:
- Programming Concepts
draft: "false"
description: In this Programming Concepts series, we'll be learning about how various garbage collection strategies work.
---
**Programming Concepts Series:**

*   [The Stack and the Heap](/2014/10/programming-concepts-the-stack-and-the-heap/)
*   [Compiled and Interpreted Languages](/2015/07/programming-concepts-compiled-and-interpreted-languages/)
*   [Concurrency](/2015/10/programming-concepts-concurrency/)
*   [Static vs. Dynamic Type Checking](/2015/11/programming-concepts-static-vs-dynamic-type-checking/)
*   [Type Introspection and Reflection](/2016/02/programming-concepts-type-introspection-and-reflection/)
*   [Core Functional Programming Concepts](/2016/12/core-functional-programming-concepts/)
*   Garbage Collection

* * *

Continuing on in this series, today we’re going to talk about garbage collection (GC) – what it is, how it works, and what some of the algorithms behind it are. Let me just say now that there are people way smarter than me who can give you nitty-gritty details about how specific languages implement GC, what libraries alter it from the norm, etc. What I’m trying to accomplish here is to give you a bird’s eye view of this whole facet of development in the hopes that you learn something you didn’t know before – and if it genuinely interests you, then I hope you continue Googling to find those posts which dig a mile deep into specific GC implementations. Here, we’ll stick to about a few feet deep – so let’s start digging.

What is Garbage Collection?
---------------------------

At its core, GC is a process of automated memory management so that you as a developer have one less thing to worry about. When you allocate memory – like by creating a variable – that memory is allocated to either the stack or the heap (check out my post on [the stack vs. the heap](/2014/10/programming-concepts-the-stack-and-the-heap/) if you want to learn more about these two). You allocate to the stack when you’re defining things in a local scope where you know exactly the memory block size you need, such as primitive data types, arrays of a set size, etc. The stack is a self-managing memory store that you don’t have to worry about – it’s super fast at allocating and clearing memory all by itself. For other memory allocations, such as objects, buffers, strings, or global variables, you allocate to the heap.

Compared to the stack, the heap is not self-managing. Memory allocated to the heap will sit there throughout the duration of the program and can change state at any point in time as you manually allocate/deallocate to it. The garbage collector is a tool that removes the burden of manually managing the heap. Most modern languages such as Java, the .NET framework, Python, Ruby, Go, etc. are all garbage collected languages; C and C++, however, are not – and in languages such as these, manual memory management by the developer is an extremely important concern.

Why Do We Need It?
------------------

GC helps save the developer from several memory-related issues – the foremost being [memory leaks](https://en.wikipedia.org/wiki/Memory_leak). As you allocate more and more memory to the heap, if the program doesn’t consistently release this memory as it becomes unneeded, memory size will begin to add up – resulting in a [heap overflow](https://en.wikipedia.org/wiki/Heap_overflow). Even if heap memory is diligently managed by the developer – all it takes is one variable to be consistently left undeleted to result in a memory leak, which is bad.

Even if there are no memory leaks, what happens if you are attempting to reference a memory location which has already been deleted or reallocated? This is called a [dangling pointer](https://en.wikipedia.org/wiki/Dangling_pointer); the best case scenario here is that you would get back gibberish, and hopefully throw or cause a validation error soon after when that variable is used – but there’s nothing stopping that memory location from being overwritten with new data which could respond with seemingly valid (but logically incorrect) data. You’d have no idea what would be going on, and it’s these types of errors – memory errors – that are often times the most difficult to debug.

That’s why we need GC. It helps with all of this. It’s not perfect – it does use up extra resources on your machine to work and it’s normally not as efficient as proper manual memory management – but the problems it saves you from make it more than worth it.

How and When does the Garbage Collector Run?
--------------------------------------------

This depends entirely on the algorithm used for GC. There isn’t one hard and fast way to do it, and just like compilers and interpreters, GC mechanisms get better over time. Sometimes the garbage collector will run at pre-determined time intervals, and sometimes it waits for certain conditions to arise before it will run. The garbage collector will just about always run on a separate thread in tandem with your program – and depending on the language’s implementation of GC, it can either stall your program (i.e. stop-the-world GC) to sweep out all the garbage at once, run incrementally to remove small batches, or run concurrently with your program.

It’s difficult to get deeper than this without getting into specific languages’ implementations of GC, so let’s move onto the common GC algorithms.

Garbage Collection Algorithms
-----------------------------

There’s a bunch of different GC algorithms out there – but here are some of the most common ones you’ll come across. It’s interesting to note how many of these common algorithms build on one another.

### Reference Counting

[Reference counting](https://en.wikipedia.org/wiki/Reference_counting) is perhaps the most basic form of GC, and the easiest to implement on your own. The way it works is that anytime you reference a memory location on the heap, a counter for that particular memory location increments by 1. Every time a reference to that location is deleted, the counter decrements by 1. When that counter gets to 0, then that particular memory location is garbage collected.

One of the big benefits of GC by reference counting is that it can immediately tell if there is garbage (when a counter hits 0). However, there are some major problems with reference counting; circular references just flat out can’t be garbage collected – meaning that if object A has a reference to object B, and object B has a reference back to object A, then neither of these objects can ever be garbage collected according to reference counting. On top of this, reference counting is very inefficient because of the constant writes to the counters for each memory location.

Because of these problems, other algorithms (or at least refined versions of reference counting) are more commonly used in modern GC.

### Mark-Sweep

Mark-sweep – as well as just about all modern GC algorithms other than reference counting – is a form of a [tracing](https://en.wikipedia.org/wiki/Tracing_garbage_collection) GC algorithm, which involves _tracing_ which objects are reachable from one or multiple “roots” in order to find unreachable (and thus unused) memory locations. Unlike reference counting, this form of GC is not constantly checking and it can theoretically run at any point in time.

The most basic form of mark-sweep is the [naïve mark-sweep](https://en.wikipedia.org/wiki/Tracing_garbage_collection#Na.C3.AFve_mark-and-sweep); it works by using a special bit on each allocated memory block that’s specifically for GC, and running through all memory currently allocated on the heap twice: the first time to **mark** locations of dead memory via that special bit, and the second time to **sweep** (i.e. deallocate) those memory locations.

Mark-sweep is more efficient than reference counting because it doesn’t need to keep track of counters; it also solves the issue of not being able to remove circularly referenced memory locations. However, naïve mark-sweep is a prime example of stop-the-world GC because the entire program must be suspended while it’s running (non-naïve tracing algorithms can run incrementally or concurrently). Because tracing GC can happen at any point in time, you don’t ever have a good idea of when one of these stalls will happen. Heap memory is also iterated over twice – which slows down your program even more. On top of that, in mark-sweep there’s no handling of fragmented memory; to give you a visual representation of this, imagine drawing a full grid representing all of your heap memory – mark-sweep GC would make that grid look like a very bad game of Tetris. This fragmentation almost always leads to less efficient allocation of memory on the heap. So – we continue to optimize our algorithms.

### Mark-Compact

[Mark-compact](https://en.wikipedia.org/wiki/Mark-compact_algorithm) algorithms take the logic from mark-sweep and add on at least one more iteration over the marked memory region in an effort to _compact_ them – thus defragmenting them. This address the fragmentation caused by mark-sweep, which leads to significantly more efficient future allocations via the use of a “bump” allocator (similar to how a stack works), but adds on extra time and processing while GC is running because of the extra iteration(s).

### Copying

Copying (also known as [Cheney’s Algorithm](https://en.wikipedia.org/wiki/Cheney%27s_algorithm)) is slightly similar to mark-compact, but instead of iterating potentially multiple times over a single memory region, you instead just copy the “surviving” memory blocks of the region into an entirely new empty region after the mark phase – which thus compacts them by default. After the copying is completed, the old memory region is deallocated, and all existing references to surviving memory will point to the new memory region. This relieves the GC of a lot of processing, and brings down the specs to something even quicker than a mark-sweep process since the sweep phase is eliminated.

While you’ve increased speed though, you now have an extra requirement of needing an entirely available region of memory that is at least as large as the size of all surviving memory blocks. Additionally, if most of your initial memory region includes surviving memory, then you’ll be copying a lot of data – which is inefficient. This is where GC _tuning_ becomes important.

### Generational

[Generational GC](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)#Generational) takes concepts from copying algorithms, but instead of copying all surviving members to a new memory region, it instead splits up memory into _generational_ regions based on how old the memory is. The rationale behind generational GC is that normally, young memory is garbage collected much more frequently than older memory – so therefore the younger memory region is scanned to check for unreferenced memory much more frequently than older memory regions. If done properly, this saves both time and CPU processing because the goal is to scan only the necessary memory.

Older memory regions are certainly still scanned – but not as often as younger memory regions. If a block of memory in a younger memory region continues to survive, then it can be promoted to an older memory region and will be scanned less often.

Final Thoughts
--------------

GC isn’t the easiest topic to fully understand, and it’s something that you really don’t even need to understand when developing with modern languages – but just because you don’t _need_ to know it doesn’t give you a good excuse for not learning about it. While it doesn’t affect much of the code you write, it’s an integral part of every language implementation, and the algorithm behind an implementation’s garbage collector is often times a large reason why people tend to like or dislike certain implementations. If you stuck with me this far, then I’m glad – and I hope you learned something. If this interested you, I encourage you to continue looking into GC – and [here’s a fun resource](https://spin.atomicobject.com/2014/09/03/visualizing-garbage-collection-algorithms/) you can start off with that shows you some animated GIFs of how different GC algorithms visually work.

Interestingly, while researching this topic, the vast majority of posts I came across talk about how GC works specifically to the main implementation of Java. GC certainly isn’t exclusive to Java, but I imagine the reason for this is because Java is often times heavily compared to C++ which isn’t garbage collected. Hopefully over time, more posts will become popular over how GC works in other languages – but for now, we’ll take what we can get!
