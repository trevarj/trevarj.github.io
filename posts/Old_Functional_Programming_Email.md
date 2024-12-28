# Old Functional Programming Email
<!-- %TIMESTAMP=1735410096% -->

I clicked a dead link to Google Groups recently and landed back at a list of my
old groups which happen to be for university classes that I was in. After
browsing around for a while I found a post titled "Functional Programming" from
a teaching assistant named "R". I recalled the context of this post immediately
and it was basically dumb (actually dumb cause the CS program was not very good)
university kids thinking Javascript was a functional programming language, only
to be corrected ("ackkshully!!..") by a sage Haskeller. 

The post is an excellent explanation of FP to university students who would
never hear of it since the main archetype of the CS program was either a video
game nerd or read online that programming was a top paying career. Sadly, it
only had a single, one sentence reply. I most likely ignored it too, which is
why I am in awe by it -- it mentions a lot of the languages that I currently
love and SICP! If only I wasn't such a bad student. Anyways, here it is:

-----
[2011]

I was asked about functional programming in class today. Its an interesting
topic, and its worth being exposed to, but I could not do it justice in a quick
mention in class. I'm not sure this missive can do it justice either, but it
seemed that some people were interested in it, and it has applications to the
topic we've recently been discussing in class (dynamic programming), and playing
around in them is an interest of mine, so I thought I'd throw this together, and
send it out in case anyone is interested.

What you have to understand at the get go is that there are several models of
computation, but we can prove that they are all equivalent, i.e. that anything
that can be done in one model can be done in another. This is know as the Church
Turing Thesis, named after Alan Turing, the mathematician who "invented" the
computer as we know it (or, at least, a theoretical model of it), and Alanzo
Church, a logician who developed what is called the lambda calculus. I'll spare
you the gory details. Sufficient to say that some algorithms are easier to
implement in one paradigm or another, but any algorithm can be implemented in
any paradigm.

There are three different models of computation that you are probably familiar
with or have heard of(though all of them are equivalent, i.e. what can be
computed in one can be computed in the others). The three you are most likely to
encounter are:

Procedural: Computation as a sequence of machine states.  Object Oriented:
Computation as the interaction of objects.  Functional: Computation as the
application of functions (in the mathematical sense) to data.

Note that the boundaries between these types is very fuzzy. Java can be very
procedural if you just have a single object with a main function.

When we talk about functional programming, we don't mean functions as in
procedures or object methods, we mean functions in the mathematical sense. The
primary difference between function (programming language) and function
(mathematical) is that mathematical functions are not allowed to have side
effects. In a procedural language, calling a function can change the program
state, and calling the function at different times with the same arguments can
have different results, if it depends on the state of global variables. In a
functional language, a function call cannot alter the state of the program, and
calling a function with the same arguments always has the same result.

Another difference between the functional paradigm and others is that functions
are first class objects. This means that functions can be treated the same way
as variables, i.e. anywhere a variable is syntactically correct, a function is
too. I want to stress here that I do not mean a function call, or a function
pointer, I mean the function itself. This can be hard to get your head
around. For example, in lisp, no distinction is made between data and
code. Everything in lisp is a list, including a lisp program itself. So, all the
arguments to functions are actually lists, and functions are just lists (the
first member of the list is the function name, the second item in the list is a
list of the arguments, the remaining members of the list are the statements of
the function), so we can pass a function X to a function Y along with some other
arguments, and Y can then apply the passed function to the other arguments,
returning the result or another function. For a small example, this is the
factorial function in lisp:

```lisp
(defun factorial (n)
   (if (<= n 1)
       1
       (* n (factorial (- n 1))))
)
```

This function declaration is a list, the first member of which is a call to the
function defun, which defines functions. The second item is the name of the new
function, the third is the arguments the new function will take, and the fourth
is a list of statements that make up the new function.

 Having functions as first class objects also allows us to curry the arguments
 of the function. This means that the function as written would be applied to
 the first argument, in the course of which it would create a new function (at
 run time) to be applied to the second argument, which would create a new
 function to be applied to the third argument...

Among functional languages, we make a distinction between languages which are
purely functional, and those that are not. Purely functional languages, such as
Haskell, do not allow you to violate the functional paradigm. This brings with
it certain benefits. For example, if the language is constructed in such a way
that side effects are impossible, then the order of evaluation of a program, to
a certain extent, doesn't matter; the result of two independent function calls
is invariant over the order of the calls. This allows the compiler to re-arrange
the code as it sees fit to optimize it. Another benefit is that the dynamic
programming we were looking at today is, essentially, free; its built into the
language. If you call a function with the same arguments, we don't need to
re-compute the function, because we know that the result will be the same. We
can just return it. Even wielder, from the point of view of imperative
programming, is the possibility for "lazy evaluation." This means that we don't
have to evaluate all values of an expression; we just need to evaluate enough to
return the value we are interested in. Wikipedia offers this as an example:

                    print length([2+1, 3*2, 1/0, 5-4])

All we want is it to print the length of the list in question, i.e. how many
elements it has. In an imperative language, the order of evaluation is rigidly
defined: the value of the expressions in the list would be evaluated and added
to the list, then the length of the list would be computed and returned. At
least, in theory. What would actually happen is that the program would crash
because of the division by 0 in the 3rd element. Haskell, on the other hand,
with lazy evaluation, doesn't bother to evaluate the expressions that make up
the list, it just notes that if you evaluated the list, it would have 4 members,
so it just returns 4.

You might have noticed that I mentioned that data is immutable. This means we
cannot alter the value of a variable in a scope in which it has been
defined. This means that loops are difficult to defined: data is immutable so
cannot have a loop counter with a changing value. Instead, looping is achieved
through recursive calls. Suffice it to say that any loop can be implemented as a
recursive call. This can be proven rigorously, but I'm not going to do so here,
as this is probably already long enough.

If you are interested in learning more, the Wikipedia article on functional
programming is a good start. The Microsoft .NET framework has a functional
language called F# you can look into. [University] Library has a book called
"The Structure and Interpretation of Computer Programs", which is a text book on
Scheme that was used and written at M.I.T. Python and Ruby have functional
aspects, though they are mostly imperative.

Haskell is a modern, open source purely functional language with a large install
base and many tutorials. It has a good explanation of functional programming on
its web page, along with this example of quicksort written in Haskell:

```haskell
qsort []     = []
qsort (x:xs) = qsort (filter (< x) xs) ++ [x] ++ qsort (filter (>= x) xs)
```

I hope you all have found this interesting. There is a lot more to computer
science than just churning out code, and exposing yourself to other programming
paradigms can be enlightening.
