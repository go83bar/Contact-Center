const initialState = {}

// Reducer for handling auth actions
export function interaction (state = initialState, action) {
    switch (action.type) {
        case 'INTERACTION.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })
        case "INTERACTION.END":
            return {}
        default:
            return state
    }
}
