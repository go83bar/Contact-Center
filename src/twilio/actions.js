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
        type: `TWILIO.${party.toUpperCase()}.RINGING`
    }
}

export function callConnected(callSID, party) {
    return {
        type: `TWILIO.${party.toUpperCase()}.CONNECTED`,
        callSID: callSID
    }
}

export function callNoAnswer(party) {
    return {
        type: `TWILIO.${party.toUpperCase()}.NOANSWER`
    }
}

export function callBusy(party) {
    return {
        type: `TWILIO.${party.toUpperCase()}.BUSY`
    }
}

export function callFailed(party) {
    return {
        type: `TWILIO.${party.toUpperCase()}.CALLFAILED`
    }
}

export function callDisconnected(party) {
    return {
        type: `TWILIO.${party.toUpperCase()}.DISCONNECTED`
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

export function leadBadNumber(fieldName, newLogItem) {
    return {
        type: "LEAD.BAD_NUMBER",
        data: {
            fieldName,
            newLogItem
        }
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

export function interactionIncomingCall(callSID) {
    return {
        type: "TWILIO.INTERACTION_INCOMING_CALL",
        payload: {
            callSID
        }
    }
}

export function incomingCall(callSID) {
    return {
        type: "TWILIO.INCOMING_CALL",
        payload: {
            callSID
        }
    }
}

export function dismissIncomingCall(callSID) {
    return {
        type: "TWILIO.INCOMING_DISMISS",
        payload: {
            callSID
        }
    }
}

export function setProviderExtension(extension) {
    return {
        type: "TWILIO.SET_PROVIDER_EXTENSION",
        payload: {
            extension
        }
    }
}

