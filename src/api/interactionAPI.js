import sendRequest from './fetch'
import store from '../store'

export default class InteractionAPI {

    /**
     * @typedef SaveCallbackParams
     * @type {object}
     * @property {string} callbackTime
     * @property {number} interactionID
     *
     */

    /**
      * Saves a callback time the agent has negotiatied with the lead
      *
      * @param {SaveCallbackParams} params
      * @returns {Promise}
      * @memberof LeadAPI
      */
    static async saveCallback(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/saveCallback.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + redux.lead.id + "/callback",
            method: "POST",
            data: {
                interaction_id: params.interactionID,
                callback_time: params.callbackTime
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef FetchTemplatesParams
     * @type {object}
     * @property {number} leadID
     *
     */

    /**
      * Fetches rendered text templates for the given lead
      *
      * @param {FetchTemplatesParams} params
      * @returns {Promise}
      * @memberof InteractionAPI
      */
     static async fetchTextTemplates(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/fetchTextTemplates.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/texttemplates",
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
      * Fetches rendered email templates for the given lead
      *
      * @param {FetchTemplatesParams} params
      * @returns {Promise}
      * @memberof InteractionAPI
      */
     static async fetchEmailTemplates(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/fetchEmailTemplates.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/emailtemplates",
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef FetchCallingHoursParams
     * @type {object}
     * @property {number} regionID
     *
     */

    /**
      * Fetches calling hours data for all offices in a given region
      *
      * @param {FetchCallingHoursParams} params
      * @returns {Promise}
      * @memberof InteractionAPI
      */
     static async fetchCallingHours(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/fetchCallingHours.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "region/" + params.regionID + "/offices/callingHours",
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef SendTextParams
     * @type {object}
     * @property {number} leadID
     * @property {number} interactionID
     * @property {string} body
     *
     */

    /**
      * Sends an agent text to the lead
      *
      * @param {SendTextParams} params
      * @returns {Promise}
      * @memberof InteractionAPI
      */
     static async sendTextMessage(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "text/send",
            method: "POST",
            data: {
                lead_id: params.leadID,
                interaction_id: params.interactionID,
                body: params.body
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef SendEmailParams
     * @type {object}
     * @property {number} leadID
     * @property {number} interactionID
     * @property {string} subject
     * @property {string} body
     *
     */

    /**
      * Sends an agent text to the lead
      *
      * @param {SendEmailParams} params
      * @returns {Promise}
      * @memberof InteractionAPI
      */
     static async sendEmailMessage(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "email/send",
            method: "POST",
            data: {
                lead_id: params.leadID,
                interaction_id: params.interactionID,
                body: params.body,
                subject: params.subject
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }
}
