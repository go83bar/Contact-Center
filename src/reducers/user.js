const initialState = {
    id: 0,
    isAuthenticated: false,
    roles : [],
    auth : {
        userID : undefined,
        token : undefined,
    },
    isExpired: false,
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    label_name: "",
    title: ""
}

// Reducer for handling auth actions
export function user(state = initialState, action) {
    switch (action.type) {
        case 'LOG_IN_USER':
            let user = action.payload.user
            user.auth = action.payload.auth
            return Object.assign({}, state, {
                ...user,
                isAuthenticated: true
            })

        case 'USER.TOKEN_REFRESHED':
            const newAuth = {
                userID: action.data.userID,
                token: action.data.token,
            }

            return Object.assign({}, state, {
                auth: newAuth,
            })


        case "USER.UPDATE_PROFILE":
            const newLabel = action.data.first_name + " " + action.data.last_name.substr(0, 1).toUpperCase()
            return Object.assign({}, state, {
                first_name: action.data.first_name,
                last_name: action.data.last_name,
                phone: action.data.phone,
                email: action.data.email,
                label_name: newLabel
            })


        case 'USER.LOG_OUT':
            return initialState

        default:
            return state
    }
}

