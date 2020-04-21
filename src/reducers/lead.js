

const initialState = {}

// Reducer for handling lead actions
export function lead(state = initialState, action) {
    switch (action.type) {
        case 'LEAD.LOAD':
            return Object.assign({}, state, {
                ...action.payload
            })

        case "LEAD.UPDATE_CONTACT_PREFERENCES":
            console.log(state, action.data)
            const contactPreferences = { ...state.contact_preferences }
            contactPreferences[action.data.field] = action.data.value
            return {
                ...state,
                contact_preferences: contactPreferences
            }
        default:
            return state
    }
}
