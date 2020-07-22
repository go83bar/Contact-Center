import store from '../store'
import { processCallEvent, processConferenceStart } from './events'
import { toast } from 'react-toastify'

class WebSocketDevice {

    bootstrap(userID, authToken) {
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
                        processConferenceStart(payload.conference_sid)
                    break
                    default:
                        console.log("Unknown websocket event: ", evt)
                }
                console.log(payload)
            }
        }

        ws.onclose = (evt) => {
            console.log("Websocket disconnected")
            if (evt.code !== 1000) {
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
        this.ws.close()
    }

}

export let websocketDevice = new WebSocketDevice()
