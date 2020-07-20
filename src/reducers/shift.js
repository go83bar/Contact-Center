

const initialState = {
    loaded: false,
    clients: [],
    phases: [],
    outcomes: [],
    outcome_reasons: []
 }

// Reducer for handling shift actions
export function shift(state = initialState, action) {
    switch (action.type) {
        case 'SHIFT.LOAD':
            return Object.assign({}, state, {
                loaded: true,
                ...action.payload
            })

        case 'LOG_OUT_USER':
            return initialState

        default:
            return state
    }
}

