# My New SSG and Blog
<!-- %TIMESTAMP=1713713491% -->

Welcome to my revamped blog that I made with my latest tinker project,
[poogo](https://github.com/trevarj/poogo).

Poogo is a static-site generator written in bash, which utilizes the [Github
markdown API](https://docs.github.com/en/rest/markdown) to convert Markdown into
HTML.

## Hugo -> Poogo

With this I can say goodbye to [Hugo](https://gohugo.io/) (`sudo emerge
--unmerge hugo`) and stop complaining about how I don't want to learn Hugo
themes or figure out how to work it. I will say that Hugo is quite nice and
simple enough, but I don't even need such power for my blog that has zero
readers and is hosted on Github Pages. So, I finally convinced myself to
frantically slap together a single `bash(1)` script that can do everything I
need.

## Requirements

I wanted to create a simple tool for a simple blog. Also, it's pretty fun to
push Unix tools to the limit and scour StackOverflow looking for the coolest
one-liners and tricks.

Here is what I needed:
1. Take Markdown files and convert them to HTML
2. Ability to regenerate on new Markdown changes
3. Generate a RSS feed for all the posts
4. Minimal CSS that works with the generated HTML

Solutions:
1. Github's Markdown API to convert MD->HTML. Instead of using GH Pages built-in
   MD->Jekyll, this allows me to be able to take my site anywhere else.
2. Bash `-ot / -nt` on files
3. Simple substitution stuff and inspiration from
   [`lb`](https://github.com/LukeSmithxyz/lb/blob/master/sup)
4. A quick search for minimal CSS led me to [Simple
   CSS](https://github.com/kevquirk/simple.css), and of course [Nord color
palette](https://nordtheme.com)

## Reflections

I got to the MVP after only tinkering on and off for a few days. Basically using
shell-driven development (not as cool as a REPL, but pretty good!) and hacking
stuff together until it works. I am not super proud of the code itself, but I
didn't set out to write the most beautiful and robust bash SSG (one probably
exists).

It was really relaxing to not have to to care about code cleanliness or whether
or not someone else can read it. Just coding to get something done. Perhaps this
is a side effect of using a language that lets you bend the rules and do wacky
stuff.

There is also something satisfying about solving something using
a Unix Philosophy way instead of just installing some new tool and having to
learn the ecosystem. Spending time learning more `sed(1)` is pretty amazing,
even if it sometimes feels inelegant or the solution is cryptic at first glance.

Here's a weird `sed` line that I learned:

```sh
# extract the "title" of a post for a HTML <title>, a markdown '#' header from a
# file, or fallback to the title found in the <header> markdown file
extract_title() {
	s='/# .*/{s/# (.*)/\1/p;Q};q1' # returns 1 on a non-match
    # now we can fallback if the first match fails
	sed -rn "$s" "$1" || sed -rn "$s" "$HEADER_MD"
}
```

Since `sed` doesn't have a return code of `1` when there is no match, you have
to do a little trick using `/matchRegex/s command/options` instead of the
traditional `s/find/replace/options`.

