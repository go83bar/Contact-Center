import store from '../store'
import {
    conferenceStarted,
    callRinging,
    callConnected,
    callDisconnected,
    incomingCall,
    interactionIncomingCall,
    dismissIncomingCall,
    callNoAnswer,
    callFailed,
    callBusy,
} from '../twilio/actions'
import {TwilioDevice} from "../twilio/TwilioDevice";

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

        case "no-answer":
            store.dispatch(callNoAnswer(callParty))
            return;

        case "failed":
            store.dispatch(callFailed(callParty))
            return;

        case "busy":
            store.dispatch(callBusy(callParty))
            return;

        case "canceled":
        case "completed":
            store.dispatch(callDisconnected(callParty))
            return

        default:
            console.log(`RECEIVED UNKNOWN CALL STATUS ${eventData.CallStatus} FOR ${callParty} CALL`)
            return
    }

}

export function processIncomingCall(callSID) {
    store.dispatch(incomingCall(callSID))
}

export function processInteractionIncomingCall(data) {
    const redux = store.getState()

    // make sure a lead and interaction is loaded and match incoming data
    if (redux.lead.id === undefined ||
        redux.interaction.id === undefined ||
        redux.lead.id !== data.LeadID ||
        redux.interaction.id !== data.InteractionID) {
        console.log("Got a websocket message for interaction incoming call but it doesn't match current store values")
        return
    }

    // if the agent has an open connection to the lead, terminate it
    if (redux.twilio.leadCallSID !== "") {
        TwilioDevice.disconnectLead().then( response => {
            // then pop up the modal
            store.dispatch(interactionIncomingCall(data.CallSID))
        })
    } else {
        // just pop the modal now
        store.dispatch(interactionIncomingCall(data.CallSID))
    }
}

export function processIncomingCallDismiss(callSID) {
    store.dispatch(dismissIncomingCall(callSID))
}

export function processConferenceStart(conferenceSID) {
    store.dispatch(conferenceStarted(conferenceSID))
}