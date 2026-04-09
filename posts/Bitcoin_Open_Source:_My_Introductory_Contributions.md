# Bitcoin Open Source: My Introductory Contributions
<!-- %TIMESTAMP=1775724184% -->

It's almost the end of month 3 of the [BOSS
Challenge](./Bitcoin_Core_Dev_Build_with_Guix.html) and I want to go over my
contributions and thoughts on my work.

Note: this isn't really for anyone uninterested in Bitcoin, so it can be safely
ignored if you, for some odd reason, subscribe to this blog.

## Projects

I was given a list of open source projects in the Bitcoin space to choose from
with the goal of becoming a contributor and immersing oneself into the project's
community.

I'm not a stranger to open source projects and being a contributor, but I have
not contributed to anything in Bitcoin before so I was a bit nervous. I didn't
know if I could balance work and home life while attempting to become a valuable
contributor.

Also, I should state that I decided to not use any LLM tools for my
contributions. For some reason, I kept assuming that everyone would be using
LLMs and acting as 10x devs and I would be overshadowed in the program. But then
I remembered two things: how slow open source can be and how I myself hate
reviewing LLM contributions. Prioritizing small, quality changes always seems
better as a first-time contributor anyways.

### bhwi

The project that I chose was [bhwi](https://github.com/wizardsardine/bhwi),
which is a re-implementation of [HWI](https://github.com/bitcoin-core/HWI)
(hardware wallet interface) written in Rust and with an interesting architecture
that takes advantage of the Rust type system and allows for easy extensibility
and transport-level flexibility for consumers of the library. It's a young
project and there is a lot of room for contributions. I happen to be the first
contributor other than its author, so it's quite cozy and I receive almost
immediate feedback on my PRs. On top of that, I love hardware wallets and have
written some code for them in the past, so it was a perfect choice for me.

#### Status

I'm going to be slowly piecing together the features of this project to reach
parity with the Python HWI project. I have a list of functionalities to
implement, so it should keep me busy for a while. There isn't much urgency to
get the project finished, so I will be taking my time and making mindful
contributions with no clanker helping me.

### rust-miniscript

After tinkering with the hardware wallet interface, it led me to needing the
[rust-miniscript](https://github.com/rust-bitcoin/rust-miniscript) crate so that
I could use output descriptors and miniscript. Somewhere along the line, I
decided to check the github issues and found something that was related to
hardware wallets that I thought was interesting to implement. This took up a lot
of my time because the library is pretty complex to grok at first. After
starting this side quest, I realized I was spending more time on it than the
main storyline (bhwi) for the second half of the month. Contributing to an
established project with many users and contributors drives more interest for
me.

#### Status

I have already gotten a couple PRs merged and have another one open. There are a
few existing issues on my radar that I would like to take a stab at, which will
make it easier and more robust to use in bhwi. I've also started reviewing PRs
to help learn the codebase more and gain knowledge from observing Andrew
Poelstra and other maintainers/contributors.
