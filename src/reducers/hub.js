const initialState = {
    currentView: "dashboard"
}

// Reducer for handling auth actions
export function hub (state = initialState, action) {
    switch (action.type) {
        case 'HUB.SET_VIEW':
            return Object.assign({}, state, {
                currentView: action.payload
            })

        case 'INTERACTION.LOAD':
            return Object.assign({}, state, {
                currentView: "interaction"
            })

        case 'PREVIEW.LOAD':
            return Object.assign({}, state, {
                currentView: "preview"
            })

        default:
            return state
    }
}
