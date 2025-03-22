# Troubleshooting

If you can't solve your trouble in FAQ, you can read this page.

## For local world hoster - Check not working

Movement check is not working?

Some hack client has the ability to disable rewinding, if you are hosting a local world, please do `-set serverAuthWithRewind false` and `/reload` for once. (V6.0.36 or above version)

## Cannot run /scriptevent

Change server.properties file

```properties
op-permission-level=2
```

## Matrix API.js not found

Please go to official download link and **don't download source code** directly from GitHub.
