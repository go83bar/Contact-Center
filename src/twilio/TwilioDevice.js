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
    agentDisconnected, leadBadNumber,
} from './actions'
import ObjectID from 'bson-objectid'
import {toast} from "react-toastify";
import Slack from '../utils/Slack';
import LeadAPI from "../api/leadAPI";
import moment from "moment";

const Twilio = require('twilio-client')

class TwilioDeviceSingleton {
    bootstrap(userID, authToken) {
        const localization = store.getState().localization
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
                    console.log("Twilio Device connected")
                })

                device.on('disconnect', (connection) => {
                    this.connection = undefined
                    console.log("Twilio Device disconnected")
                })

                device.on('error', (error) => {
                    // some errors just require restarting the device
                    const reconnectErrorCodes = [
                        31000, // signaling disconnect
                        31003, // connection interrupted
                        31005, // websocket connection lost
                        31009, // transport unavailable
                        31202, // access token expired
                        31204, // invalid access token
                        31205, // expired JWT
                    ]

                    console.log("Twilio Device error: ", error)

                    if(reconnectErrorCodes.includes(error.code)) {
                        if (this.refreshing !== true) {
                            this.refreshing = true
                            console.log("reconnecting to Twilio...")
                            this.cleanup()
                            this.bootstrap(userID, authToken)
                        }
                    } else {
                        toast.error(localization.toast.twilio.deviceError)
                        const errorMessage = {
                            code: error.code,
                            message: error.message,
                            twilioError: error.twilioError
                        }
                        Slack.sendMessage("Agent " + userID + " got a Twilio device connection error: " + JSON.stringify(errorMessage))
                    }

                })

                this.device = device
                this.refreshing = false
            } else {
                console.log("Access Token error: ", response)
                toast.error(localization.toast.twilio.connectionEstablishError)
            }
        }).catch( (err) => {
            console.log("Error fetching token: ", err)
            toast.error(localization.toast.twilio.connectionEstablishError)
        })
    }

    // opens agent connection to Twilio, which opens callbar in either normal or incoming call mode
    openAgentConnection(incomingCallMode = false, connectedCallback) {
        const redux = store.getState()
        const newConferenceOID = ObjectID.generate()

        // check for agent connection opening without a valid interaction
        if (redux.interaction.id === undefined) {
            toast.error(redux.localization.toast.twilio.noInteractionError)
            return
        }

        // check for broken Twilio device, this can happen when the agent's internet connection breaks and then comes back
        if (this.device === undefined) {
            toast.error(redux.localization.toast.twilio.noDeviceError)
            return
        }

        const input = {
            interaction_id: redux.interaction.id,
            lead_id: redux.lead.id,
            user_id: redux.user.id,
            conference_oid: newConferenceOID,
            should_record: redux.lead.client.record_calls === 1 ? "true" : "false"
        }

        console.log("Start Conference Input: ", input)
        let agentConnection = this.device.connect(input)
        const incomingCallSID = redux.twilio.interactionIncomingCallSID
        // here is where we could attach event listeners to agent connection
        // i.e. for detecting poor connection quality
        agentConnection.on('accept', (connection) => {
            console.log("New conference OID: ", newConferenceOID)

            // the incoming calls within an interaction have a difference source for the callSID
            let callSID = redux.preview.call_sid
            if (incomingCallSID !== "") {
                callSID = incomingCallSID
                //this.connectIncoming(incomingCallSID, newConferenceOID)
            }

            store.dispatch(agentConnected(connection.parameters.CallSid, newConferenceOID, incomingCallMode, callSID))

            // if there is a connect callback, fire it now
            if (connectedCallback !== undefined) (
                connectedCallback()
            )
        })
        agentConnection.on('error', (err) => {
            toast.error(redux.localization.toast.twilio.agentConnectionError)
            Slack.sendMessage("Agent " + redux.user.id + " got a connection error from Twilio: " + err)
            console.log("Connection error: ", err)
            store.dispatch(agentDisconnected())
        })

        //this.connection = agentConnection

    }


    // LEAD ACTIONS
    dialLead(dialOption) {
        const redux = store.getState()
        return TwilioAPI.dialLead(dialOption).then( response => {
            if (response.call_sid !== undefined && response.call_sid !== "") {
                store.dispatch(leadDialed(response.call_sid))
                console.log("Lead call initiated")
            } else if (response.error_code === 5003) { // Bad phone number error
                this.handleBadNumber(redux, dialOption)
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

    connectIncoming(callSID, conferenceOID) {
        const redux = store.getState()
        return TwilioAPI.connectIncoming(callSID, conferenceOID).then( response => {
            if (response.success) {
                store.dispatch(callConnected(callSID, "LEAD"))
                console.log("Lead incoming call merged")
            } else {
                console.log("Twilio Connect Incoming Error!")
                if (response.code === 5) {
                    toast.error(redux.localization.toast.twilio.incomingHungUp)
                } else {
                    toast.error(redux.localization.toast.twilio.connectIncomingFailed)
                }

                // when this happens we want to make sure we allow the agent to call the lead back
                store.dispatch(agentConnected(redux.twilio.agentCallSID, redux.twilio.conferenceOID, false, ""))
            }
        }).catch( reason => {
            // API call failed
            console.log("TwilioAPI response error: ", reason)
            toast.error(redux.localization.toast.twilio.connectIncomingFailed)
            Slack.sendMessage("Agent " + redux.user.id + " got an error answering incoming call for lead " + redux.lead.id + ": " + reason)

            // when this happens we want to make sure we allow the agent to call the lead back
            store.dispatch(agentConnected(redux.twilio.agentCallSID, redux.twilio.conferenceOID, false, ""))
        })
    }


    disconnectLead() {
        const redux = store.getState()
        return TwilioAPI.disconnectCall(redux.twilio.leadCallSID).then( response => {
            if (response.success === true) {
                console.log("DISCONNECTED THE LEAD")
            }
        })
    }

    playAutoVM() {
        return TwilioAPI.playAutoVM().then( response => {
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
        const redux = store.getState()
        return TwilioAPI.holdLead().then( response => {
            if (response.success) {
                store.dispatch(leadPutOnHold())
            } else {
                toast.error(redux.localization.toast.twilio.onHoldError)
            }
        }).catch ( reason => {
            console.log( "Error putting lead on hold: ", reason)
            toast.error(redux.localization.toast.twilio.onHoldError)
        })
    }

    unholdLead() {
        const redux = store.getState()
        return TwilioAPI.unholdLead().then( response => {
            if (response.success) {
                store.dispatch(leadRemoveHold())
            } else {
                toast.error(redux.localization.toast.twilio.offHoldError)
            }
        }).catch ( reason => {
            console.log( "Error removing lead from hold: ", reason)
            toast.error(redux.localization.toast.twilio.offHoldError)
        })
    }


    // AGENT ACTIONS
    pauseRecording() {
        return TwilioAPI.modifyRecording("paused").then( response => {
            console.log(response)
            store.dispatch(recordingPaused())
        }).catch( reason => {
            const redux = store.getState()
            console.log("Error pausing recording: ", reason)
            toast.error(redux.localization.toast.twilio.pauseRecordingFailed)
        })
    }

    resumeRecording() {
        return TwilioAPI.modifyRecording("in-progress").then( response => {
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

    disconnect() {
        this.device.disconnectAll()
        store.dispatch(agentDisconnected())
    }


    // PROVIDER ACTIONS
    dialProvider(officeID, officeNumber) {
        const redux = store.getState()
        return TwilioAPI.dialProvider(officeID, officeNumber).then( response => {
            if (response.call_sid !== undefined && response.call_sid !== "") {
                store.dispatch(providerDialed(response.call_sid))
                console.log("Provider call inititiated")
            } else {
                console.log("Twilio Dial Error:", response)
                toast.error(redux.localization.toast.twilio.providerDialFailed)
            }
        }).catch( reason => {
            // API call failed
            console.log("TwilioAPI response error: ", reason)
            toast.error(redux.localization.toast.twilio.providerDialFailed)
        })
    }

    disconnectProvider() {
        const redux = store.getState()
        return TwilioAPI.disconnectCall(redux.twilio.providerCallSID).then( response => {
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
        return TwilioAPI.transferHandoff().then( response => {
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


    // UTILITY
    // provide outside access to singleton connection object
    checkActiveConnection() {
        console.log("Checking connection: ", this.connection)
        return this.connection !== undefined
    }


    // handles cleanup after dials to bad numbers
    handleBadNumber(redux, dialOption) {
        console.log("OK so you dialed a number that either doesn't exist or is overseas. You're it!")
        toast.error(redux.localization.toast.twilio.badNumberError)

        const fieldName = dialOption + "_phone"

        const data = {
            lead_id: redux.lead.id,
            interaction_id: redux.interaction.id,
            updates: {
                [fieldName]: "undefined"
            }
        }
        LeadAPI.updateDetails(data)
            .then(response => {
                if (response.success !== true) {
                    console.log("Bad Number could not be removed...")
                } else {
                    const newLogItem = {
                        field: fieldName,
                        old_value: redux.lead.details[fieldName],
                        new_value: null,
                        interaction_id: redux.interaction.id,
                        created_at: moment.utc().format('YYYY-MM-DD hh:mm:ss'),
                        created_by: redux.user.label_name
                    }
                    store.dispatch(leadBadNumber(fieldName, newLogItem))
                }
            })

    }

    // clean up device upon logout
    cleanup = () => {
        if (this.device !== undefined) {
            this.disconnect()
            this.device.destroy()
            delete this.device
        }
    }

}

export let TwilioDevice  = new TwilioDeviceSingleton()
