import sendRequest from './fetch'

export default class ConnectAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

    /**
     * Performs PIN request call, requires an user email
     * Promise resolves to false if it gets an error from the API endpoint
     * 
     * @param {string} loginEmail 
     * @return {boolean}
     */
    static async getPin(loginEmail) {

        const requestOptions = {
            url: process.env.REACT_APP_LOGIN_BASE_URL + "pin",
            data: { email: loginEmail},
        }
        return await sendRequest(requestOptions)

    }

    /**
     * Performs login auth call, and if successful will set auth info into this.auth
     * Promise resolves to an object like this:
     * {
     *  "success": {bool},
     *  "user_id": {number},
     *  "auth_token": {string}
     * }
     * 
     * @param {number} loginPIN 
     * @param {string} loginEmail 
     * @return {boolean|Auth}
     */
    static async login(loginPIN, loginEmail) {
        const payload = {
            email: loginEmail,
            pin: loginPIN
        }

        const requestOptions = {
            url: process.env.REACT_APP_LOGIN_BASE_URL + "login",
            data: payload
        }
        return await sendRequest(requestOptions)
    }

    /**
     * Performs logout call
     * 
     * 
     * @param {Auth} auth
     * @returns {Promise}
     * @memberof ConnectAPI
     */
    static async logout(auth) {

        const requestOptions = {
            url: process.env.REACT_APP_LOGIN_BASE_URL + "logout",
            auth: auth
        }
        return await sendRequest(requestOptions)
    }

}