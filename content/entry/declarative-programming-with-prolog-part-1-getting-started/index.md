---
title: "Declarative Programming with Prolog – Part 1: Getting Started"
date: "2018-06-07"
categories:
- Blog
tags:
- Prolog
draft: "false"
---
**Table of Contents**

*   Part 1 – Getting Started
*   [Part 2 – Unification, Recursion, and Lists](/2018/07/declarative-programming-with-prolog-part-2-unification-recursion-and-lists/)
*   [Part 3 – Putting it All Together](/2018/08/declarative-programming-with-prolog-part-3-putting-it-all-together/)

* * *

Have you ever run into a programming problem that seemed difficult to solve, but you could easily describe the rules of the problem? Think about games like tic-tac-toe, checkers, and sudoku; as humans, we’re able to understand the rules of these games pretty easily – and sure, you could write a program to implement them, but it wouldn’t be nearly as easy as just teaching a friend how they work. But why does this even matter? We know programming is different than just talking to another person, so why even try to compare them? Well, what if we could just write a program where we instead _describe_ the rules that we need to abide by instead of explicitly _telling_ our program how to do everything? I know that sounds crazy – but it’s 100% doable, and there are tools out there like Prolog that are meant just for this.

[Prolog](https://en.wikipedia.org/wiki/Prolog) is a really awesome language that allows you to do things that many other languages such as C, JavaScript, Python, C#, Ruby, etc. just can’t do. That’s because Prolog isn’t like these other languages; it’s a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) language, whereas those others (and countless more) are [imperative](https://en.wikipedia.org/wiki/Imperative_programming). We’ll come back to what those terms mean here in a bit.

Prolog isn’t a new language, either; it’s actually been around for over 45 years at this point – so is there a point to even learning it today? You bet there is – because even if you don’t end up using it in your career, it really makes you think differently about how you can solve problems when programming, and that’s always a good thing. That’s not to say that you won’t use it in your career, however; Prolog is heavily used in the [natural language processing](https://en.wikipedia.org/wiki/Natural_language_processing) field, and here’s a fun fact: a large portion of IBM’s [Watson](https://en.wikipedia.org/wiki/Watson_(computer)) is written in Prolog.

This post is the first part of a three-part series over Prolog, and today we’ll dig into how Prolog actually works and just barely get our feet wet with some code over its core concepts. In the next couple of posts, we’ll dive deeper into Prolog and show off how its declarative architecture can help you solve problems that imperative languages would really struggle with.

Declarative vs Imperative Programming
-------------------------------------

Before we talk more about Prolog, we need to go over what makes it so different. Most programming languages are imperative, and that means that you interact with them by giving a compiler or interpreter an exact set of instructions to execute – and that’s your code. Your program will only do exactly what you code it to do; if you’re like me, this probably sounds completely normal, right? Could things be any other way? If you don’t code exactly what you want to happen – then what else would your program do? This is where declarative programming differs from imperative programming. With declarative languages, you just describe _what_ you want your code to do, and not _how_ to do it. Declarative programming is all about building a control flow that involves data and relationships, and then letting the language’s implementation take over from there.

This probably sounds ridiculous if it’s your first time hearing about this paradigm – but there’s actually a good chance you’ve already experienced it before. Ever heard of [SQL](https://en.wikipedia.org/wiki/SQL)? That’s a prime example of a declarative language – and easily the most common one in use today. Think about it. When you issue a SQL command, you don’t tell the server _how_ it should query/create/delete data; you just tell it _what_ to do, and it does it. You don’t manually build a loop to modify multiple records, or explicitly code out how to filter columns. SQL just does it – and it wouldn’t be nearly as powerful if it didn’t function this way.

Prolog behaves similar to SQL. You build what’s called a **knowledge base** using **facts** and **rules**, and then you **query** that knowledge base. In fact, those are the three different concepts that make up everything you can do in Prolog: facts, rules, and queries. Sounds simple, right? Honestly, it really is – and I’m excited to show you how powerful this language can be.

Let’s get started!

Our First Script
----------------

Let’s start off with a simple example.


{{< highlight prolog "linenos=table" >}}
# example-1.pl

likes(tim, soccer).
likes(gretchen, soccer).
likes(john, basketball).
 
friend(X, Y) :- likes(X, Z), likes(Y, Z).
{{< / highlight >}}

Those first 3 lines are **facts**, and through them we’re just defining some simple data points. The word _like_ in the fact is called a **predicate**, and it can be anything we want it to be since we’re defining it (instead of querying it). The arguments are still called arguments, just like we’re familiar with, and since there are 2 arguments, this predicate has an [arity](https://en.wikipedia.org/wiki/Arity) of 2.

That last line in this script is a **rule**, and rules allow you to add in logic such as querying facts and other rules. A rule is denoted by the syntax ” **:-** ” that you see above (which translates to “is true if”), and everything that comes after that operand is called a **subgoal**. The subgoals are separated by commas, and each of them must return true for the entire rule to return true. If this is confusing, it may help to see how we would read the entire **friend** rule in English:

{{< highlight json "linenos=table" >}}
"Two people (X & Y) are friends if person X likes something (Z)
and person Y likes that same something (Z)"
{{< / highlight >}}

This sounds cool, right? We don’t have to specify what the two people like in common – Prolog will figure that out for us. Additionally, if they don’t have anything in common, then Prolog will figure that out too. Let’s run this script and issue some queries.

### Note

One thing needs to be said here. While both facts and rules may look similar to functions in other languages – they’re very different. Prolog doesn’t even have functions – it just has facts and rules that handle all the logic. Unlike functions, facts and rules can only respond with **true** or **false**.

Running Our Script
------------------

There are plenty of implementations of Prolog out there, but the most feature-rich implementation is [SWI-prolog](http://www.swi-prolog.org/). That’s what we’ll use to run our scripts.

{{< highlight prolog "linenos=table" >}}
swipl example-1.pl
 
?- likes(tim, soccer).
true.
 
?- likes(john, soccer).
false.
 
?- friend(tim, gretchen).
true.
 
?- friend(tim, john).
false.
{{< / highlight >}}

First, we query two of our facts. No surprise there, the first query returns true because Tim likes soccer, and the second one returns false because John doesn’t. The next two lines are where we query our friend rule, and we see that Tim and Gretchen are friends because they have some similar like – but not Tim and John. It might not seem like much is happening here – but think about it. We never had to tell Prolog what to look for when finding matching values among our facts – it just did it! There’s no way we could do this in an imperative language without explicitly telling our program to manually loop over a set of certain set of criteria. It seems like magic, and if you’re not impressed yet – then don’t worry, we have a lot more to discuss in this series.

A Slightly Deeper Example
-------------------------

Let’s take the concepts we’ve already discussed and take them to the next level. Check out **example-2.pl** below:

{{< highlight prolog "linenos=table" >}}
# example-2.pl

food_type(velveeta, cheese).
food_type(kraft, cheese).
food_type(taco_bell, tacos).
food_type(ice_cream, dessert).
food_type(twinkie, dessert).
 
flavor(sweet, dessert).
flavor(savory, tacos).
flavor(savory, cheese).
 
food_flavor(X, Y) :- food_type(X, Z), flavor(Y, Z).
{{< / highlight >}}

A lot of this should look familiar – the only real difference is that we now have two different fact predicates, and our rule looks a little different. The **food\_flavor** rule combines two facts, and works as follows:

{{< highlight json "linenos=table" >}}
"A given food brand (X) has a certain flavor(Y) if that food brand (X) has
a food type (Z) and a flavor (Y) also has that same food type (Z)"
{{< / highlight >}}

And we can query it like this:

{{< highlight prolog "linenos=table" >}}
?- food_flavor(velveeta, savory).
true.
 
?- food_flavor(taco_bell, sweet).
false.
{{< / highlight >}}

We defined that _velveeta_ has a food type of _cheese_, and in a later fact we stated that _cheese_ has a flavor of _savory_ – so the first query returns true because all of the subgoals were met. Meanwhile, _taco\_bell_ doesn’t match up with the flavor of _savory_, and we see how that returns false. If you didn’t before, you can probably start to see the power of how prolog handles data – but I mentioned that we were gonna take this a step further, so let’s learn about variables.

### Variables

In prolog, all lowercase arguments are called [atoms](https://en.wikipedia.org/wiki/Symbol_(programming)) – or just constants; uppercase arguments, on the other hand, are variables. Whenever you use variables, Prolog attempts to match them all with a value (and it’s entirely possible that a variable could match to multiple values), and it does this through a concept called **unification** (we’ll get to that more in the next post in this series). We’ve been using variables and unification all along in our rules; for example, when we queried the **food\_flavor** rule and passed in the atoms _taco\_bell_ and _sweet_, Prolog unified them to the variables X and Y. It then proceeded to unify the Z variable to some other value to determine if the rule succeeded or not; we just never saw that because we never asked for Z!

We can query for variables too though, and that’s what I want to show here. Let’s say that we want to query our **flavor** facts to find all food types that are savory:

{{< highlight prolog "linenos=table" >}}
?- flavor(savory, What).
What = tacos ;
What = cheese.
{{< / highlight >}}

Prolog unified the variable **What** to two possible values: _tacos_ and _cheese_. We can take this a step further and pass a variable in to our rule. Let’s see what happens when we query for all food brands that are sweet:

{{< highlight prolog "linenos=table" >}}
?- food_flavor(What, sweet).
What = ice_cream ;
What = twinkie.
{{< / highlight >}}

Again – we get two results. You might think it’s weird that we’re passing in a variable that’s just getting unified to another variable in the rule – but Prolog doesn’t care and ends up handling it beautifully. We could even pass in variables as both arguments to get the cartesian product of all successful matches!

That’s it?
----------

No, that’s certainly not it – but I didn’t want to scare you off too fast. Prolog is different, that’s for sure, but it’s really powerful – and I hope you’re beginning to see that. In the next post, we’ll dive deeper into core Prolog concepts such as recursion, lists, and more into unification – all to prep for the third and final post in this series where we showcase how you can really use Prolog for some cool real-world stuff.

Stay tuned for the next post!

**Note:** You can check out all the examples in this post in my [Prolog Demo](https://github.com/alkrauss48/demos/tree/master/prolog-demo) GitHub repo!

* * *

**References**

Many of the examples here were based on (but modified) from [the book](https://pragprog.com/book/btlang/seven-languages-in-seven-weeks) Seven Languages in Seven Weeks. This book is what gave me the inspiration to write this blog series, and I highly recommend it if you want an overview of not only Prolog, but several other languages as well.

![Seven Languages in Seven Weeks Book Cover](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/declarative-programming-with-prolog-part-1-getting-started/seven-languages-in-seven-weeks.png)
