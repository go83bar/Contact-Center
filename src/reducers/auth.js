const initialState = {
    hasTakenAction: false,
    showInactiveWarning: false
}

export function auth(state = initialState, action) {
    switch (action.type) {
        // if the action is a user logout, or a token refresh, reset to false
        case "USER.LOG_OUT":
        case "USER.TOKEN_REFRESHED":
        case "LOG_IN_USER":
        case "CONFIGURE":
        case "LOCALIZE":
            return initialState

        case "USER.INACTIVE_WARNING":
            return {
                hasTakenAction: state.hasTakenAction,
                showInactiveWarning: true
            }

        // otherwise this counts as a user action
        default:
            return { ...state, hasTakenAction: true}
    }
}