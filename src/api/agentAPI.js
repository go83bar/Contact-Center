import sendRequest from './fetch'
import store from '../store'

export default class AgentAPI {
     /**
     * getAppStats is called to fetch basic stats to display to the agent
     * Promise resolves to an object like
     * {
     *  success: {boolean},
     *  data: {
     *      interactions: {number},
     *      handoffs: {number},
     *      bookings: {number},
     *      queue: {number}
     *  }
     * }
     *
     * @static
     * @return {Promise}
     * @memberof AgentAPI
     */
    static async getAppStats() {
        const redux = store.getState()

        const requestOptions = {
            url: redux.config["url-react-base"] + "activate/appstats",
            data: { user_id: redux.user.id},
            method: "POST",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * Gets recently worked leads for the current user
     * promise returns an object like
     * {
     *  success: {boolean},
     *  data: [
     *    {
     *      lead_id: {integer},
     *      first_name: {string},
     *      last_name: {string},
     *      client_name: {string},
     *      vertical_name: {string},
     *      region_name: {string},
     *      phase_name: {string},
     *      next_contact: {string},
     *      locked: {boolean}
     *    }
     *  ]
     * }
     * @static
     * @returns {Promise}
     * @memberof RecentAPI
     */
    static async getRecentLeads() {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/recentLeads.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "agents/recentleads",
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    static async getShiftData() {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/shiftDTO.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-react-base"] + "activate/shift",
            method: "POST",
            auth: redux.user.auth
        }

        return await sendRequest(requestOptions)
    }

}
