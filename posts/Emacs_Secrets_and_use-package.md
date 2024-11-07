# Emacs Secrets and use-package
<!-- %TIMESTAMP=1730983194% -->

After following an
[article](https://www.masteringemacs.org/article/keeping-secrets-in-emacs-gnupg-auth-sources)
from the author of [Mastering Emacs](https://www.masteringemacs.org/), I was
quite pleased with source controlling some encrypted secrets that I use in
Emacs regularly, such as my elfeed feeds or IRC password.

In short, it looks like this:

A file, `secrets.el.gpg` that contains:

```elisp

(setq secret-1 "foo"
      my/erc-password "hunter2")

```

From `use-package` declarations in `init.el` I would load this file:

```elisp

(use-package erc
  :config (load-library "/path/to/secrets.el.gpg"))
  
(use-package elfeed
  :config (load-library "/path/to/secrets.el.gpg"))

...
```

Of course, having to copy this line was disgusting me as I iteratively and
obsessively try to improve my Emacs config.

### Failed Attempt

I decided that I would attempt to define a local package and somehow load it as
a "dependency" of other packages.

```elisp
;; didn't work
(use-package my-secrets
  :ensure nil
  :load-path "./secrets.el.gpg")
```

The above didn't work, most likely because it isn't an actual package, even when
I added `(provide 'my-secrets)` to the bottom of the encrypted file.

### Solution

I'm not sure if this is the best solution, but it works and is nicer than having
to call `load-library` in each package's `:config`.

First, I made a simple wrapper package - `.emacs.d/lisp/my-secrets.el` (in my
`load-path`) that just calls that frequently copy-pasted line:

```elisp
(load-library (expand-file-name "secrets.el.gpg" user-emacs-directory))
(provide 'my-secrets)
```

```elisp
(use-package my-secrets
  :ensure nil)
```

After some digging in the `use-package` source, since this it was undocumented,
I found there is a keyword `:load` which seems to do exactly what I want.

Now, in all dependent packages, I can specify:

```elisp
(use-package erc
  :load my-secrets
  :custom (erc-password my/erc-secret)
  ...)

(use-package elfeed
  :load my-secrets
  :custom (elfeed-feeds my/elfeed-feeds)
  ...)
```

A small improvement, but satisfying and feels more idiomatic.

Maybe some elisp wizards know how to improve this even further, or know a better way!
