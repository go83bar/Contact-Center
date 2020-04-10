

const initialState = { }

// Reducer for handling localization actions
export function localization(state = initialState, action) {
    if (action.type === 'LOCALIZE') {
            return Object.assign({}, state, {
                ...action.payload
            })
    }
    return state
}

