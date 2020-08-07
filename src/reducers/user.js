const initialState = {
    id: 0,
    isAuthenticated: false,
    roles : [],
    auth : {
        userID : undefined,
        token : undefined,
        expirationTime: undefined,
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
            if (action.payload.cookies !== undefined)
              action.payload.cookies.set("auth",user.auth)
            return Object.assign({}, state, {
                ...user,
                isAuthenticated: true
            })

        case 'LOG_OUT_USER':
            return initialState
        
        case 'USER.TOKEN_REFRESH':
            const newAuth = {
                userID: state.auth.userID,
                token: state.auth.token,
                expirationTime: action.data
            }

            return Object.assign({}, state, {
                auth: newAuth,
                isExpired: false
            })

        case 'USER.TOKEN_EXPIRED':
            const expiredAuth = { ...state.auth}
            expiredAuth.isExpired = true

            return Object.assign({}, state, {
                auth: expiredAuth
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
        default:
            return state
    }
}

