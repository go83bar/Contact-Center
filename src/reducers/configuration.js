
// src/redux/reducers.js

//import {LOG_IN_USER, LOG_OUT_USER} from './actions'
//let user = JSON.parse(localStorage.getItem('user'));
//const initialState = user ? { loggedIn: true, user } : {};
const initialState = { }

// Reducer for handling config actions
export function configuration(state = initialState, action) {
    if (action.type === 'CONFIGURE') {
            return Object.assign({}, state, {
                ...action.payload
            })
    }
    return state
}

