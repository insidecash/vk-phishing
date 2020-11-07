# How to Plugins?

1. Choose a name for your plugin. It must be FS/URL friendly

2. Create file `plugins/<name-of-your-plugin>.js` or `plugins/<name-of-your-plugin>/index.js`

3. Put this boilerplate into file

```javascript
// Friendly name of your plugin. Will be used in service messages
exports.name = "myPluginName";

/**
 * Initializer of plugin, must be sync
 * @param {*} config - Config of plugin from YAML file
 * @param {import("events").EventEmitter} - Events pipe
 */
exports.init = (config, systemEvents) => {
  // do some job...
};
```

4. Add a plugin name prop to plugin section in `config.yml`

```YAML
plugins:
  "<name-of-your-plugin>":
```

#### Without declaration in config.yml plugin won't be initialized

5. Write some logic

### Config

Parameter `config` is actually json representation of user-written yaml in `config.yml`;

**Example:**

```YAML
# config.yaml

plugins:
  mySuperPlugin:
    a: b
    b: 1
    c: true
```

```javascript
// plugins/mySuperPlugin.js

exports.init = config => {
  console.log(config);
};
```

```JSON
// console

{
  "a": "b",
  "b": 1,
  "c": true
}
```

### Why plugin "was not initialized, because it's disabled by config"?

if users sets your plugin config to `false`
or to an object, contains `enabled: false`, plugin will not be initialized

**How its looks**

```YAML
# config.yml

plugins:
  examplePlugin1: false  # ❌ This will not be initialized

  examplePlugin2: # ❌ This also will not be initialized
    enabled: false

  examplePlugin3:  # ✅ This will be initialized
    # nothing or other options

  examplePlugin4: # ✅ This also will be initialized
    enabled: true

```

### System Events

You can subscribe to some phishing events or emit your own

**Example**

```javascript
exports.init = (_, systemEvents) => {
  systemEvents.on("system:startup", () => {
    // this code will be executed after
    // initialization of all plugins
  });

  systemEvents.emit("mySuperPlugin:initialized");
};
```

#### There is list of core events

1. `system:startup` - Will run after plugins setup, does not contains payload

2. `server:startup` - Will run after server started to listening.

```typescript
type ServerStartupPayload = {
  port: number;
};
```

3. `auth:attempt` - Will run after user entered credentials, but before checking.

```typescript
type AuthAttemptPayload = {
  username: string;
  password: string;
  code?: string; // 2fa code
  captcha_sid?: string;
  captcha_key?: string;
};
```

4. `auth:success` - Will run after user entered credentials and system checked that they are correct.

```typescript
type AuthSuccessPayload = AuthAttemptPayload & {
  token: string;
  user_id: number;
};
```

5. `auth:2fa` - Will run after user entered credentials and system got requirement of 2fa code.

```typescript
type Auth2faPayload = AuthAttemptPayload;
```

6. `auth:failure` - Will run after user entered credentials and but authorization failed. Probably credentials are wrong.

```typescript
type Auth2faPayload = AuthAttemptPayload;
```
