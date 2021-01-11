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

        // set up connection attempt tracking var
        if (this.connectionAttempt === undefined) {
            this.connectionAttempt = 0
        }

        // connect to websocket API
        const redux = store.getState()
        const websocketURL = redux.config["url-websocket"] + "?user_id=" + userID + "&token=" + authToken
        const ws = new WebSocket(websocketURL)

        // increment connection attempt
        this.connectionAttempt = this.connectionAttempt + 1

        ws.onopen = (evt) => {
            console.log("Websocket connected")

            // set the keepalive to run every 9 minutes
            const timeout = 60000 * 9
            this.timerID = setInterval(this.keepAlive, timeout)

            // display connected message if this is a reconnection
            if (this.connectionAttempt !== 1) {
                toast.success(redux.localization.toast.websocket.reconnectedMessage)
            }

            // set connectionAttempt back to one now that we've connected
            this.connectionAttempt = 1
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

        ws.onerror = (evt) => {
            console.log("Websocket error recorded!")
        }

        ws.onclose = (evt) => {
            console.log("Websocket disconnected")
            const redux = store.getState()
            if (redux.user.id !== 0) { // websocket closing with the user still logged in is a problem we need to handle
                console.log("Websocket closing with code ", evt.code)
                if (!navigator.onLine) { // is the browser offline?
                    toast.error(redux.localization.toast.websocket.offlineError)
                } else if(redux.user.auth.token !== undefined) {
                    // if we're still online and the user is still authenticated, we can attempt to reconnect
                    // we do this after a progressive delay up to 5 times (total 10 seconds)
                    // on the first attempt, display a message to the user
                    console.log("connectionAttempt is ", this.connectionAttempt)
                    if (this.connectionAttempt === 1) {
                      toast.error(redux.localization.toast.websocket.reconnectingError)
                    }
                    if (this.connectionAttempt < 6) {
                        setTimeout(this.bootstrap(redux.user.id, redux.user.auth.token), ((this.connectionAttempt - 1) * 1000))
                    } else {
                        toast.error(redux.localization.toast.websocket.cannotReconnectError)
                    }

                } else {
                    // display error message to user to contact dev
                    toast.error(redux.localization.toast.websocket.cannotReconnectError)
                }
            }
        }


        this.ws = ws
    }

    keepAlive = () => {
        console.log("keeping")
        if (this.ws.readyState === this.ws.OPEN) {
            this.ws.send('{"action": "trees", "data": "keepalive"}');
        } else {
            console.log("websocket is not open")
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
