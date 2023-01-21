---
title: "Declarative Programming with Prolog – Part 3: Putting it All Together"
date: "2018-08-02"
categories:
- Blog
tags:
- Prolog
draft: "false"
---
**Table of Contents**

*   [Part 1 – Getting Started](/2018/06/declarative-programming-with-prolog-part-1-getting-started/)
*   [Part 2 – Unification, Recursion, and Lists](/2018/07/declarative-programming-with-prolog-part-2-unification-recursion-and-lists/)
*   Part 3 – Putting it All Together

* * *

Welcome back to the final post in this Prolog series! If you haven’t done so already, please check out the first two posts before starting this one – or else it may not make much sense. Today, we’re gonna take what we’ve learned so far and build a real live application to showcase how powerful Prolog can be. We’ll be building a sudoku solver, which will be a Prolog script that accepts an unfinished grid and will solve the rest of it on its own. Here’s the crazy part: did you know you can do this in just _15 lines_ of Prolog? We’ll be showing that minified script later in this post after we go over a simpler way to build our solver, as well as other powerful ways that you can use Prolog. You’ve come this far in the series – let’s finish strong!

What We’re Gonna Build
----------------------

We’re gonna be building a sudoku solver, and just to make sure we’re all on the same page, let’s briefly review how the game of sudoku works. In sudoku, you’re provided an unfinished 9×9 grid that you have to complete, and each cell must be a number between 1 and 9. The catch is that each row, cell, and 3×3 square of the grid must contain the numbers 1 through 9 _and_ they must be **unique** (e.g. you can’t have the number 1 twice in the same row).

For the duration of this post, we’ll be building a script that solves a 4×4 sudoku grid, instead of a 9×9. The concepts will all be the same – but the smaller the grid size, the easier it will be to both explain and to grasp the concepts.

![Unfinished Sudoku Grid](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/declarative-programming-with-prolog-part-3-putting-it-all-together/sudoku-unfinished.png)

The Full Script
---------------

Before we get deep into solving this problem – I want to share the full Prolog script as well as the query we’ll be using:

