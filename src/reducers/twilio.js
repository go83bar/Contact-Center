
const initialState = {
    deviceReady: false,
    callbarVisible: false,
    dialpadVisible: false,
    conferenceSID: "",
    conferenceOID: "",
    agentCallSID: "",
    leadCallSID: "",
    leadCallStatus: "Not Connected",
    providerCallSID: "",
    providerCallStatus: "Not Connected",
    recordingPaused: false,
    leadDialButtonEnabled: false,
    leadHoldButtonEnabled: false,
    leadUnHoldButtonEnabled: false,
    leadVoicemailButtonEnabled: false,
    leadDisconnectButtonEnabled: false,
    agentPauseButtonEnabled: false,
    agentResumeButtonEnabled: false,
    agentDisconnectButtonEnabled: false,
    agentKeypadButtonEnabled: false,
    providerDialButtonEnabled: false,
    providerTransferButtonEnabled: false,
    providerDisconnectButtonEnabled: false
}

// Reducer for handling twilio actions
export function twilio(state = initialState, action) {
    let enableAgentDisconnect = true

    switch (action.type) {
        // Device actions
        case 'TWILIO.DEVICE.INIT':
            return Object.assign({}, state, {
                deviceReady: true,
            })
        case 'TWILIO.DEVICE.CONNECTED':
            return Object.assign({}, state, {
                agentCallSID: action.payload.callSID,
                conferenceOID: action.payload.conferenceOID,
                leadDialButtonEnabled: true,
                providerDialButtonEnabled: true,
                agentKeypadButtonEnabled: true,
                agentDisconnectButtonEnabled: true,
                callbarVisible: true,
            })
        case 'TWILIO.DEVICE.DISCONNECTED':
            return { ...initialState, deviceReady: true }

        // Agent actions
        case 'TWILIO.CALLBAR.SHOW':
            return Object.assign({}, state, {
                callbarVisible: true,
                dialpadVisible: false,
            })
        case 'TWILIO.CALLBAR.HIDE':
            return Object.assign({}, state, {
                callbarVisible: false,
                dialpadVisible: false,
            })
        case 'TWILIO.CONFERENCE.STARTED':
            return Object.assign({}, state, {
                conferenceSID: action.conferenceSID,
                agentPauseButtonEnabled: true
            })

        case 'TWILIO.RECORDING.PAUSE':
            return Object.assign({}, state, {
                agentPauseButtonEnabled: false,
                agentResumeButtonEnabled: true,
                leadDisconnectButtonEnabled: false,
                agentDisconnectButtonEnabled: false,
                recordingPaused: true,
            })
        case 'TWILIO.RECORDING.RESUME':
            // definitely do these
            let newState = {
                agentPauseButtonEnabled: true,
                agentResumeButtonEnabled: false,
                agentDisconnectButtonEnabled: true,
                recordingPaused: false,
            }

            // determine if we need to light up the lead disconnect
            if (state.leadCallStatus !== "Not Connected") {
                newState.leadDisconnectButtonEnabled = true
            }
            return Object.assign({}, state, newState)
        case 'TWILIO.DIALPAD.SHOW':
            return Object.assign({}, state, {
                dialpadVisible: true,
            })
        case 'TWILIO.DIALPAD.HIDE':
            return Object.assign({}, state, {
                dialpadVisible: false,
            })
        case 'TWILIO.LEAD.ONHOLD':
            return Object.assign({}, state, {
                leadCallStatus: "On Hold",
                leadDialButtonEnabled: false,
                leadHoldButtonEnabled: false,
                leadUnHoldButtonEnabled: true,
                leadVoicemailButtonEnabled: false,
                leadDisconnectButtonEnabled: false,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.LEAD.OFFHOLD':
            return Object.assign({}, state, {
                leadCallStatus: "Connected",
                leadDialButtonEnabled: false,
                leadHoldButtonEnabled: true,
                leadUnHoldButtonEnabled: false,
                leadVoicemailButtonEnabled: true,
                leadDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: true,
            })

        // Lead connection actions
        case 'TWILIO.LEAD.DIALED':
            return Object.assign({}, state, {
                leadCallSID: action.callSID,
                leadCallStatus: "Connecting..."
            })
        case 'TWILIO.LEAD.RINGING':
            return Object.assign({}, state, {
                leadCallStatus: "Ringing",
                leadDialButtonEnabled: false,
                leadHoldButtonEnabled: false,
                leadUnHoldButtonEnabled: false,
                leadVoicemailButtonEnabled: false,
                leadDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.LEAD.CONNECTED':
            return Object.assign({}, state, {
                leadCallStatus: "Connected",
                leadDialButtonEnabled: false,
                leadDisconnectButtonEnabled: true,
                leadVoicemailButtonEnabled: true,
                leadHoldButtonEnabled: true,
                leadUnHoldButtonEnabled: false,
                agentPauseButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.LEAD.DISCONNECTED':
            if (state.providerCallStatus !== "Not Connected") {
                enableAgentDisconnect = false
            }
            return Object.assign({}, state, {
                leadCallSID: "",
                leadCallStatus: "Not Connected",
                leadDialButtonEnabled: true,
                leadDisconnectButtonEnabled: false,
                leadHoldButtonEnabled: false,
                leadUnHoldButtonEnabled: false,
                leadVoicemailButtonEnabled: false,
                agentDisconnectButtonEnabled: enableAgentDisconnect,
                agentPauseButtonEnabled: false,
                agentResumeButtonEnabled: false
            })

        // Provider connection actions
        case 'TWILIO.PROVIDER.DIALED':
            return Object.assign({}, state, {
                providerCallSID: action.callSID,
                providerCallStatus: "Connecting..."
            })
        case 'TWILIO.PROVIDER.RINGING':
            return Object.assign({}, state, {
                providerCallStatus: "Ringing",
                providerDialButtonEnabled: false,
                providerDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.PROVIDER.CONNECTED':
            let transferEnabled = false
            if (state.leadCallStatus === "Connected") {
                transferEnabled = true
            }
            return Object.assign({}, state, {
                providerCallSID: action.callSID,
                providerCallStatus: "Connected",
                providerDialButtonEnabled: false,
                providerDisconnectButtonEnabled: true,
                providerTransferButtonEnabled: transferEnabled,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.PROVIDER.DISCONNECTED':
            if (state.leadCallStatus !== "Not Connected") {
                enableAgentDisconnect = false
            }
            return Object.assign({}, state, {
                providerCallSID: "",
                providerCallStatus: "Not Connected",
                providerDialButtonEnabled: true,
                providerDisconnectButtonEnabled: false,
                providerTransferButtonEnabled: false,
                agentDisconnectButtonEnabled: enableAgentDisconnect
            })
        default:
            return state
    }
}
