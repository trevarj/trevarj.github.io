# Distro-Hopping from Arch to Gentoo
<!-- %TIMESTAMP=1712748767% -->

This past weekend (starting on a Thursday) I decided to scrap my Arch install
and install [Gentoo](https://wiki.gentoo.org/wiki/Handbook:AMD64). I suppose you
could say I fell for [the old 4chan
meme](https://knowyourmeme.com/memes/install-gentoo).

## Distro-hopping History
| Year      |     |     |
| ---       | --- | ---
|~2005      | Ubuntu | Installed on old laptop from a disc I got in a PC Magazine. Smashed the wifi card into the motherboard and that was the end of that install
|2010       | Ubuntu | On Macbook. This is how I learned to program in a Linux environment
|2012       | Crunchbang | Deleted Windows for a bit to learn Linux better
|2013       | Arch | Started "ricing" on the Macbook
|2019       | Manjaro | KDE + Linux Gaming (daily driving Linux)
|2020       | PopOS | Searching for better desktop/Nvidia experience
|2021-2024  | Arch/Artix   | Using Ubuntu full-time at work
|Apr 2024   | Gentoo |

Arch has probably been the best distro I've experienced. I don't really need to
explain all its benefits since they have all been answered elsewhere online. For
me it was a great balance between customization, productivity and minimalism.

## Why not $DISTRO_NAME?

Thanks to the [System Crafter's IRC](https://systemcrafters.net) channel, when
everyone was discussing distros to try or ones that they use, I began
contemplating (again) what my perfect distro would be.

The answer that I always land on is not Gentoo -- it's a BSD. After some time
experimenting with FreeBSD, I really enjoyed the ecosystem and documentation
that they had. It does come with a few quirks that I can't come to terms with,
like having to use Linux emulation for some programs. It always seems possible
to use it full-time but then a program sneaks up on you that only works under
Linux. Perhaps once my Nvidia hardware dies then I will try out FreeBSD or
OpenBSD again.

So, for GNU/Linux distributions, it came down to Artix vs Void vs Gentoo.
Switching to Artix, something I've done before, would be trivial.

I spent a day looking into Void and experimenting in a VM, but I didn't really
find it to be any better than Arch/Artix or have something beneficial that it
could sell me. Unless the system has something drastically different to
offer, like Nix/Guix (and I don't need extreme reproducibility), then it just seems
not worth the time investment.

## Gentoo Linux

Gentoo seems to tick a lot of boxes for me:
- [x] Control
- [x] Customizability
- [x] Ability to be minimalist (sometimes forced, if you don't want to compile!)
- [x] Large, knowledgeable community to learn from (forum, IRC)
- [x] Great documentation (handbook, wiki)

At first, I was intimidated and irritated at the complexity, but the more I read
the more I was convinced this is a great distro. Things started to make sense
and I was actually learning and re-learning more about a GNU/Linux system under
the hood.

It only took me a couple days (without full attention) to get up and running
back to where I was with Arch. I utilized a few binary packages for large,
compile intensive programs, like Firefox and a kernel.

Compiling everything might deter a lot of people, but for me it is a way to be
conscious of what I am installing and how to maintain a system that isn't full
of random packages. If I see that the dependency list of a package is much too
large, I'll reconsider using that package and look for an alternative. It was
annoying when I wanted to install `shellcheck` and saw how many Haskell
dependencies it uses. I ended up installing the binary for it, which I was
thankful existed.

I still need some time to adjust to the utilities for maintaining a Gentoo
system, so I can't really speak about much more yet.

## Will I Hop Again?

Like a lot of people, I tend to go through tech phases. Eventually, I may just
get tired of compiling stuff, especially if the time comes when I don't have a
separate PC for work and have to quickly install some tools to be productive.

As I said before, I'd still like to try to work towards daily driving a BSD.
There is also the possibility of looking for an even more hardcore Linux distro
like LFS in order to really learn a system in and out. I could even take a
completely different direction and install Debian and then manually compile
fresh versions of programs that I frequently use.
