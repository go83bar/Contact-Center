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
     * @param {string} loginPassword
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

    static async validateAuth(auth, refreshMode) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/userLogin.json")

            return mockData.json()
        }

        const redux = store.getState()
        const payload = {
            user_id: auth.userID,
            token: auth.token,
            refresh_mode: refreshMode
        }

        const requestOptions = {
            url: redux.config["url-react-base"] + "connect/validateauth",
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

    /**
     * Performs password reset check for available PIN delivery methods
     * Promise resolves to an object like this:
     * {
     *  "status": {string},
     *  "key_id": {number},
     *  "methods": {object}
     * }
     *
     * @param {string} username
     * @return {boolean|Auth}
     */
    static async getResetMethods(username) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/getResetMethods.json")

            return mockData.json()
        }

        const redux = store.getState()
        const payload = {
            user: username
        }

        const requestOptions = {
            url: redux.config["url-dashboard-base"] + "auth/otu/methods",
            data: payload
        }
        return await sendRequest(requestOptions)
    }

    /**
     * Performs password reset OTU delivery call
     * Promise resolves to an object like this:
     * {
     *  "status": {string},
     * }
     *
     * @param {number} userID
     * @param {string} deliveryMethod
     * @return {boolean|Auth}
     */
    static async sendOTUCode(userID, deliveryMethod) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/sendOTUCode.json")

            return mockData.json()
        }

        const redux = store.getState()
        const payload = {
            user_id: userID,
            delivery_mode: deliveryMethod
        }

        const requestOptions = {
            url: redux.config["url-dashboard-base"] + "auth/otu/send",
            data: payload
        }
        return await sendRequest(requestOptions)
    }

    /**
     * @typedef ValidateParams
     * @type {object}
     * @property {number} userID
     * @property {string} otu
     * @property {string} password1
     * @property {string} password2
     */

    /**
     * Performs password reset OTU delivery call
     * Promise resolves to an object like this:
     * {
     *  "status": {string},
     * }
     *
     * @param {ValidateParams} params
     * @return {boolean|Auth}
     */
    static async validateOTUCode(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/validateOTUCode.json")

            return mockData.json()
        }

        const redux = store.getState()
        const payload = {
            user_id: params.userID,
            otu: params.otu,
            password: params.password1,
            passwordMatch: params.password2
        }

        const requestOptions = {
            url: redux.config["url-dashboard-base"] + "auth/otu/validate",
            data: payload
        }
        return await sendRequest(requestOptions)
    }



}
