import sendRequest from './fetch'

export default class AgentAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

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
     * @param {Auth} auth - the auth object
     * @return {Promise}
     * @memberof AgentAPI
     */
    static async getAppStats(auth) {
        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "agents/appstats",
            data: { agent_id: auth.userID},
            method: "GET",
            auth: auth
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
     * @param {Auth} auth
     * @returns {Promise}
     * @memberof RecentAPI
     */
    static async getRecentLeads(auth) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "//data//recentLeads.json")
            
            return mockData.json()
        }

        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "agents/recentleads",
            method: "GET",
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result

    }

}