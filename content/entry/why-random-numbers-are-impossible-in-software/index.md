---
title: Why Random Numbers are Impossible in Software
date: "2017-05-25"
categories:
- blog
tags:
- Programming Concepts
- Ruby
description: Ever wonder how random numbers work in software?
draft: "false"
summary: Ever wonder how random numbers work in software?
---
The title of this post might seem preposterous to you – I mean, many
programming languages have the capability to generate random numbers, right?
You've got **Math.random()** in JavaScript, **rand** in Ruby, the **random**
package in Python – the list goes on and on. Well, believe it or not, I’m here
to tell you that it’s impossible to generate truly random numbers strictly
using software – and if you’re interested in why that is, then keep following
along.

## The Problem

Just by using software, you can’t generate truly random numbers because all
current software is
<a href="https://en.wikipedia.org/wiki/Determinism" target="_blank">deterministic</a>,
which means that every output in a calculation will be the exact same given the
same input (and providing zero input is still considered an input). By
definition, true randomness is the lack of a pattern or predictability in
events – and this type of behavior just isn’t possible in software. To achieve
"random" behavior in our programs, the absolute best we can do is to simulate
randomness by using
<a href="https://en.wikipedia.org/wiki/Pseudorandom_number_generator" target="_blank">pseudorandom number generators</a>
(from here on out, RNG = random number generator).

Now I keep using the phrase "software" – does that mean we can generate truly
random numbers using something else, like hardware? The true answer is that
regardless of how you do it, it’s difficult to generate *anything* random because
there aren’t many things that are truly random *and* replicable, but the quick
answer is yes – we can get much, much closer by using actual physical devices
to generate random numbers (more on this below).

While software is bad at generating anything truly random – it can still
*simulate* randomness pretty well; let’s dig into how pseudo RNGs work.

## Pseudorandom Number Generators

All software RNGs are pseudorandom. Typically, pseudo RNGs will give off the
*appearance* of rendering random numbers, but without the numbers actually
being random. Your head might cock here for a second as you think, what’s the
difference in appearing to be random versus actually being random? Well,
there’s a big difference: you can make anything appear to be random (x, 3, hi,
! – that was random, wasn’t it?), but if the methodology behind generating
that randomness isn’t truly random (i.e. if those characters were generated
from an algorithm) – then it’s not real.

Pseudo RNGs work by taking a
<a href="https://en.wikipedia.org/wiki/Random_seed" target="_blank">seed</a>
value as an input and providing you with a predetermined output based on that
seed. If you give a pseudo RNG the same seed over and over again, you’ll get
the same number each time (see the example below). Even if you don’t specify an
exact seed – which is normally how you use pseudo RNGs – the language will
automatically generate a seed for you; using a pseudo RNG this way, you’ll get
back a number which seems random – but it isn’t, because it’s based on a
non-random seed. That seed is normally generated based on a changing value of
the machine’s state so that it simulates randomness – such as the current time,
process specs, RAM used, etc. – but none of those values are truly "random"
because they’re based on predefined algorithms. To be completely random, you
can’t do that.

Here’s an example of two objects using the same seed in Ruby’s pseudo RNG,
which, as you can see, generate the same output values:

{{< highlight ruby "linenos=table" >}}
x = Random.new(123)  # 123 is the seed
=> #<Random:0x007fda7307da50>

x.rand
=> 0.6964691855978616

x.rand
=> 0.28613933495037946

x.rand
=> 0.2268514535642031

y = Random.new(123)
=> #<Random:0x007fda7308ec60>

# y is a different object than x, but returns the same sequence of random values as x

y.rand
=> 0.6964691855978616

y.rand
=> 0.28613933495037946

y.rand
=> 0.2268514535642031
{{< / highlight >}}
