---
title: "Declarative Programming with Prolog – Part 2: Unification, Recursion, and Lists"
date: "2018-07-05"
categories:
- Blog
tags:
- Prolog
draft: "false"
---
**Table of Contents**

*   [Part 1 – Getting Started](/2018/06/declarative-programming-with-prolog-part-1-getting-started/)
*   Part 2 – Unification, Recursion, and Lists
*   [Part 3 – Putting it All Together](/2018/08/declarative-programming-with-prolog-part-3-putting-it-all-together/)

* * *

Welcome back to this series on Declarative Programming with Prolog! If you haven’t already, make sure you check out the first post about getting started with Prolog, because in this post we’re going to dig deeper into some core concepts – specifically unification, recursion, and lists. Without further ado, let’s get into it.

Unification
-----------

We’ve already briefly mentioned unification and how we used it to set our variables in our rules and queries – but there’s more to it than that. At its core, unification means to make everything equal a valid result. This is different from assignment because we’re not usually telling Prolog exactly what our variables should equal – it’s figuring that out on its own.

Let’s use this example to understand more about unification:

{{< highlight prolog "linenos=table" >}}
# example-3.pl

house(straw).
house(wood).
 
failed_houses(X, Y) :- house(X), house(Y).
 
little_pigs(X, Y, Z) :- X = straw, Y = wood, Z = brick.
{{< / highlight >}}

The first two lines are nothing new – they’re just facts. We can even understand the next rule by now – especially now that you know unification is happening under the hood. When we query **failed\_houses** with two variables, Prolog is unifying those variables to values that fit all of the subgoals – and as you can see, there are multiple combinations of values that satisfy them all:

{{< highlight prolog "linenos=table" >}}
?- failed_houses(House1, House2).
House1 = House2, House2 = straw ;
House1 = straw,
House2 = wood ;
House1 = wood,
House2 = straw ;
House1 = House2, House2 = wood.
{{< / highlight >}}

Let’s take a look at that last rule now: **little\_pigs**. What’s happening here is that we’re unifying the variables that are passed in to predetermined atoms – respectively _straw_, _wood_, and _brick_. This means that the rule will succeed only if we either pass all arguments as variables, or if we pass in arguments as atoms that already match those preset values:

{{< highlight prolog "linenos=table" >}}
?- little_pigs(X, Y, Z).
X = straw,
Y = wood,
Z = brick.
 
?- little_pigs(X, Y, brick).
X = straw,
Y = wood.
{{< / highlight >}}

However, the rule will fail if we try to pass in an atom that doesn’t match what we’re unifying the variables to:

{{< highlight prolog "linenos=table" >}}
?- little_pigs(X, wolf, Z).
false.
{{< / highlight >}}

Unification is a cool concept that’s core to how Prolog does its magic. The concepts below (as well as the last post in this series) will really help to illustrate unification more – keep following along!

Recursion
---------

Just like in many functional languages, Prolog doesn’t support formal looping constructs like _for_ or _while_ loops. This might seem like a limitation at first – but fear not; Prolog handles these needs with some snazzy recursion.

We’ll use this example to illustrate recursion in Prolog:

{{< highlight prolog "linenos=table" >}}
# example-4.pl

boss(john,    sam).
boss(rob,     john).
boss(henry,   rob).
 
higherup(X, Y) :-
    boss(X, Y).
 
higherup(X, Y) :-
    boss(X, Z), higherup(Z, Y).
{{< / highlight >}}

In this example, _henry_ is a boss to _rob_, who is a boss to _john_, who is a boss to _sam_. We’re going to use recursion to illustrate a relationship between these 4 individuals beyond what we can query via the facts. To do this, we’re going to use two rules called **higherup** – each that accepts two arguments. It is completely valid to have facts and rules that have the same predicate and arity in Prolog – and only **one** of them ever needs to return true for the whole query to return true.

The first **higherup** rule is a base case that just checks if the two arguments have a direct _boss_ fact that links them together.

The second **higherup** rule is where the real recursion happens; it accepts two arguments and tries to satisfy two subgoals: one which checks if X is a boss to _someone_, and another that checks if that same _someone_ is a boss to Y. Confused yet? Let’s do an example

{{< highlight prolog "linenos=table" >}}
?- higherup(john, sam).
true
{{< / highlight >}}

This query to the **higherup** rule will check the first rule it finds – which is our base case that checks if the two variables match to one of the _boss_ facts. In this case, they do! The rule returns successfully, which means the whole query is true since only one successful rule or fact per predicate is needed. It never queries that second rule.

That was a pretty boring example – so let’s do another one:

{{< highlight prolog "linenos=table" >}}
?- higherup(henry, sam).
true
{{< / highlight >}}

Here is where the real recursion happens, and I’ll list out a chain of events to explain exactly what’s happening here:

1.  Prolog queries the _higherup_ rule with the atoms _henry_ and _sam_. The order matters.
2.  The **first** _higherup_ rule fails because there’s no direct _boss_ fact for _henry_ and _sam_.
3.  The **second** _higherup_ rule is queried:
    *   The first subgoal unifies X to _henry_, and (we assume) Z to _rob_, since that’s currently the only atom with a common fact to _henry_ in the order the arguments were passed.
    *   The second subgoal queries _higherup_ again – this time passing in _rob_ as the first argument and _sam_ as the second.
