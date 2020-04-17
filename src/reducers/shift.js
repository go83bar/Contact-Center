

const initialState = { }

// Reducer for handling localization actions
export function shift(state = initialState, action) {
    switch (action.type) {
        case 'CLIENT.LOADSAMPLE':
            return Object.assign({}, state, {
                clients: action.payload
            })

        default:
            return state
    }
}

