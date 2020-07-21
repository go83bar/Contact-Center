const initialState = {
        id: 0,
        isAuthenticated: false,
        roles : [],
        auth : { userID : undefined, token : undefined, expirationTime: undefined }
        
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
                auth: newAuth
            })

        default:
            return state
    }
}

