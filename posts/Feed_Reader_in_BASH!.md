# RSS/Atom Feed Reader in BASH!
<!-- %TIMESTAMP=1714162900% -->

I'm on a Bash spree [lately](/posts/my_new_SSG_and_blog.html), or as some might say,
"going absolutely bonkers", "getting down with the sickness", "getting a few
screws knocked loose"...whichever you prefer. I just really had a craving for,
what I call, "the arts and crafts of programming", AKA gluing a bunch of
Unix/CLI tools together until you have something that kind of works. Imagine
sitting in an insane asylum all day and making [art from
macaroni](https://en.wikipedia.org/wiki/Macaroni_art), but you connect the
macaroni (elbows) to each other so it forms a kind of pipe system. Or maybe you
remember [that screensaver](https://www.youtube.com/watch?v=Uzx9ArZ7MUU) from
the 90's with the pipes -- that's basically writing Bash!

## Rationale

None of that makes any sense, but all you need to know is that I really wanted
to read some RSS feeds and couldn't settle on a reader. They either seemed too
complicated or just a pain to learn. I had used some of the suckless ones. I
think [elfeed](https://github.com/skeeto/elfeed) is really nice and used that
one for a while, even though I make fun of emacs all the time and don't even use
it as an editor. I was thinking about it and I was able to break down what I
needed into a few high level steps:

1. Download the feed files (XML)
2. Parse the XML
3. Store the parsed data
4. Display the necessary fields to the user
5. Have some minimal controls, like marking as read and opening in a browser

## Getting to Work

Immediately, I knew I wanted to use [fzf](https://github.com/junegunn/fzf) for
displaying and previewing the feed items, and providing some navigation and
controls. XML is really annoying to me and an unintuitive format for querying
data, in my opinion. This is why I decided quickly that I was going to write a
small tool to parse XML into JSON, using the Rust
[`rss`](https://crates.io/crates/rss). It uses minimal libraries and was [only
34 lines](https://github.com/trevarj/rss2json) to slap together. It was also
really easy to support Atom alongside RSS and just move them into JSON as soon
as possible. This will probably make the reader less accessible because now
people will need to install this unpopular tool I made, which isn't widely
available unless you have Rust installed.

With the feeds in a nice JSON format, I could use the powerful tool
[jq](https://github.com/jqlang/jq) to not only extract what I needed, but to
chunk up the feed into individual files per feed item. This made it easy to just
store everything on the filesystem and avoid having to use a database. Each feed
has it's own folder with read/ and unread/ subfolders containing JSON files per
feed item. Upon startup `jq` will just parse all the .json files and feed the
data to `fzf`.

That's pretty much the interesting part. The rest is just configuration and
glue. It's better just to take a look at this demo:

[![asciicast](https://asciinema.org/a/656386.svg)](https://asciinema.org/a/656386)

## Shortcomings

After adding around 10 feeds with ~200 posts total, the performance is still
decent, but you can tell that it isn't as snappy as other readers. This could
probably be resolved with a sqlite database.

Another thing is the mechanism to load the posts. Right now, on startup the
feeds are asynchronously downloaded and the user has to manual refresh for them
to appear in the list. I'm not sure if there is a way to somehow "push" the
posts in using a pipe or something. I don't think there is a way for them to
maintain their order though, since `fzf` doesn't seem to have a way to keep
things sorted.

[frdr (feed reader)](https://github.com/trevarj/frdr)

