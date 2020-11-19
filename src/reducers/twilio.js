const callStatuses = {
    notConnected: "notConnected",
    connecting: "connecting",
    connected: "connected",
    onHold: "onHold",
    incoming: "incoming",
    ringing: "ringing",
    noAnswer: "noAnswer",
    callFailed: "callFailed",
    busy: "busy"
}

const disconnectedStatuses = [
    callStatuses.notConnected,
    callStatuses.noAnswer,
    callStatuses.callFailed
]

const initialState = {
    deviceReady: false,
    autoVoicemailURL: false,
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
    leadDialButtonVisible: false,
    leadHoldButtonVisible: false,
    leadUnHoldButtonVisible: false,
    leadVoicemailButtonVisible: false,
    leadDisconnectButtonVisible: false,
    agentPauseButtonVisible: false,
    agentResumeButtonVisible: false,
    agentDisconnectButtonVisible: false,
    agentKeypadButtonVisible: false,
    providerDialButtonVisible: false,
    providerTransferButtonVisible: false,
    providerDisconnectButtonVisible: false,
}

// Reducer for handling twilio actions
export function twilio(state = initialState, action) {
    let transferEnabled = false

    switch (action.type) {
        // Interaction actions
        case 'LEAD.LOAD':
            return Object.assign({}, state, {
                autoVoicemailURL: action.payload.auto_voicemail
            })

        case 'INTERACTION.END':
            // reset state of callbar items at end of interaction, just in case
            return Object.assign({}, state, {
                ...initialState,
                deviceReady: state.deviceReady
            })

        // Device actions
        case 'TWILIO.DEVICE.INIT':
            return Object.assign({}, state, {
                deviceReady: true,
            })
        case 'TWILIO.DEVICE.CONNECTED':
            let leadDialButtonVisible = true
            let leadConnectIncomingButtonEnabled = false
            let leadCallStatus = callStatuses.notConnected
            let leadCallSID = ""

            if (action.payload.incomingCallMode === true) {
                leadDialButtonVisible = false
                leadConnectIncomingButtonEnabled = true
                leadCallStatus = callStatuses.incoming
                leadCallSID = action.payload.incomingCallSID   
            }

            return Object.assign({}, state, {
                agentCallSID: action.payload.callSID,
                conferenceOID: action.payload.conferenceOID,
                leadDialButtonVisible,
                leadConnectIncomingButtonEnabled,
                leadCallStatus,
                leadCallSID,
                interactionIncomingCallSID: "",
                providerDialButtonVisible: true,
                agentKeypadButtonVisible: true,
                agentDisconnectButtonVisible: true,
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
                agentPauseButtonVisible: true
            })

        case 'TWILIO.RECORDING.PAUSE':
            return Object.assign({}, state, {
                agentPauseButtonVisible: false,
                agentResumeButtonVisible: true,
                leadDisconnectButtonVisible: false,
                agentDisconnectButtonVisible: false,
                recordingPaused: true,
            })
        case 'TWILIO.RECORDING.RESUME':
            // definitely do these
            let newState = {
                agentPauseButtonVisible: true,
                agentResumeButtonVisible: false,
                agentDisconnectButtonVisible: true,
                recordingPaused: false,
            }

            // determine if we need to light up the lead disconnect
            if (state.leadCallStatus !== callStatuses.notConnected) {
                newState.leadDisconnectButtonVisible = true
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
                leadDialButtonVisible: false,
                leadHoldButtonVisible: false,
                leadUnHoldButtonVisible: true,
                leadVoicemailButtonVisible: false,
                leadDisconnectButtonVisible: false,
                agentDisconnectButtonVisible: false,
            })
        case 'TWILIO.LEAD.OFFHOLD':
            // sometimes we're taking them off hold because we dialed a provider
            if (state.providerCallStatus === callStatuses.connected) {
                transferEnabled = true
            }

            return Object.assign({}, state, {
                leadCallStatus: callStatuses.connected,
                leadDialButtonVisible: false,
                leadHoldButtonVisible: true,
                leadUnHoldButtonVisible: false,
                leadVoicemailButtonVisible: true,
                leadDisconnectButtonVisible: true,
                agentDisconnectButtonVisible: true,
                providerTransferButtonVisible: transferEnabled
            })

        // Lead connection actions
        case 'TWILIO.LEAD.DIALED':
            return Object.assign({}, state, {
                leadCallSID: action.callSID,
                leadCallStatus: callStatuses.connecting,
                leadDialButtonVisible: false,
                leadHoldButtonVisible: false,
                leadUnHoldButtonVisible: false,
                leadVoicemailButtonVisible: false,
                leadDisconnectButtonVisible: true,
                agentDisconnectButtonVisible: false,
            })
        case 'TWILIO.LEAD.RINGING':
            return Object.assign({}, state, {
                leadCallStatus: callStatuses.ringing,
                leadDialButtonVisible: false,
                leadHoldButtonVisible: false,
                leadUnHoldButtonVisible: false,
                leadVoicemailButtonVisible: false,
                leadDisconnectButtonVisible: true,
                agentDisconnectButtonVisible: false,
            })
        case 'TWILIO.LEAD.CONNECTED':
            return Object.assign({}, state, {
                interactionIncomingCallSID: "",
                leadCallSID: action.callSID,
                leadCallStatus: callStatuses.connected,
                leadDialButtonVisible: false,
                leadConnectIncomingButtonEnabled: false,
                leadDisconnectButtonVisible: true,
                leadVoicemailButtonVisible: true,
                leadHoldButtonVisible: true,
                leadUnHoldButtonVisible: false,
                agentPauseButtonVisible: true,
                agentDisconnectButtonVisible: false,
            })
        case 'TWILIO.LEAD.DISCONNECTED':
            return Object.assign({}, state, generateLeadDisconnectedState(callStatuses.notConnected, disconnectedStatuses.includes(state.providerCallStatus)))
        case 'TWILIO.LEAD.NOANSWER':
            return Object.assign({}, state, generateLeadDisconnectedState(callStatuses.noAnswer, disconnectedStatuses.includes(state.providerCallStatus)))
        case 'TWILIO.LEAD.BUSY':
            return Object.assign({}, state, generateLeadDisconnectedState(callStatuses.busy, disconnectedStatuses.includes(state.providerCallStatus)))
        case 'TWILIO.LEAD.CALLFAILED':
            return Object.assign({}, state, generateLeadDisconnectedState(callStatuses.callFailed, disconnectedStatuses.includes(state.providerCallStatus)))

        // Provider connection actions
        case 'TWILIO.PROVIDER.DIALED':
            return Object.assign({}, state, {
                providerCallSID: action.callSID,
                providerCallStatus: callStatuses.connecting,
                providerDialButtonVisible: false,
                providerDisconnectButtonVisible: true,
                agentDisconnectButtonVisible: false,
            })
        case 'TWILIO.PROVIDER.RINGING':
            return Object.assign({}, state, {
                providerCallStatus: callStatuses.ringing,
                providerDialButtonVisible: false,
                providerDisconnectButtonVisible: true,
                agentDisconnectButtonVisible: false,
            })
        case 'TWILIO.PROVIDER.CONNECTED':
            // if the lead is connected when the provider connects, show the transfer button
            if (state.leadCallStatus === callStatuses.connected) {
                transferEnabled = true
            }
            return Object.assign({}, state, {
                providerCallSID: action.callSID,
                providerCallStatus: callStatuses.connected,
                providerDialButtonVisible: false,
                providerDisconnectButtonVisible: true,
                providerTransferButtonVisible: transferEnabled,
                agentDisconnectButtonVisible: false,
            })
        case 'TWILIO.PROVIDER.DISCONNECTED':
            return Object.assign({}, state, generateProviderDisconnectedState(callStatuses.notConnected, disconnectedStatuses.includes(state.leadCallStatus)))
        case 'TWILIO.PROVIDER.NOANSWER':
            return Object.assign({}, state, generateProviderDisconnectedState(callStatuses.noAnswer, disconnectedStatuses.includes(state.leadCallStatus)))
        case 'TWILIO.PROVIDER.BUSY':
            return Object.assign({}, state, generateProviderDisconnectedState(callStatuses.busy, disconnectedStatuses.includes(state.leadCallStatus)))
        case 'TWILIO.PROVIDER.CALLFAILED':
            return Object.assign({}, state, generateProviderDisconnectedState(callStatuses.callFailed, disconnectedStatuses.includes(state.leadCallStatus)))

        case 'USER.LOG_OUT':
            return initialState
        default:
            return state
    }
}

const generateLeadDisconnectedState = (newStatus, enableAgentDisconnect) => {
    return {
        leadCallSID: "",
        leadCallStatus: newStatus,
        leadDialButtonVisible: true,
        leadDisconnectButtonVisible: false,
        leadHoldButtonVisible: false,
        leadUnHoldButtonVisible: false,
        leadVoicemailButtonVisible: false,
        agentDisconnectButtonVisible: enableAgentDisconnect,
        agentPauseButtonVisible: false,
        agentResumeButtonVisible: false
    }
}

const generateProviderDisconnectedState = (newStatus, enableAgentDisconnect) => {
    return {
        providerCallSID: "",
        providerCallStatus: newStatus,
        providerDialButtonVisible: true,
        providerDisconnectButtonVisible: false,
        providerTransferButtonVisible: false,
        agentDisconnectButtonVisible: enableAgentDisconnect
    }

}