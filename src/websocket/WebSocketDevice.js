import store from '../store'
import { processCallEvent } from './events'

class WebSocketDevice {

    bootstrap(userID, authToken) {
        const redux = store.getState()
        const websocketURL = redux.config["url-websocket"] + "?user_id=" + userID + "&token=" + authToken
        const ws = new WebSocket(websocketURL)
        

        ws.onopen = (evt) => {
            console.log("Websocket connected")
        }

        ws.onmessage = evt => {
            console.log("Websocket message received")
            const payload = JSON.parse(evt.data)
            switch (payload.event) {
                case "callevent":
                    processCallEvent(payload.data)
                break
                default:
                    console.log("Unknown websocket event: ", evt)
            }
            console.log(payload)
        }

        ws.onclose = () => {
            console.log("Websocket disconnected")
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
