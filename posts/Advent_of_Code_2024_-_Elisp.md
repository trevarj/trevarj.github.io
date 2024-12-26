# Advent of Code 2024 - Elisp
<!-- %TIMESTAMP=1735193794% -->

This year I completed [AoC](https://adventofcode.com) using Emacs Lisp. I would
say that this year was a more legitimate completion than last, since I used less
hints and reference solutions. Here is [a
link](https://github.com/trevarj/advent-of-code/tree/master/2024) to my
solutions. Sorry that they are uncommented and probably incomprehensible. Also
[a link](https://github.com/trevarj/emacs.d/blob/master/lisp/aoc.el) to my AoC
helper package which allowed me to read problems, fetch inputs and submit
answers, all within Emacs.

Using Elisp was much more comfortable for me than using Haskell and OCaml (my
previously used languages for AoC). It was a real pleasure to have an instant
feedback loop using Emacs itself as a REPL, instead of Haskell and OCaml's
clunky REPL experience. The REPL is important for these types of problems if you
have a small brain like me and can't use your imagination to render data
manipulation pipelines.

The libraries I used were fantastic;
[dash.el](https://github.com/magnars/dash.el),
[s.el](https://github.com/magnars/s.el) and
[ht.el](https://github.com/Wilfred/ht.el) should be built-in to Elisp. I do
regret not exploring seq.el (built-in) enough, because it does seem to be very
useful since it works generically over any type of sequence (lists, vectors,
etc).

My only issues were that Emacs completely locks up when running a long
computation. A few problems I left running for minutes, and one overnight. Maybe
this is actually charming, since I woke up to a correct answer as if it was
Christmas morning. I also was a little dissatisfied with iteration in some
cases. I spent a lot of time bikeshedding how I would do a simple loop -
`cl-loop`, `named-let`, `dotimes`, `while`, or just a recursive function.

Even though I am still not a Lisp expert, I reached my goal of being able to
whip up a script fairly quickly, and now will use Elisp as my "scratch"
programming language.

I really recommend Emacs users to try AoC in Elisp for the cozy experience and
low barrier for entry - just open up a buffer and start writing then `C-x C-e`.
