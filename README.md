<p align="center">
    <a href="https://github.com/omaha-js/omaha" target="_blank" rel="noopener noreferrer">
        <img width="180" src="https://i.bailey.sh/co96GjPYG6.png" alt="omaha logo">
    </a>
</p>
<br>
<p align="center">
    <a href="https://github.com/omaha-js/omaha-client-js" target="_blank" rel="noopener noreferrer">github</a> &nbsp;/&nbsp;
    <a href="https://www.npmjs.com/package/@omaha/client" target="_blank" rel="noopener noreferrer">npm</a> &nbsp;/&nbsp;
    <a href="https://docs.bailey.sh/omaha/" target="_blank" rel="noopener noreferrer">documentation</a>
</p>

# @omaha/client

This is the official JavaScript client library for [Omaha](https://github.com/omaha-js/omaha). It's fully typed,
supports all standard endpoints and comes with a websocket client for optional event listening. Works in both browsers
and server side applications. ✨

## documentation

### using a token

Provide an access token to start using the client immediately.

```ts
import { Omaha } from '@omaha/client';

const client = new Omaha('https://omaha.example.com', {
    token: 'dG9rZW4.CilV4Ntq5GsATtmtO4ZQM6HZIzN/1i+ffuZ12CoK0Bs'
});
```

### logging into an account

Use the `auth.login()` function to log into the desired account. The client's token will automatically be updated so
you can begin calling other endpoints immediately.

```ts
import { Omaha } from '@omaha/client';

const client = new Omaha('https://omaha.example.com');

await client.auth.login({
    email: 'hello@example.com',
    password: '12345678'
});
```

### searching for releases

Easily get an array of releases that match your parameters.

```ts
await client.releases.search('8d488eb3-70ae-4001-a058-1a6054151e13', {
    constraint: '^2.0.0'
});
```

### creating and publishing releases

First, create a new draft release with the target version. If there's another draft with the same version, it's treated
as an update, so retrying any failed scripts will work.

```ts
await client.releases.create({
    version: '2.0.1',
    description: 'Optional changelog goes here.',
    tags: ['latest']
});
```

Then upload attachments to the new release. The following example uploads an attachment for the `main` asset which is
the default asset for new repositories.

```ts
await client.attachments.upload('8d488eb3-70ae-4001-a058-1a6054151e13', '2.0.1', 'main', {
    type: 'file',
    path: '/path/to/file.zip'
});
```

Once all attachments have been uploaded, you can publish the release.

```ts
await client.releases.publish('8d488eb3-70ae-4001-a058-1a6054151e13', '2.0.1');
```

### realtime

Invoke the `ws.start()` function to begin listening to realtime events. Once started, the client will maintain a
constant connection to the websocket server so long as the client has an active token.

```ts
client.ws.start();
```

Each time a realtime connection is established, a `repositories` event will be transmitted with an array of all
repositories (and their corresponding collaborations) that the current token has access to.

```ts
client.ws.on('repositories', repositories => { ... });
```

There are also standard events for `connect`, `connect_error`, and `disconnect` consistent with the underlying
socket.io client. For a list of all available events, check the
[types within the server code](https://github.com/omaha-js/omaha/blob/2bb094c35094193fd0aeb589d821904a957396c4/packages/omaha-api/src/realtime/realtime.service.ts#L142).

You can stop the realtime client at any time with `client.ws.stop()`.

### errors

#### server-side errors

Endpoints will throw instances of `HttpError` from this package whenever a server-side error occurs. You can catch
specific types of errors using their [class names](https://github.com/omaha-js/client-js/tree/main/src/client/exceptions).
These errors will always contain helpful messages that should be passed directly to the end user.

#### client-side errors

By default, the client will reattempt requests that fail due to a client-side error. This can be configured from the
constructor options. You can also listen to events on the client to see when such errors occur and are recovered from.

After the error exceeds the reattempt limit, it is thrown back up to the caller. These will be plain error or
`DOMException` objects from the native `fetch()` API.

### aborting requests

You can abort all active requests on a client at any time using the `abort()` method. This will cause all requests to
immediately throw an `AbortError` back up to their callers. You can do this multiple times on the same client over its
lifetime.

```ts
client.abort();
```

You may wish to abort a certain subset of requests rather than all active requests, such as when working within
front-end components. In this case, you should first derive the client and use that instance instead.

```ts
const derived = client.derive();
client.auth.login({ ... });
```

In this case, the abort will only affect requests originating from the derived client, although it inherits its options
and token from the parent.

## license

MIT
