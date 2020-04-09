import sendRequest from './fetch'

export default class ConnectAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

    /**
     * Performs PIN request call, requires an agent phone number
     * returns false if it gets an error from the API endpoint
     * 
     * @param {string} loginPhone 
     * @return {boolean}
     */
    async pin(loginPhone) {
        const url = this.config.appBaseUrl + "pin-react"
        const payload = {
            phone: loginPhone
        }

        const requestOptions = {
            url: process.env.REACT_APP_APP_BASE_URL + "pin-react",
            data: { phone: loginPhone},
        }
        const result = await sendRequest(requestOptions)

        return result.success
    }

    /**
     * Performs login auth call, and if successful will set auth info into this.auth
     * returns false if the login failed
     * 
     * @param {number} loginPIN 
     * @param {string} loginPhone 
     * @return {boolean|Auth}
     */
    async login(loginPIN, loginPhone) {
        const url = this.config.appBaseUrl + "login-react"
        const payload = {
            phone: loginPhone,
            pin: loginPIN,
            react_mode: true
        }

        const requestOptions = {
            url: process.env.REACT_APP_APP_BASE_URL + "login-react",
            data: payload
        }
        const result = await sendRequest(requestOptions)

        if (result.api_token != undefined) {
            return {token: result.api_token, userID: result.user_id}
        }
        return false
    }
}