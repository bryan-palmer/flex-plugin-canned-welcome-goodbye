# flex-plugin-canned-welcome-goodbye
Flex plugin for sending canned messages at the start and end of an agent interaction.

> **Flex Version:** `1.3.3`  
> **Task Channels:** `chat` (includes `SMS`)

### Modified Behavior
The following default behaviors were modified and may impact functionality if competing/conflicting plugins are used:

> **Flex Action:** `WrapupTask` - Replaced  
> **Chat SDK Event:** `channelJoined` - Listener created

### Configuration

In `/src/CannedWelcomeGoodbyePlugin.js`, there are two variables `introMsg` and `exitMsg` with preset messages:
```javascript
let introMsg = `Hi, my name is ${manager.workerClient.attributes.full_name}.`;
   introMsg += ` How can I help you?`;
let exitMsg = `Thanks for contacting us today. We appreciate your business.`;
```

Adjust the values as necessary and run the plugin to see it action!

Note: If you're running the plugin locally, copy `public/appConfig.example.js` to `public/appConfig.js` and set `accountSid` to your Twilio Account SID.


#### What's Happening?
When a task is initially accepted by a Worker, the Customer is already in the chat channel. The worker does not have the ability to send a message until the chat channel has been joined. To accomplish this, the JS Chat SDK event `channelJoined` let's us know the Worker is eligible to send a message, which invokes Flex Action `SendMessage` to send the `introMsg`.

At the end of the Worker interaction, the task moves into a wrapping state which will tear down the current channel. Therefore, the `exitMsg` must be sent before the chat channel becomes inaccessible. To accomplish this, Flex Action `WrapupTask` is replaced to send the message. Only after the message is sent do we allow the original behavior `original(payload)` to execute.

#### Resources
- [Twilio Flex Actions Framework](https://www.twilio.com/docs/flex/actions-framework)
- [Twilio JS Chat SDK v3.2.0](http://media.twiliocdn.com/sdk/js/chat/releases/3.2.0/docs/Client.html)

___

## How to use this Twilio Flex Plugin

Twilio Flex Plugins allow you to customize the apperance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

### Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards install the dependencies by running `npm install`:

```bash
cd flex-plugin-canned-welcome-goodbye

# If you use npm
npm install
```

### Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

### Deploy

Once you are happy with your plugin, you have to bundle it, in order to deply it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex which would provide them globally.