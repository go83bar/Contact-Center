

const initialState = {}

// Reducer for handling lead actions
export function lead(state = initialState, action) {
    switch (action.type) {
        case 'LEAD.LOADSAMPLE':
            return Object.assign({}, state, {
                ...action.payload
            })

        default:
            return state
    }
}
