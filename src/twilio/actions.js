export function setCallbarVisibility(visible) {
    if (visible) {
        return { type: "TWILIO.CALLBAR.SHOW" }
    }
    return {
        type: "TWILIO.CALLBAR.HIDE"
    }
}

export function conferenceStarted(conferenceSID) {
    return {
        type: "TWILIO.CONFERENCE.STARTED",
        conferenceSID: conferenceSID
    }
}

export function leadDialed(callSID) {
    return {
        type: "TWILIO.LEAD.DIALED",
        callSID: callSID
    }
}

export function providerDialed(callSID) {
    return {
        type: "TWILIO.PROVIDER.DIALED",
        callSID: callSID
    }
}

export function callRinging(party) {
    return {
        type: `TWILIO.${party}.RINGING`
    }
}

export function callConnected(callSID, party) {
    return {
        type: `TWILIO.${party}.CONNECTED`,
        callSID: callSID
    }
}

export function callDisconnected(party) {
    return {
        type: `TWILIO.${party}.DISCONNECTED`
    }
}

export function leadPutOnHold() {
    return {
        type: "TWILIO.LEAD.ONHOLD"
    }
}

export function leadRemoveHold() {
    return {
        type: "TWILIO.LEAD.OFFHOLD"
    }
}

export function agentConnected(agentCallSID, conferenceOID, incomingCallMode, incomingCallSID) {
    return {
        type: "TWILIO.DEVICE.CONNECTED",
        payload: {
            agentCallSID,
            conferenceOID,
            incomingCallMode,
            incomingCallSID
        }
    }
}

export function agentDisconnected() {
    return {
        type: "TWILIO.DEVICE.DISCONNECTED"
    }
}

export function recordingPaused() {
    return {
        type: "TWILIO.RECORDING.PAUSE"
    }
}

export function recordingResumed() {
    return {
        type: "TWILIO.RECORDING.RESUME"
    }
}

