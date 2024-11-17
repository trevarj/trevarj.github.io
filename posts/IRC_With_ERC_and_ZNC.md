# Never Miss A Mention With ZNC
<!-- %TIMESTAMP=1727087972% -->

*(note for me cause I will forget this)*

ZNC allows you to have channel "playback" when you reconnect with your client,
but it's easy to lose track of mentions, or not be able to see a mention on an
active channel that surpasses 500 messages (ZNC max buffer) while you're
away. For this you need to enable a ZNC module.

First, navigate to the ZNC user, then the network and scroll down to the module
"[watch](https://wiki.znc.in/Watch)" and enable it. (web admin url:
`/mods/global/webadmin/editnetwork?user=trev&network=libera`).

Go into your IRC client and enter:
```
/msg *watch add * *mentions *%nick%*
```

Every time your nick is mentioned, it will add that message to a buffer called
`*mentions`.

Next, we need this buffer to persist in ZNC. Navigate to your ZNC user
(`/mods/global/webadmin/edituser?user=trev`) and find the Flags sectiobn. Uncheck
"Auto Clear Query Buffer".

Now, when someone mentions you while you're away, once you log in again you will
see these mentions in a nice little buffer.

It's nice to set `SetDetachedClientOnly` for the entry as well, so that the
*mentions buffer only appears when you reattach!

-------------------------------------------------------------------------------

Another caveat is that you must enable the
"[clearbufferonmsg](https://wiki.znc.in/Clearbufferonmsg)" module or else the
query buffers (like a private message) will stay open and load when you
connect. If your client doesn't acquire the znc.in/self-message capability then
all your messages will disappear from the query buffer, making the playback of a
1:1 message pointless.

EDIT:

I found an [issue](https://github.com/sshirokov/ZNC.el/issues/32) on ZNC.el that
provides a solution to the above caveat.

Simply adding this advice to your erc config does the trick:

```elisp
(advice-add #'erc-login 
            :before (lambda ()
                      (erc-server-send "CAP REQ :znc.in/self-message")
                      (erc-server-send "CAP END")))
```

Now query buffers (direct messages) can be restored and your messages will be
present.
