import sendRequest from './fetch'

export default class SearchAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

    /**
     * Gets a list of clients the user is assigned to
     * promise returns an object like 
     * {
     *  success: {boolean},
     *  clients: [
     *    {
     *      id: {int},
     *      name: {string}
     *    }
     *  ]
     * }
     * 
     * @param {Auth} auth - the auth token
     * @return {Promise}
     */
    static async getClients(auth) {
        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "clients/",
            method: "GET",
            data: { agent_id: auth.userID},
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result
    }

    /**
     * @typedef SearchParams
     * @type {object}
     * @property {number} id
     * @property {string} first_name
     * @property {string} last_name
     * @property {string} phone
     * @property {number} client_id
     */

    /**
     * Performs the lead search API call
     * promise returns an object like 
     * {
     *  success: {boolean},
     *  data: [
     *    {
     *      id: {integer},
     *      first_name: {string},
     *      last_name: {string},
     *      client_name: {string},
     *      vertical_name: {string},
     *      region_name: {string},
     *      phase_name: {string},
     *      office_name: {string},
     *      next_contact: {string},
     *      locked: {boolean}
     *    }
     *  ]
     * }
     * 
     * @static
     * @param {Auth} auth
     * @param {SearchParams} params
     * @returns {Promise}
     * @memberof SearchAPI
     */
    static async search(auth, params) {
        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "leads/search",
            method: "GET",
            data: params,
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result
    }
}