**Note:** I take zero credit for this code; it comes from the [Pragmatic Bookshelf book](https://pragprog.com/book/btlang/seven-languages-in-seven-weeks): _7 Languages in 7 weeks_ (although it was slightly modified to work with SWI-prolog instead of GNU Prolog).

sudoku.pl

{{< highlight prolog "linenos=table" >}}
# sudoku.pl

:- use_module(library(clpfd)).

sudoku(Puzzle, Solution) :-
        Solution = Puzzle,
        Puzzle = [S11, S12, S13, S14,
                  S21, S22, S23, S24,
                  S31, S32, S33, S34,
                  S41, S42, S43, S44],

        ins(Puzzle, 1..4),

        Row1 = [S11, S12, S13, S14],
        Row2 = [S21, S22, S23, S24],
        Row3 = [S31, S32, S33, S34],
        Row4 = [S41, S42, S43, S44],

        Col1 = [S11, S21, S31, S41],
        Col2 = [S12, S22, S32, S42],
        Col3 = [S13, S23, S33, S43],
        Col4 = [S14, S24, S34, S44],

        Square1 = [S11, S12, S21, S22],
        Square2 = [S13, S14, S23, S24],
        Square3 = [S31, S32, S41, S42],
        Square4 = [S33, S34, S43, S44],

        valid([Row1, Row2, Row3, Row4,
               Col1, Col2, Col3, Col4,
               Square1, Square2, Square3, Square4]).

valid([]).
valid([Head|Tail]) :-
    all_different(Head),
    valid(Tail).
{{< / highlight >}}

And our query:

{{< highlight prolog "linenos=table" >}}
sudoku([_, _, 2, 3,
        _, _, _, _,
        _, _, _, _,
        3, 4, _, _],
        Solution).
{{< / highlight >}}

Our solved sudoku board will get unified to the **Solution** variable, which will print out when we run this query. Even without a deep explanation – if you look at this script for a minute, you can probably grasp most of the concepts; don’t worry though, we’ll still explain everything!

Building Our 4×4 Sudoku Solver
------------------------------

First off, we need to include the **clpfd** module because we’ll be using a couple of pre-defined predicates in our script. I’ll bring attention to these when we use them.

{{< highlight prolog "linenos=table" >}}
:- use_module(library(clpfd)).
{{< / highlight >}}

Next, we start off our **sudoku** rule which accepts a list with a length of 16 (i.e. our unfinished sudoku board), as well as a variable which we’ll unify to our solution:

{{< highlight prolog "linenos=table" >}}
sudoku(Puzzle, Solution) :-
{{< / highlight >}}

We then unify our Solution to our list, and then further unify our list into 16 other variables – one to represent each cell:

{{< highlight prolog "linenos=table" >}}
        Solution = Puzzle,
        Puzzle = [S11, S12, S13, S14,
                  S21, S22, S23, S24,
                  S31, S32, S33, S34,
                  S41, S42, S43, S44],
{{< / highlight >}}

This next line is our first predicate from the clpfd module that we’ll be using: **ins**. This tells our Puzzle variable that we only want to set its entries to values between 1 and 4 – and since our Puzzle variable was unified to the 16 variables representing each cell, this logic caries over to those variables as well.

{{< highlight prolog "linenos=table" >}}
        ins(Puzzle, 1..4),
{{< / highlight >}}

The next 14 lines are just more unifications. We’re creating variables to represent each row, column, and square, and setting them each equal to a list with a length of 4 to represent their cells.

{{< highlight prolog "linenos=table" >}}
        Row1 = [S11, S12, S13, S14],
        Row2 = [S21, S22, S23, S24],
        Row3 = [S31, S32, S33, S34],
        Row4 = [S41, S42, S43, S44],

        Col1 = [S11, S21, S31, S41],
        Col2 = [S12, S22, S32, S42],
        Col3 = [S13, S23, S33, S43],
        Col4 = [S14, S24, S34, S44],

        Square1 = [S11, S12, S21, S22],
        Square2 = [S13, S14, S23, S24],
        Square3 = [S31, S32, S41, S42],
        Square4 = [S33, S34, S43, S44],
{{< / highlight >}}

So far all we’ve done is some simple unification; we haven’t written any actual logic that tells Prolog how the rules of sudoku work. Well, believe it or not, that’s the easiest part! That’ll only take 6 lines to accomplish, and it will complete our script:

{{< highlight prolog "linenos=table" >}}
        valid([Row1, Row2, Row3, Row4,
               Col1, Col2, Col3, Col4,
               Square1, Square2, Square3, Square4]).

valid([]).
valid([Head|Tail]) :-
    all_different(Head),
    valid(Tail).
{{< / highlight >}}

Here in the final subgoal of the **sudoku** rule, we’re querying another predicate (the **valid** predicate) and passing in a list containing each row, column, and square. Now we need to define what the **valid** predicate actually entails – but wait, there’s two of them up there! Yup – that’s because we’ll be using recursion similarly to how we did in the last post.

Here’s a list of the actions that take place when we first call the **valid** predicate:

*   the first **valid** predicate is called – which is a fact. This is our base case.
*   This fact returns false because the list that was passed in has 12 entries (4 rows, 4 columns, and 4 squares), and the fact is trying to unify it to an empty list – which doesn’t work.
*   Next, the **valid** rule is called, which immediately splits the passed-in list into a Head variable which contains the first entry in the list (which is the first row), and a Tail variable which contains the remainder of the list (everything but the first row).
*   The first subgoal of the **valid** rule calls the _all\_different_ predicate, which is the other predicate we’re using from the clpdf module. This predicate simply accepts a list as an argument and checks if each entry in the list is unique. Nothing crazy.
*   Our last subgoal of the **valid** rule is a _tail-optimized_ call back to the **valid** predicate – BUT – we’re passing in the original list minus its first entry.
*   This process repeats – and each time the stack frame changes, **valid** is called with one less length.
*   Eventually, after 12 loops, the first **valid** fact (our base case) will return true because at that point, the list will be empty.
*   This completes the entire query.

After the **valid** query completes, Prolog will have properly unified our _Solution_ variable to either a valid solution, or it will have determined that a solution wasn’t possible. Let’s see what we get when we issue our query:

{{< highlight prolog "linenos=table" >}}
?- sudoku([_, _, 2, 3,
           _, _, _, _,
           _, _, _, _,
           3, 4, _, _],
           Solution).

Solution = [4, 1, 2, 3, 2, 3, 4, 1, 1, 2, 3, 4, 3, 4, 1, 2]
{{< / highlight >}}

We did it! We have a valid solution! And while we only solved a 4×4 grid, these exact same concepts apply if we wanted to solve a 9×9 grid instead.

Why This Is Awesome
-------------------

We just solved a 4×4 Sudoku grid using Prolog – but if you’re not impressed yet, then you’re bound to be asking something like “I can build this in an imperative language in a similar way – why is this impressive?” Well, think about it. If you wanted to build this logic in an imperative language, then you could certainly create a function that accepted a list of a _completed_ sudoku board and use this same logic to verify that the board was indeed a valid solution – but there’s no way that an imperative language could actually _solve the board on its own_ without a lot of extra logic that either you or some other module would provide. See – this is what makes Prolog (and declarative programming) so powerful; _we never told Prolog how to solve the board – we just gave it the rules!_ We just told it that each row, column, and square had to be unique – and that’s it! It figured everything else out on its own!! You just can’t do this type of thing in imperative languages!

This is the power of unification in Prolog – and if you haven’t understood how it’s fundamentally different from assignment in other languages, then I hope this helped to paint that picture. It’s these types of problems that Prolog is meant to help solve.

Now, I mentioned in the intro that there are sudoku solvers written in 15 lines, and while we won’t be getting into the nitty-gritty of how they work, it’s safe to say that they’re based off of the same concepts that we discussed in our little example above. Here’s a demo of a real sudoku solver in Prolog; this solution also solves the full 9×9 puzzles – not the little 4×4 puzzle we solved above:



{{< highlight prolog "linenos=table" >}}
# demos/sudoku-min.pl

:- use_module(library(clpfd)).

sudoku(Rows) :-
        length(Rows, 9), maplist(same_length(Rows), Rows),
        append(Rows, Vs), Vs ins 1..9,
        maplist(all_distinct, Rows),
        transpose(Rows, Columns),
        maplist(all_distinct, Columns),
        Rows = [As,Bs,Cs,Ds,Es,Fs,Gs,Hs,Is],
        blocks(As, Bs, Cs),
        blocks(Ds, Es, Fs),
        blocks(Gs, Hs, Is).

blocks([], [], []).
blocks([N1,N2,N3|Ns1], [N4,N5,N6|Ns2], [N7,N8,N9|Ns3]) :-
        all_distinct([N1,N2,N3,N4,N5,N6,N7,N8,N9]),
        blocks(Ns1, Ns2, Ns3).

% NO LOGIC HERE - this just sets up our unfinished board for our query
problem(1, [[_,_,_,_,_,_,_,_,_],
            [_,_,_,_,_,3,_,8,5],
            [_,_,1,_,2,_,_,_,_],
            [_,_,_,5,_,7,_,_,_],
            [_,_,4,_,_,_,1,_,_],
            [_,9,_,_,_,_,_,_,_],
            [5,_,_,_,_,_,_,7,3],
            [_,_,2,_,1,_,_,_,_],
            [_,_,_,_,4,_,_,_,9]]).
{{< / highlight >}}

And our query:

{{< highlight prolog "linenos=table" >}}
?- problem(1, Solution), sudoku(Solution), maplist(writeln, Solution).

[9,8,7,6,5,4,3,2,1]
[2,4,6,1,7,3,9,8,5]
[3,5,1,9,2,8,7,4,6]
[1,2,8,5,3,7,6,9,4]
[6,3,4,8,9,2,1,5,7]
[7,9,5,4,6,1,8,3,2]
[5,1,9,2,8,6,4,7,3]
[4,7,2,3,1,9,5,6,8]
[8,6,3,7,4,5,2,1,9]
{{< / highlight >}}

Bam – look at that!

Taking Prolog a Step Further
----------------------------

Hopefully you’re impressed with Prolog by now – but maybe you’re wondering how you would interact with Prolog from another program. Surely not via issuing command line queries, right? Well, how about an HTTP Server?


{{< highlight prolog "linenos=table" >}}
# demos/server.pl

:- use_module(library(http/thread_httpd)).

:- use_module(library(http/http_dispatch)).

server(Port) :-
        http_server(http_dispatch, [port(Port)]).

:- http_handler(/, say_hi, []).

say_hi(_Request) :-
        format('Content-type: text/plain~n~n'),
        format('Hello World!~n').
{{< / highlight >}}

Yeah – Prolog can do that too!

{{< highlight prolog "linenos=table" >}}
?- server(9000).
% Started server at http://localhost:9000/
true.
{{< / highlight >}}

![Prolog Server Response - Hello World!](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/declarative-programming-with-prolog-part-3-putting-it-all-together/prolog-server.png)

Amazing, right?!

The Series Conclusion
---------------------

There will always be problems that imperative languages can solve better than declarative ones; after all, there’s a reason why they dominate the programming market. But, that doesn’t mean that declarative languages don’t have their place in the programming world – for as you saw throughout this series, you can do some really cool, powerful things with Prolog.

The big takeaway is this: Using Prolog where it’s not meant to be used would be silly – but by using it in a situation where it can really shine, you’ll really turn some developer heads. And regardless of if you ever do use Prolog for fun or in your career – at the very least, I hope this helped broaden your perspective on different programming paradigms by teaching you a little bit about declarative programming.

Thanks for sticking with me this far! Feel free to check out the whole [GitHub repo](https://github.com/alkrauss48/demos/tree/master/prolog-demo) complete with all of the demos that we coded throughout this series.
