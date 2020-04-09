import sendRequest from './fetch'

export default class RecentAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

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
        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "agents/recentleads",
            method: "GET",
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result

    }
}