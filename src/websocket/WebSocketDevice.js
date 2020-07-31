import store from '../store'
import {processCallEvent,
    processConferenceStart,
    processIncomingCall,
    processInteractionIncomingCall,
    processIncomingCallDismiss
} from './events'
import {toast} from 'react-toastify'

class WebSocketDevice {

    // bootstrap websocket connection to APIGateway websocket proxy
    bootstrap(userID, authToken) {
        // prevent loop condition on logout
        if (userID === undefined || authToken === undefined) {
            return
        }

        const redux = store.getState()
        const websocketURL = redux.config["url-websocket"] + "?user_id=" + userID + "&token=" + authToken
        const ws = new WebSocket(websocketURL)


        ws.onopen = (evt) => {
            console.log("Websocket connected")
        }

        ws.onmessage = evt => {
            if (evt.data && evt.data.length) {
                console.log("Websocket message received")
                const payload = JSON.parse(evt.data)
                switch (payload.event) {
                    case "callevent":
                        processCallEvent(payload.data)
                        break
                    case "conferencestart":
                        processConferenceStart(payload.data)
                        break
                    case "incoming_call":
                        processIncomingCall(payload.data)
                        break
                    case "interaction_incoming_call":
                        processInteractionIncomingCall(payload.data)
                        break
                    case "incoming_call_dismiss":
                        processIncomingCallDismiss(payload.data)
                        break
                    default:
                        console.log("Unknown websocket event: ", evt)
                }
                console.log(payload)
            }
        }

        ws.onclose = (evt) => {
            console.log("Websocket disconnected")
            if (evt.code !== 1005) {
                console.log("Websocket closing with code ", evt.code)
                if (!navigator.onLine) {
                    toast.error("Your network connection is down. Please reconnect to the internet")
                } else {
                    const redux = store.getState()
                    this.bootstrap(redux.user.id, redux.user.auth.token)
                }
            }
        }


        this.ws = ws
        const timeout = 60000 * 9 // set the keepalive to run every 9 minutes
        this.timerID = setInterval(this.keepAlive, timeout)
    }

    keepAlive = () => {
        console.log("keeping")
        if (this.ws.readyState === this.ws.OPEN) {
            this.ws.send('{"action": "trees", "data": "keepalive"}');
        }
    }

    cancelKeepAlive = () => {
        if (this.timerID) {
            clearInterval(this.timerID);
        }
    }

    disconnect = () => {
        this.cancelKeepAlive()
        this.ws.close()
    }

}

export let websocketDevice = new WebSocketDevice()
