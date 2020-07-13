
import store from "../store"

class Slack {

    static sendMessage(message, notifyChannel, channel) {
        const config = store.getState().config
        notifyChannel = notifyChannel === undefined ? false : notifyChannel
        channel = channel === undefined ? config["slack-channel-default"] : channel
        message = message + " - Version: " + global.appVersion

        fetch(config["url-aws-base"] + "support/slack", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                slack: {
                    notifyChannel : notifyChannel,
                    channel : channel,
                    user: {
                        name: "Activate Notification",
                        emoji: ":phone:"
                    },
                    message : message
                }
            })
        })
    }
}

export default Slack;






