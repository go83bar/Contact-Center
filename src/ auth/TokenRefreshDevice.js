import store from '../store'
import {toast} from "react-toastify";
import connectAPI from "../api/connectAPI";
import Cookies from "universal-cookie";

class TokenRefreshDeviceSingleton {
    bootstrap() {
        // clear any existing timer
        this.stop()

        // 10 minute token time minus 30 seconds, in milliseconds because javascript
        const intervalTiming = 570000
        console.log("Setting up timeout for ", intervalTiming)

        // set interval for kicking off activity check
        this.refreshInterval = setInterval( () => {
            console.log("Refreshing token...")
            const redux = store.getState()

            if (redux.auth.hasTakenAction || redux.twilio.leadCallSID !== "") {
                // user has taken an action in the last period, so we silently refresh the token in the background
                connectAPI.validateAuth(redux.user.auth, true).then( response => {
                    if (response.success) {
                        //set new token into cookies
                        const cookies = new Cookies()
                        cookies.set('auth', response.auth)

                        // set new token into user.auth and set hasTakenAction to false
                        store.dispatch({
                            type: "USER.TOKEN_REFRESHED",
                            data: response.auth
                        })
                    } else {
                        console.log("Token refresh failed: " + response.errorMessage)
                        toast.error(redux.localization.toast.tokenRefresh.refreshError)
                        store.dispatch({
                            type: "USER.LOG_OUT"
                        })
                    }
                }).catch( error => {
                    console.log("Token refresh exception: " + error)
                    toast.error(redux.localization.toast.tokenRefresh.refreshError)
                    store.dispatch({
                        type: "USER.LOG_OUT"
                    })
                })
            } else {
                // user has not taken any action, all we need to do is pop the inactivity warning modal
                store.dispatch({
                    type: "USER.INACTIVE_WARNING"
                })
            }
        }, intervalTiming)
    }

    stop = () => {
        if (this.refreshInterval !== undefined) {
            clearInterval(this.refreshInterval)
            this.refreshInterval = 0
        }
    }

}

export let TokenRefreshDevice = new TokenRefreshDeviceSingleton()