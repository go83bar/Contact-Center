import TwilioAPI from '../api/twilioAPI'
import store from '../store'
import {
    leadPutOnHold,
    leadRemoveHold,
    callConnected,
    leadDialed,
    providerDialed,
    agentConnected,
    recordingPaused,
    recordingResumed,
    agentDisconnected,
} from './actions'
import ObjectID from 'bson-objectid'
import {toast} from "react-toastify";
import Slack from '../utils/Slack';

const Twilio = require('twilio-client')

class TwilioDeviceSingleton {
    bootstrap(userID, authToken) {
        // kick it off by getting an access token assigned to the user's auth token
        TwilioAPI.getAccessToken(userID, authToken).then( (response) => {
            if (response.access_token !== undefined) {
                // now that we have an access token, set up the twilio Device
                const device = new Twilio.Device()
                device.setup(response.access_token)

                // set some event listeners on the device
                device.on('ready', (twilioDevice) => {
                    console.log("Twilio Device is ready")
                    this.device = twilioDevice

                    store.dispatch({
                        type: "TWILIO.DEVICE.INIT"
                    })
                })

                device.on('connect', (connection) => {
                    this.connection = connection
                    console.log("Twilio Device connected: ", connection)
                })

                device.on('disconnect', (connection) => {
                    this.connection = undefined
                    console.log("Twilio Device disconnected from connection: ", connection)
                })

                device.on('error', (error) => {
                    console.log("Twilio Device error: ", error)
                    toast.error("Twilio connection error! Please notify dev")
                    Slack.sendMessage("Agent " + userID + " got a Twilio device connection error: " + JSON.stringify(error))
                })

                this.device = device
            } else {
                console.log("Access Token error: ", response)
                // TODO What do we want to do with access token errors?
            }
        }).catch( (err) => {
            console.log("Error fetching token: ", err)
        })
    }

    // opens agent connection to Twilio, which opens callbar in either normal or incoming call mode
    openAgentConnection(incomingCallMode = false) {
        const redux = store.getState()
        const newConferenceOID = ObjectID.generate()
        const client = redux.shift.clients[redux.lead.client_index]

        const input = {
            interaction_id: redux.interaction.id,
            lead_id: redux.lead.id,
            user_id: redux.user.id,
            conference_oid: newConferenceOID,
            should_record: client.record_calls === 1 ? "true" : "false"
        }

        console.log("Start Conference Input: ", input)
        let agentConnection = this.device.connect(input)
        // here is where we could attach event listeners to agent connection
        // i.e. for detecting poor connection quality
        agentConnection.on('accept', (connection) => {
            console.log("New conference OID: ", newConferenceOID)
            store.dispatch(agentConnected(connection.parameters.CallSid, newConferenceOID, incomingCallMode, redux.preview.call_sid))
        })
        agentConnection.on('error', (err) => {
            toast.error("Twilio error has occurred. Disconnected from Twilio.")
            Slack.sendMessage("Agent " + redux.user.id + " got a connection error from Twilio: " + err)
            console.log("Connection error: ", err)
        })

        //this.connection = agentConnection

    }


    // LEAD ACTIONS
    dialLead(dialOption) {
        const redux = store.getState()
        TwilioAPI.dialLead(dialOption).then( response => {
            if (response.call_sid !== undefined && response.call_sid !== "") {
                store.dispatch(leadDialed(response.call_sid))
                console.log("Lead call initiated")
            } else {
                console.log("Twilio Dial Error!")
                toast.error(redux.localization.toast.twilio.dialLeadFailed)
            }
        }).catch( reason => {
            // API call failed
            console.log("TwilioAPI response error: ", reason)
            toast.error(redux.localization.toast.twilio.dialLeadFailed)
            Slack.sendMessage("Agent " + redux.user.id + " got a Dial Lead error for lead " + redux.lead.id + ": " + reason)
        })
    }

    connectIncoming(callSID) {
        const redux = store.getState()
        TwilioAPI.connectIncoming(callSID).then( response => {
            if (response.success) {
                store.dispatch(callConnected(callSID, "LEAD"))
                console.log("Lead incoming call merged")
            } else {
                console.log("Twilio Connect Incoming Error!")
                toast.error(redux.localization.toast.twilio.connectIncomingFailed)
            }
        }).catch( reason => {
            // API rcall failed
            console.log("TwilioAPI response error: ", reason)
            toast.error(redux.localization.toast.twilio.connectIncomingFailed)
            Slack.sendMessage("Agent " + redux.user.id + " got an error answering incoming call for lead " + redux.lead.id + ": " + reason)
        })
    }


