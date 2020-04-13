const initialState = {
}

// Reducer for handling lead actions
export function lead(state = initialState, action) {
    switch (action.type) {
        case 'LEAD.SOMEACTION':
            return {
                ...state
            }
        default:
            return state
    }
}
