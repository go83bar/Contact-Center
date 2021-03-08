const initialState = {
    hasUnsavedNote: false,
    hasResponses: false,
    callReason: undefined,
    callSid: undefined
}

// Reducer for handling auth actions
export function interaction (state = initialState, action) {
    switch (action.type) {
        case 'INTERACTION.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })

        case "INTERACTION.FLAG_UNSAVED_NOTE":
            return { ...state, hasUnsavedNote: true }

        case "LEAD.NOTE_UPDATED":
        case "LEAD.NOTE_SAVED":
        case "INTERACTION.CLEAR_UNSAVED_NOTE":
            return { ...state, hasUnsavedNote: false }

        case "LEAD.RESPONSE_SAVED":
            return { ...state, hasResponses: true}

        case "PREVIEW.LOAD":
            return { ...state, callReason: action.payload.reason, callSid: action.payload.call_sid}

        case "INTERACTION.END":
        case 'USER.LOG_OUT':
            return initialState


        default:
            return state
    }
}
