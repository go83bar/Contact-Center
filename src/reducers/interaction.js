const initialState = {}

// Reducer for handling auth actions
export default function (state = initialState, action) {
    switch (action.type) {
        case 'INTERACTION.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })
        default:
            return state
    }
}