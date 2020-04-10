
// src/redux/reducers.js

//import {LOG_IN_USER, LOG_OUT_USER} from './actions'
//let user = JSON.parse(localStorage.getItem('user'));
//const initialState = user ? { loggedIn: true, user } : {};
const initialState = {
        isAuthenticated: false,
        roles : [],
        auth : { userID : undefined, token : undefined }
      }

// Reducer for handling auth actions
export function authentication(state = initialState, action) {
    switch (action.type) {
        case 'LOG_IN_USER':
            return {
                ...state,
                isAuthenticated: true
            }
        case 'LOG_OUT_USER':
            return {
                ...state,
                isAuthenticated: false
            }
        default:
            return state
    }
}

