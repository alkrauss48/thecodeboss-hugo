---
title: "Power Tools: Using Grep, Xargs, and Sed"
date: "2014-09-04"
categories:
- Blog
tags:
- Devops
draft: "false"
---
I was recently inspired to write this post after I came across a situation where I needed to edit multiple files and change all instances of one word to another (in this case I was changing the word **vim** just to **v**). While this sounds like a simple task, let’s break this up for a second to see what’s all entailed: We’re having to filter the files that contain this word, then we need to spin through each of these files and open them up individually, modify them, and rewrite the file inline to the same filename. It may still sound simple, but we do have a lot of moving parts going on here.

Many high-level text editors and IDE’s have the ability to do this for you, which is certainly nice, but what happens if you’re in an environment where you don’t have access to those tools? You may say that you’ll never work away from your personal machine, but it’s very possible you could log into a VPS or ssh into another user’s machine where all you have access to are terminal tools. Additionally, the need to do this is not necessarily developer-specific, so if you’re a systems administrator for example, you easily might not have higher-level editors installed – but you probably have some shell skills. That’s where three tools come in that are included in the base shell languages we use today: [grep](http://linux.die.net/man/1/grep "Grep"), [xargs](http://linux.die.net/man/1/xargs "Xargs"), and [sed](http://linux.die.net/man/1/sed "Sed").

You easily could ahve heard of these before and already know how to use them, and if so, then carry on friend! You’ve probably nothing more to gain here. But if you’d like to know just a little bit about how to use them, read on.

* * *

Grep
----

Grep is base unix search command which will spin through one or many files in order to tell you which files contain your phrase and a little info about where they are located. Here’s an example of a standard way to use grep:

{{< highlight bash "linenos=table" >}}
cat index.html | grep footer
{{< / highlight >}}

This would print out each line in index.html that contained the word footer. You can also search for phrases that include spaces by surrounding the phrase with quotation marks (they won’t count as part of the search query). Or you can use grep as a sole command, and not pipe anything to it:

{{< highlight bash "linenos=table" >}}
grep "this is a phrase" ./*.txt
{{< / highlight >}}

This would print out each line in every text file in the current directory that contained the phrase “this is a phrase.” Additionally, if we’re searching through multiple files, we can pass in the **\-l** tag to get just the filenames. Grep also has support for regular expressions which can be used with the **\-G** option:

{{< highlight bash "linenos=table" >}}
grep -Gl 'ngrok \d000$' ./*
{{< / highlight >}}

This would find all instances of a line that ends in ‘ngrok \*000’ where the \* represents any digit, and only the filenames will be printed out. Grep can do much, much more than this, but using as shown here is probably the most common. Other search tools such as [Ack](http://beyondgrep.com/ "Ack") and [Ag](https://github.com/ggreer/the_silver_searcher "Ag") exist that are geared towards filtering source code, but I wanted to stick with grep since it’s a common tool that exists on all \*nix systems.

Xargs
-----

Xargs is an awesome command which basically has one job – you give it a command, and it runs that same command multiple times for a certain number of arguments that you give it. If you’re a programmer, think of it as a loop that executes through a list. Per the man page of xargs, it takes delimited strings from the standard input and executes a utility with the strings as arguments; the utility is repeatedly executed until standard input is exhausted.

Sound too wordy? An example is worth a thousand words:

{{< highlight bash "linenos=table" >}}
ls | xargs -0 -n 1 echo
{{< / highlight >}}

This will run run the echo command as many times as you have files in the current directory, and it will pass in the filename (piped in by the **ls** command) to the echo command, so that it will echo each individual file name. The **\-0** option forces xargs to be line-oriented, and therefore it will accept arguments based on a full new line (this is **very** important; you probably don’t want xargs breaking up args based on spaces in the same line). The **\-n 1** option is used to tell xargs that you want to split the arguments to call only one argument per command iteration. If you specified 2, then you would echo 2 filenames on the same line, and if you leave out the option altogether, then you will just echo once, listing every filename on the same line.

By default, xargs adds in the arguments at the end of the command call, but what if we need to use that argument at the beginning or the middle of the line? Well, that’s completely doable with the **\-I** option.

{{< highlight bash "linenos=table" >}}
ls | xargs -0 -n 1 -I my_var echo "my_var is a file"
{{< / highlight >}}

Now xargs will no longer defaultly pass in the argument at the end of the line, and we instead have a placeholder for our arguments that we can use wherever we please for our command.

Pretty simple. Xargs does have some more options, but this is the crux of what you use it for: splitting up incoming arguments to be used as a part of another command.

Sed
---

Sed, just like xargs, has one job that it does very well. Short for stream editor, sed is a handy little command which will read one or more files (or standard input, if no file is given), apply changes to those files based on a series of commands, and then write the output either in place of the file or to the standard output. How this applies to the user is that you can very easily and quickly replace text in multiple files with this one command. Here’s a simple example:

{{< highlight bash "linenos=table" >}}
sed 's/start/end/g' ./*
{{< / highlight >}}

This will spin through every file in the current directory and replace every instance of the word **start** with **end**, but it will write the output to the standard output and not update the actual files. If we wanted to open up the files, make the changes, and then save them in place (probably how you want to use sed), then we just need to throw in one little option:

{{< highlight bash "linenos=table" >}}
sed -i '' 's/start/end/g' ./*
{{< / highlight >}}

The **\-i** option states that we want to write the files in place and save the backups to the same filename appended by a certain extension. By passing in empty quotes, we skip saving the backups and are only left with the changes to our files. This tool is very powerful; it probably doesn’t seem like you’re doing much – but when you can change every instance a phrase to another phrase in 100+ files at a time, with a command under 20 characters, it’s crazy to think about. Now with great power comes great responsibility. Due to its simplicity, it’s easy to get carried away with things or not double check yourself. There’s no undo here, so if you do use sed, make sure you do a dry run without the **\-i** option first, and it would be even better if you make these changes in a versioned environment (using something like git) so you can revert changes if you need to.

Combining Them
--------------

By combining these three small commands that are common across all \*nix systems, we can do some pretty powerful text replacement. Most of the action comes from using sed, but the other commands help gather and prepare everything. So let’s put together what we’ve learned into a single command that we can actually use:

{{< highlight bash "linenos=table" >}}
grep vim ./* -l | xargs -0 -n 1 sed -i '' 's/vim/v/g'
{{< / highlight >}}

Look familiar at all? This was the command I mentioned at the beginning of the post that I ran to change all instances of _vim_ to just be _v_ instead. It’s true, for this particular situation, I could have gotten away with using only sed, but that’s only because I was searching for the exact term that I was wanting to change. If I wanted to search for all the files that had the phrase _Hallabaloo_, but still wanted to change the word _vim_ to _v_, then I would need to write a full command like this.

So will you always need to run a command like this? No, but you probably will at some point, and even if you have an easier way to do it than remembering this multipart command, I hope you’ve at least learned a little bit more about how you can use grep, xargs, and sed in your workflow.
