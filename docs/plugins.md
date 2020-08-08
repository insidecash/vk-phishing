# How to Plugins?

1. Choose a name for your plugin. It must be FS/URL friendly

2. Create file `plugins/<name-of-your-plugin>.js` or `plugins/<name-of-your-plugin>/index.js` 

3. Put this boilerplate into file

```JS
/**
 * Initializer of plugin, must be sync
 * @param {any} config - Config of plugin from YAML file
 * @param {import("events").EventEmitter} - Events pipe
 */
module.exports.init = (config, systemEvents) => {
  // do some job...
}
```

4. Add a plugin name prop to plugin section in `config.yml`

```YAML
plugins: 
  "<name-of-your-plugin>": 
```

#### Without declaration in config.yml plugin won't be initialized


5. Write some logic

### Config

Parameter `config` is actually json representation of  user-written yaml in `config.yml`;

**Example:**

```YAML
# config.yaml

plugins:
  mySuperPlugin: 
    a: b
    b: 1
    c: true
```

```JS
// plugins/mySuperPlugin.js

module.exports.init = (config) => {
  console.log(config);
}
```

```JSON
// console

{
  "a": "b",
  "b": 1,
  "c": true
}
```

### System Events

You can subscribe to some phishing events or emit your own

**Example**
```JS
module.exports.init = (_, systemEvents) => {
  systemEvents.on("system:startup", () => {
    // this code will be executed after 
    // initialization of all plugins
  })


  systemEvents.emit("mySuperPlugin:initialized");
}
```


#### There is list of core events

1. `system:startup` - Will run after plugins setup, does not contains payload

2. `server:startup` - Will run after server started to listening.

```TS
type ServerStartupPayload = {
  port: number
}
```


3. `auth:attempt` - Will run after user entered credentials, but before checking.

```TS
type AuthAttemptPayload = {
  username: string;
  password: string;
  code?: string; // 2fa code
  captcha_sid?: string;
  captcha_key?: string;
}
```

4. `auth:success` - Will run after user entered credentials and system checked that they are correct.

```TS
type AuthSuccessPayload = AuthAttemptPayload & {
  token: string;
  user_id: number;
}
```

5. `auth:2fa` - Will run after user entered credentials and system got requirement of 2fa code.

```TS
type Auth2faPayload = AuthAttemptPayload;
```


6. `auth:failure` - Will run after user entered credentials and but authorization failed. Probably credentials are wrong.

```TS
type Auth2faPayload = AuthAttemptPayload;
```


