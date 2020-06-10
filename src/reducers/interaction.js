const initialState = {
    hasUnsavedNote: false
}

// Reducer for handling auth actions
export function interaction (state = initialState, action) {
    switch (action.type) {
        case 'INTERACTION.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })
        case "INTERACTION.FLAG_UNSAVED_NOTE":
            return Object.assign({}, state, {
                hasUnsavedNote: true
            })
        case "INTERACTION.CLEAR_UNSAVED_NOTE":
            return Object.assign({}, state, {
                hasUnsavedNote: false
            })
        case "INTERACTION.END":
            return {}
        default:
            return state
    }
}
