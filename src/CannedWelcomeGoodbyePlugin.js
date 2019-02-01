import { FlexPlugin } from 'flex-plugin';

const PLUGIN_NAME = 'CannedWelcomeGoodbyePlugin';

export default class CannedWelcomeGoodbyePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    let introMsg = `Hi, my name is ${manager.workerClient.attributes.full_name}.`;
       introMsg += ` How can I help you?`;
    let exitMsg = `Thanks for contacting us today. We appreciate your business.`;

    // INTRO MESSAGE
    //   After the worker has joined the chat channel, send an intro message
    manager.chatClient.on('channelJoined', (payload) => {
      flex.Actions.invokeAction("SendMessage", {
        body: introMsg,
        channelSid: payload.sid
      });
    });

    // EXIT MESSAGE
    //   Before moving the task to wrap up, send a final message
    flex.Actions.replaceAction("WrapupTask", (payload, original) => {
      // do not alter non-chat tasks
      if( payload.task.taskChannelUniqueName !== "chat" ) {
        original(payload);

      } else {
        return new Promise(function(resolve, reject) {
          // send the message
          flex.Actions.invokeAction("SendMessage", {
            body: exitMsg,
            channelSid: payload.task.attributes.channelSid
          }).then(response => {
            // only after the message is sent, move task to wrap up
            resolve(original(payload));
          });
         });
      }
    })
  }
}