4.  The **first** _higherup_ rule fails again because there’s no direct _boss_ fact for _rob_ and _sam_.
5.  The **second** _higherup_ rule is queried:
    *   The first subgoal unifies X to _rob_, and (we assume) Z to _john_, since that’s currently the only atom with a common fact to _rob_ in the order the arguments were passed.
    *   The second subgoal queries _higherup_ again – this time passing in _john_ as the first argument and _sam_ as the second.
6.  The **first** _higherup_ rule **passes** this time, because there IS a direct _boss_ fact for _john_ and _sam_!
7.  The whole query returns true.

Overall, it took three loops over our rules for our query to return successfully. You should be careful with recursion because as with most other languages, you can easily run out of application memory if you loop too many times. That is, unless you _tail-call optimize_ your recursion, like we did in this example.

### Tail-Call Optimization

Prolog (among many other languages) has the power of [tail-call](https://en.wikipedia.org/wiki/Tail_call) optimization during recursion which means that it’s possible to maintain constant memory usage throughout – no matter how many times you loop. You could loop 2 or 200 times – and memory usage would be the same. How is this possible, you might ask? This happens when your recursive action is the very last thing called in your rule (i.e. the tail call). In our example above, the very last subgoal of our very last rule with the **higherup** predicate is where our recursion happens – and every time it gets to this subgoal, Prolog only needs to remember one thing about the current stack frame: Is the query true up until this point? No logic will happen in the current stack frame after the recursive call – so it doesn’t need to store any data about the current stack frame because there’s no point in doing so. Each time Prolog comes across the recursive call, it knows that it can keep going deeper and all it has to remember is that the query is true up until that point. That means that when it finally does satisfy a base case or return false – it doesn’t pop all the way up the stack chain. It just flat out returns true or false right from where the query ended.

All of this goes out the window if you place another subgoal after the recursive call, or if you place another rule/fact with the same predicate and arity after the rule with the recursive action – because in that case, Prolog would need to store the state of the current stack frame so that it could resume logic at that point. For tail-call optimization to work, the recursive action _has_ to be the last possible action in the current stack frame.

Lists
-----

Lastly, we need to review how lists work. In Prolog, lists are containers of variable length, while tuples are containers of fixed length. Lists are indicated by brackets ( **\[\]** ) while tuples are indicated by parentheses ( **()** ).

{{< highlight prolog "linenos=table" >}}
?- (1, 2, 3) = (1, 2, 3).  % tuples
true.
 
?- [1, 2, 3] = [1, 2, 3].  % lists
true.
{{< / highlight >}}

While both certainly have their use-cases, we’ll focus solely on lists in this example because they can do some neat things that tuples can’t.

We can unify values inside of lists (as well as tuples):

{{< highlight prolog "linenos=table" >}}
?-  [2, 2, 3] = [X, X, Z].
X = 2,
Z = 3.
true.
{{< / highlight >}}

You’ll notice that the variables are on the other side of the equals sign. This is probably weird to see – but remember that unification is different than assignment. Prolog uses unification to make sure that everything matches to a valid value – no matter where it is. We can even spread the variables on both sides of the equals sign:

{{< highlight prolog "linenos=table" >}}
?- [1, B, 3] = [A, 2, C].
B = 2,
A = 1,
C = 3.
{{< / highlight >}}

Taking things a step further, we can deconstruct a list by splitting it into a head entry and another list that makes up everything but that first head entry:

{{< highlight prolog "linenos=table" >}}
?- [1, 2, 3, 4] = [Head|Tail].
Head = 1,
Tail = [2, 3, 4].
{{< / highlight >}}

This is something that tuples can’t do – and this becomes a really powerful concept behind what all you can do with lists. You can deconstruct a tail list even further:

{{< highlight prolog "linenos=table" >}}
?- [1, 2, 3, 4] = [A|[B|C]].
A = 1,
B = 2,
C = [3, 4].
{{< / highlight >}}

In fact, if you wanted to get the _n-th_ entry of a list, you would use list deconstruction until you got the entry you wanted. Here’s how we can get the third entry in a 5-length list:

{{< highlight prolog "linenos=table" >}}
?- [a, b, c, d, e] = [_|[_|[C|_]]].
C = c.
{{< / highlight >}}

The underscores are wildcard characters in Prolog, and they will accept any value and just toss it out; they’re practically just placeholders for values. Overall this looks ugly, right? I agree, and if you’re doing things like this, then that’s normally a code smell that you may not be using Prolog in the best way.

That’s all that we’re gonna cover with lists in Prolog; you can certainly get deeper than this – but there’s still really not much to them. We’ll showcase how you can use them in real-world examples in the next post.

Final thoughts
--------------

If I had to place emphasis on understanding one core concept in Prolog (other than basic facts, rules, and queries), it would be unification. No other language has this capability quite like Prolog does – and it’s really, really powerful (and not the easiest thing to understand on the first go through). With the power of unification, we’re able to build complex rules and queries that emphasize recursion, lists, math, and much more. I hope you enjoyed this post; we reviewed a lot – and we’re going to be using every bit of knowledge we gained here in the final post of this series where we’ll build a sudoku-solver with very little logic compared to how an imperative language might approach that problem.

Stay tuned!

**Note:** You can check out all the examples in this post in my [Prolog Demo](https://github.com/alkrauss48/demos/tree/master/prolog-demo) GitHub repo!
