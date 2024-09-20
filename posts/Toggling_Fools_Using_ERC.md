# Toggling Fools Using ERC
<!-- %TIMESTAMP=1726775619% -->

To contradict my last post, I recently decided to replicate my Weechat IRC
config in Emacs' ERC.

## Problem

There is a nice Weechat feature that allows you to modify the message color for
messages sent by nicks that match a given regex. ERC can easily do this as well
and the easiest way to do this is by adding some nicks to a list of "pals" and
"fools".

After making fools' messages appear in a dimmed font, the next feature that I
was missing was the ability to show/hide messages from fools at the click of a
button. Basically, I like to collapse all fools' messages so I can catch up on
the real chat and then maybe see what the fools had to say later.

Here's what I came up with after peeking into the erc.el file in the emacs
source since I couldn't find how to do the exact thing online.

## Solution

The trick is all in `'erc-match-toggle-hidden-fools`, which will do exactly what
it says - toggle your hidden fools. A caveat is that I have to add
`'set-buffer-modified-p` instead of hitting RET after triggering
`'erc/toggle-fools` so that the messages are shown/hidden.

Within use-package erc `:preface` :

```elisp
(let ((hidden-fools t))
  (defun erc/toggle-fools ()
    (interactive)
    (setq hidden-fools (not hidden-fools))
    (erc-match-toggle-hidden-fools hidden-fools)
    (message "hidden fools: %s" (if hidden-fools "on" "off"))
    (set-buffer-modified-p t)))
```

Within use-package erc  `:config`:

```elisp
erc-fools '("Marvin2")
erc-fool-highlight-type 'all
```

The hook is necessary for `'erc-match-toggle-hidden-fools` to function properly,
according to the documentation on the function definition.

```elisp
:hook
 ((erc-text-matched . erc-hide-fools))
:bind
 :map erc-mode-map
 ("C-c -" . 'erc/toggle-fools)))
```

## Result
(Marvin2 is shown/hidden)

![Toggle fools](../static/assets/erc_fools.gif)
