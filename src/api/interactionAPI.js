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
            url: redux.config["url-api-base"] + "leads/" + redux.lead.id + "/callback ",
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

} 