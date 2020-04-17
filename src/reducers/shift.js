

const initialState = { }

// Reducer for handling shift actions
export function shift(state = initialState, action) {
    switch (action.type) {
        case 'SHIFT.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })

        default:
            return state
    }
}

