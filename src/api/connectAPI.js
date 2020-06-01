import sendRequest from './fetch'
import store from '../store'


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
    static async getPin(loginEmail, loginPassword) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/getPin.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-react-base"] + "connect/pin",
            data: { email: loginEmail, password: loginPassword},
        }
        return await sendRequest(requestOptions)

    }

    /**
     * Performs login auth call
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
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/userLogin.json")

            return mockData.json()
        }

        const redux = store.getState()
        const payload = {
            email: loginEmail,
            pin: loginPIN
        }

        const requestOptions = {
            url: redux.config["url-react-base"] + "connect/login",
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

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-react-base"] + "connect/logout",
            auth: auth
        }
        return await sendRequest(requestOptions)
    }

}
