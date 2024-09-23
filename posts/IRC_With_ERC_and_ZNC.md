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
(/mods/global/webadmin/edituser?user=trev) and find the Flags section. Uncheck
"Auto Clear Query Buffer".

Now, when someone mentions you while you're away, once you log in again you will
see these mentions in a nice little buffer.

-------------------------------------------------------------------------------

For some reason people say to also enable the "clearbufferonmsg" module, but it
doesn't seem necessary for me on ERC.