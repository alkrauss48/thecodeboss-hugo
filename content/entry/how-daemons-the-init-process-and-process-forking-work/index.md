---
title: How Daemons, the Init Process, and Process Forking Work
date: "2016-11-03"
categories:
- Blog
tags:
- How Things Work
- Devops
draft: "false"
---
If you’ve ever worked with Unix-based systems, then you’re bound to have heard the term _daemon_ (pronounced dee-mon) before. My goal here is to explain exactly what they are and how they work, especially since the name makes them seem more convoluted than they actually are.

At its surface, a [daemon](https://en.wikipedia.org/wiki/Daemon_(computing)) is nothing difficult to understand – it’s just a background process that’s not attached to the terminal in which it was spawned. But how do they get created, how are they related to other processes, and how do they actually work? That’s what we’re gonna get into today, but before we start really talking about daemons, we need to learn about how the init process and process forking both work.

How the Init Process Works
--------------------------

To start off, we need to talk about the [init process](https://en.wikipedia.org/wiki/Init) – also known as the _PID 1_ (because it always has the process ID of 1). The init process is the very first process that is created when you start up a Unix-based machine, which means that all other processes can somehow trace ancestry back to this process.

The init process is normally started when the Kernel calls a certain filename – often found in **/etc/rc** or **/etc/inittab** – but this location can change based on OS. Normally this process sets the path, checks the file system, initializes serial ports, sets the clock, and more. Finally, the last thing the init process handles is starting up all the other background processes necessary for your operating system to run properly – and it runs them as daemons. Typically, all of these daemon scripts exist in **/etc/init.d**/; it’s conventional to end all of the daemon executables with the letter _d_ (such as httpd, sshd, mysqld, etc.) – so you might think that this directory is named as such because of that, but it’s actually just a common unix convention to name directories that have multiple configuration files with a **.d** suffix. Great, so the init script starts the daemons, but we still haven’t answered how it does that. The init process starts the daemons by _forking_ its own process to create new processes, which leads us to talking about how process forking works.

How Process Forking Works
-------------------------

Traditionally in Unix, the only way to create a process is to create a copy of the existing process and to go from there. This practice – known as [process forking](https://en.wikipedia.org/wiki/Fork_(system_call)) – involves duplicating the existing process to create a child process and making an [exec](https://en.wikipedia.org/wiki/Exec_(computing)) system call to start another program. We get the phrase “process forking” because [fork](http://linux.die.net/man/2/fork) is an actual C method in the Unix standard library which handles creating new processes in this manner. The process that calls the fork command will be considered the parent process of the newly created child process. The child process is nearly identical to the parent process, with a few differences such as different process IDs and parent process IDs, no shared memory locks, no shared async I/O, and more.

In today’s Unix and Linux distributions, there are other manners in which you can create a process instead of using fork (such as [posix\_spawn](http://pubs.opengroup.org/onlinepubs/009696899/functions/posix_spawn.html)), but this is still how the vast majority of processes are created.

Now that you know a little bit about the traditional use of the term “fork” in computer science, it probably makes more sense why on GitHub you clone somebody else’s repo by _forking_ it. But I digress – back to daemons!

Finally, How Daemons Work
-------------------------

![Schematic over Maxwell's Demon](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/how-daemons-the-init-process-and-process-forking-work/maxwells-demon.png)

Before we get into how daemons work, I want to mention where the name comes from. The term _daemon_ was created from [MIT’s Project MAC](https://en.wikipedia.org/wiki/Project_MAC), who in turn got the name from [Maxwell’s Demon](https://en.wikipedia.org/wiki/Maxwell%27s_demon) (shown in the above image) – an imaginary being from a thought experiment that constantly works in the background, sorting molecules (see image). The exact spelling of _daemon_ comes from the Greek [daemon](https://en.wikipedia.org/wiki/Daemon_(classical_mythology)), which is a supernatural being that operates in the background of everyday life and is neither good nor evil in nature (instead of always evil, as we normally view demons). So as weird as it may sound, the term _daemon_ (referring to a Unix background process) is actually based on the concept of a supernatural demon as we think of it today.

Daemons are background process that run separately from the controlling terminal and just about always have the init process as a parent process ID (though they’re not required to); they typically handle things such as network requests, hardware activity, and other _wait & watch_ type tasks. They differ from simple background processes that are spawned in the terminal because these background process are typically bound to that terminal session, and when that terminal session ends it will send the SIGHUP message to all background processes – which normally terminates them. Because daemons are normally children of the init process, it’s more difficult to terminate them.

Daemons are spawned one of two ways: either the init process forks and creates them directly – like we mentioned above in the _init process_ segment – or some other process will fork itself to create a child process, and then the parent process immediately exits. The first condition seems pretty straightforward – the init process forks to create a daemon – but how does that second condition work, and how does the init process end up becoming the parent of these daemons?

When you fork a process to create a child process, and then immediately kill that parent process, the child process becomes an [orphaned process](https://en.wikipedia.org/wiki/Orphan_process) – a running process with no parent (not to be confused with a [zombie process](https://en.wikipedia.org/wiki/Zombie_process), such as a child process that has been terminated but is waiting on the parent process to read its exit status). By default, if a child process gets orphaned, the init process will automatically adopt the process and become its parent. This is a key concept to understand, because this is normally how daemons that you start after boot up relate to the init process. And that’s about all that makes daemons unique from normal background processes – see, not too bad!

Final Thoughts
--------------

All in all, daemons are a pretty simple concept to understand – but in order to fully grok them, we needed to go into what the init process is and how process forking works. Now go impress your friends, and tell them to start pronouncing it correctly too! _Dee-mon_ instead of _day-mon_.
