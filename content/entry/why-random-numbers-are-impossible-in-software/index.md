---
title: Why Random Numbers are Impossible in Software
date: "2017-05-25"
categories:
- Blog
tags:
- Random
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

How Can We Get Truly Random Number Generators?
----------------------------------------------

Despite the limitations of determinism in computer algorithms, getting numbers that represent as close as possible to “truly” random isn’t out of the question.

Imagine flipping a coin or rolling a die - those results are pretty random, right? While building a hardware system to measure these exact actions would be pretty impractical, engineers have gotten creative; one example of a real-life hardware RNG is a system that measures time between [atmospheric noise](https://en.wikipedia.org/wiki/Noise_(radio)) segments on untuned receivers, and uses that as its basis; this is actually how [random.org](https://www.random.org/) works - one of the most popular "true" RNGs available. You can get even deeper when you start using the unpredictability found in the laws of quantum mechanics – such as measuring the radioactive decay of an atom; according to quantum theory, there's no way to know for sure when radioactive decay will occur, so this is essentially "pure randomness" from the universe.

Does It Matter – Pseudorandom vs. True Random?
----------------------------------------------

This is a question that’s completely based on context. If you’re building an application to randomly select who among your coworkers get’s to pick where to go for lunch – then pseudorandom RNGs are perfect. However – if you’re doing anything involving security, such as cryptography or hashing sensitive information, then you absolutely want true randomness to help generate your keys; any number based on a pseudo RNG is 100% solvable by others since there are man-made algorithms involved.

Taking true randomness a step further – it’s not enough to _just_ be random. Imagine if a truly random value was selected from a sample – but more often than not, you end up getting the same result. That type of behavior normally isn’t considered high quality. When we’re talking about using truly random numbers for real use-cases, then you need a high degree of [entropy](https://en.wikipedia.org/wiki/Entropy_(information_theory)) – or the measure of unpredictability in your results. Without high entropy, it’s difficult to trust a source that provides random information; that’s why it’s common for these sources to go through an “entropy harvesting” phase that allows enough unpredictable results to be generated, thus ensuring the source is indeed high quality. While entropy is harvested, these sources are considered “blocking,” because they’re rate-limited until the desired degree of entropy has been reached. Because of this – as well as the physical nature of gathering results – true RNGs will always execute slower than pseudo RNGs.

Final Thoughts
--------------

The concepts behind true random number generation get really deep, and that’s not what I wanted to get into here. I just wanted to give you a brief – but mildly deep – understanding about how RNGs work in software and why they’re not truly random. Now does that mean you should stop using pseudo RNGs? No, absolutely not – they’re practically essential to modern-day applications, even if they’re not truly random. My advice to you is to use pseudo RNGs for all your random number needs until you run into a situation where you genuinely need something truly random – and trust me, you’ll know when that time comes (and when it does come, that probably means you’re working on a pretty neat project).
