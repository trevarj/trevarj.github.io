# Learning Guile for Spring Lisp Game Jam 2024
<!-- %TIMESTAMP=1716642572% -->

Today I finished [my entry](https://github.com/trevarj/gdotris) for the [Spring
Lisp Game Jam 2024](https://itch.io/jam/spring-lisp-game-jam-2024/entries). It's
nothing really special, just a conversion of my Tetris clone, dotris, written in
Guile Scheme.

I wanted to use the game jam to learn Guile while being held accountable for
actually doing something. I've been looking at Guile and reading the manual for
a few months, toying with simple scripts, and even taking an attempt at writing
a Guix System config (AND FAILING!). Converting my ncurses game written in C
over to Guile seemed doable in this timeframe.

I started off trying to write everything purely functional, and writing like I
would write Haskell, but that was short lived. After that I just starting doing
more "casual" programming where I just wanted to get the job done and have a
functional game. I would say the code ended up looking more like how I would
write Ocaml. I'm not actually sure if it resembles idiomatic Scheme at all!

After a few days, Guile became comfortable to work with and appears to be really
powerful. I haven't even scratched the surface on the powers of Scheme, but it
seems extremely flexible. Using the REPL was quite useful and more engaging than
writing boring unit tests. I'd like to become more proficient in REPL-driven
development and maybe find some resources on how to be productive with a
REPL. Right now, I can't really see how it would be used in a very large project
or whether it is actually faster than writing some unit tests. Some things were
irritating to me, coming from using a language like Rust daily, like no LSP
(Geiser is OK) and hardcore type system.
