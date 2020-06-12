import store from '../store'
import {
    conferenceStarted,
    callRinging,
    callConnected,
    callDisconnected
} from '../twilio/actions'

export function processCallEvent(eventData) {
    // validate websocket input
    if (eventData.CallSid === undefined || eventData.CallStatus === undefined) {
        // TODO handle this error
        return
    }

    // determine which leg we're dealing with here
    const redux = store.getState()
    let callParty = "UNKNOWN"

    if (eventData.CallSid === redux.twilio.leadCallSID) {
        callParty = "LEAD"
    } else if (eventData.CallSid === redux.twilio.providerCallSID) {
        callParty = "PROVIDER"
    } else {
        // error we got an event on an unknown call SID
        console.log("RECEIVED WEBSOCKET EVENT FOR UNKNOWN CALL SID: ", eventData.CallSid)
        return
    }

    console.log(eventData.CallSid, callParty, eventData.CallStatus)
    switch (eventData.CallStatus) {
        case "ringing":
            store.dispatch(callRinging(callParty))
            return

        case "in-progress":
            store.dispatch(callConnected(eventData.CallSid, callParty))
            return

        case "canceled":
        case "completed":
            store.dispatch(callDisconnected(callParty))
            return

        default:
            console.log(`RECEIVED UNKNOWN CALL STATUS ${eventData.CallStatus} FOR ${callParty} CALL`)
            return
    }

}

export function processConferenceStart(conferenceSID) {
    store.dispatch(conferenceStarted(conferenceSID))
    return
}