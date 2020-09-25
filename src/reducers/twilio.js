const callStatuses = {
    notConnected: "notConnected",
    connecting: "connecting",
    connected: "connected",
    onHold: "onHold",
    incoming: "incoming",
    ringing: "ringing",
}

const initialState = {
    deviceReady: false,
    incomingCallQueue: [],
    interactionIncomingCallSID: "",
    callbarVisible: false,
    dialpadVisible: false,
    conferenceSID: "",
    conferenceOID: "",
    agentCallSID: "",
    leadCallSID: "",
    leadCallStatus: callStatuses.notConnected,
    providerCallSID: "",
    providerCallStatus: callStatuses.notConnected,
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
    let transferEnabled = false

    switch (action.type) {
        // Device actions
        case 'TWILIO.DEVICE.INIT':
            return Object.assign({}, state, {
                deviceReady: true,
            })
        case 'TWILIO.DEVICE.CONNECTED':
            let leadDialButtonEnabled = true
            let leadConnectIncomingButtonEnabled = false
            let leadCallStatus = callStatuses.notConnected
            let leadCallSID = ""

            if (action.payload.incomingCallMode === true) {
                leadDialButtonEnabled = false
                leadConnectIncomingButtonEnabled = true
                leadCallStatus = callStatuses.incoming
                leadCallSID = action.payload.incomingCallSID   
            }

            return Object.assign({}, state, {
                agentCallSID: action.payload.callSID,
                conferenceOID: action.payload.conferenceOID,
                leadDialButtonEnabled,
                leadConnectIncomingButtonEnabled,
                leadCallStatus,
                leadCallSID,
                interactionIncomingCallSID: "",
                providerDialButtonEnabled: true,
                agentKeypadButtonEnabled: true,
                agentDisconnectButtonEnabled: true,
                callbarVisible: true,
            })
        case 'TWILIO.DEVICE.DISCONNECTED':
            return { ...initialState, deviceReady: true }

        // Incoming call actions
        case "TWILIO.INCOMING_CALL":
            let incomingCalls = [...state.incomingCallQueue]
            incomingCalls.push(action.payload.callSID)
            return Object.assign({}, state, {
                incomingCallQueue: incomingCalls
            })

        case "TWILIO.INCOMING_CANCEL":
            return Object.assign({}, state, {
                incomingCallQueue: []
            })

        case "TWILIO.INCOMING_DISMISS":
            const filteredCallQueue = state.incomingCallQueue.filter( call => {
                return call !== action.payload.callSID
            })
            let interactionIncomingCallSID = state.interactionIncomingCallSID
            if (interactionIncomingCallSID === action.payload.callSID) {
                interactionIncomingCallSID = ""
            }
            return Object.assign({}, state, {
                incomingCallQueue: filteredCallQueue,
                interactionIncomingCallSID
            })

        case "TWILIO.INTERACTION_INCOMING_CALL":
            return Object.assign({}, state, {
                interactionIncomingCallSID: action.payload.callSID
            })


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
            if (state.leadCallStatus !== callStatuses.notConnected) {
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
                leadCallStatus: callStatuses.onHold,
                leadDialButtonEnabled: false,
                leadHoldButtonEnabled: false,
                leadUnHoldButtonEnabled: true,
                leadVoicemailButtonEnabled: false,
                leadDisconnectButtonEnabled: false,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.LEAD.OFFHOLD':
            // sometimes we're taking them off hold because we dialed a provider
            if (state.providerCallStatus === callStatuses.connected) {
                transferEnabled = true
            }

            return Object.assign({}, state, {
                leadCallStatus: callStatuses.connected,
                leadDialButtonEnabled: false,
                leadHoldButtonEnabled: true,
                leadUnHoldButtonEnabled: false,
                leadVoicemailButtonEnabled: true,
                leadDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: true,
                providerTransferButtonEnabled: transferEnabled
            })

        // Lead connection actions
        case 'TWILIO.LEAD.DIALED':
            return Object.assign({}, state, {
                leadCallSID: action.callSID,
                leadCallStatus: callStatuses.connecting,
                leadDialButtonEnabled: false,
                leadHoldButtonEnabled: false,
                leadUnHoldButtonEnabled: false,
                leadVoicemailButtonEnabled: false,
                leadDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.LEAD.RINGING':
            return Object.assign({}, state, {
                leadCallStatus: callStatuses.ringing,
                leadDialButtonEnabled: false,
                leadHoldButtonEnabled: false,
                leadUnHoldButtonEnabled: false,
                leadVoicemailButtonEnabled: false,
                leadDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.LEAD.CONNECTED':
            return Object.assign({}, state, {
                interactionIncomingCallSID: "",
                leadCallSID: action.callSID,
                leadCallStatus: callStatuses.connected,
                leadDialButtonEnabled: false,
                leadConnectIncomingButtonEnabled: false,
                leadDisconnectButtonEnabled: true,
                leadVoicemailButtonEnabled: true,
                leadHoldButtonEnabled: true,
                leadUnHoldButtonEnabled: false,
                agentPauseButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.LEAD.DISCONNECTED':
            if (state.providerCallStatus !== callStatuses.notConnected) {
                enableAgentDisconnect = false
            }
            return Object.assign({}, state, {
                leadCallSID: "",
                leadCallStatus: callStatuses.notConnected,
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
                providerCallStatus: callStatuses.connecting,
                providerDialButtonEnabled: false,
                providerDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.PROVIDER.RINGING':
            return Object.assign({}, state, {
                providerCallStatus: callStatuses.ringing,
                providerDialButtonEnabled: false,
                providerDisconnectButtonEnabled: true,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.PROVIDER.CONNECTED':
            // if the lead is connected when the provider connects, show the transfer button
            if (state.leadCallStatus === callStatuses.connected) {
                transferEnabled = true
            }
            return Object.assign({}, state, {
                providerCallSID: action.callSID,
                providerCallStatus: callStatuses.connected,
                providerDialButtonEnabled: false,
                providerDisconnectButtonEnabled: true,
                providerTransferButtonEnabled: transferEnabled,
                agentDisconnectButtonEnabled: false,
            })
        case 'TWILIO.PROVIDER.DISCONNECTED':
            if (state.leadCallStatus !== callStatuses.notConnected) {
                enableAgentDisconnect = false
            }
            return Object.assign({}, state, {
                providerCallSID: "",
                providerCallStatus: callStatuses.notConnected,
                providerDialButtonEnabled: true,
                providerDisconnectButtonEnabled: false,
                providerTransferButtonEnabled: false,
                agentDisconnectButtonEnabled: enableAgentDisconnect
            })
        case 'LOG_OUT_USER':
            return initialState
        default:
            return state
    }
}