    disconnectLead() {
        const redux = store.getState()
        TwilioAPI.disconnectCall(redux.twilio.leadCallSID).then( response => {
            if (response.success === true) {
                console.log("DISCONNECTED THE LEAD")
            }
        })
    }

    playAutoVM() {
        TwilioAPI.playAutoVM().then( response => {
            console.log(response)
            this.disconnect()
        }).catch( reason => {
            const redux = store.getState()
            console.log("Error playing VM: ", reason)
            toast.error(redux.localization.toast.twilio.playAutoVMFailed)
            Slack.sendMessage("Agent " + redux.user.id + " got an error playing AVM for lead " + redux.lead.id + ": " + reason)
        })
    }

    holdLead() {
        TwilioAPI.holdLead().then( response => {
            console.log(response)
            store.dispatch(leadPutOnHold())
        }).catch ( reason => {
            console.log( "Error putting lead on hold: ", reason)
        })
    }

    unholdLead() {
        TwilioAPI.unholdLead().then( response => {
            console.log(response)
            store.dispatch(leadRemoveHold())
        }).catch ( reason => {
            const redux = store.getState()
            console.log( "Error removing lead from hold: ", reason)
            toast.error(redux.localization.toast.twilio.playAutoVMFailed)
        })
    }

    // AGENT ACTIONS
    pauseRecording() {
        TwilioAPI.modifyRecording("paused").then( response => {
            console.log(response)
            store.dispatch(recordingPaused())
        }).catch( reason => {
            const redux = store.getState()
            console.log("Error pausing recording: ", reason)
            toast.error(redux.localization.toast.twilio.pauseRecordingFailed)
        })
    }

    resumeRecording() {
        TwilioAPI.modifyRecording("in-progress").then( response => {
            console.log(response)
            store.dispatch(recordingResumed())
        }).catch( reason => {
            const redux = store.getState()
            console.log("Error resuming recording: ", reason)
            toast.error(redux.localization.toast.twilio.resumeRecordingFailed)
        })
    }

    sendKeypadInput(tone) {
        if (this.connection !== undefined) {
            this.connection.sendDigits(tone)
        } else {
            const redux = store.getState()
            console.log("Could not send keypad tone: no valid connection")
            toast.error(redux.localization.toast.twilio.playTonesFailed)
        }
    }

    // PROVIDER ACTIONS
    dialProvider(officeID, officeNumber) {
        TwilioAPI.dialProvider(officeID, officeNumber).then( response => {
            if (response.call_sid !== undefined && response.call_sid !== "") {
                store.dispatch(providerDialed(response.call_sid))
                console.log("Provider call inititiated")
            } else {
                console.log("Twilio Dial Error:", response)
                //TODO What do we want to do with these errors? Pop a modal?
            }
        }).catch( reason => {
            // API call failed
            console.log("TwilioAPI response error: ", reason)
            //TODO handle this error too
        })
    }

    disconnectProvider() {
        const redux = store.getState()
        TwilioAPI.disconnectCall(redux.twilio.providerCallSID).then( response => {
            if (response.success === true) {
                console.log("DISCONNECTED THE PROVIDER")
            }
        }).catch( reason => {
            // API call failed
            console.log("TwilioAPI response error: ", reason)
            //TODO handle this error too
        })
    }

    transferHandoff() {
        TwilioAPI.transferHandoff().then( response => {
            if (response.success === true) {
                console.log("PERFORMED HANDOFF")
                this.disconnect()
            }
        }).catch( reason => {
            // API call failed
            console.log("TwilioAPI response error: ", reason)
            //TODO handle this error too
        })

    }

    disconnect() {
        this.device.disconnectAll()

        store.dispatch(agentDisconnected())
    }

    checkActiveConnection() {
        console.log("Checking connection: ", this.connection)
        if (this.connection === undefined) {
            return false
        }

        return true
    }

    cleanup = () => {
        if (this.device !== undefined) {
            this.device.destroy()
            delete this.device
        }
    }

}

export let TwilioDevice  = new TwilioDeviceSingleton()
