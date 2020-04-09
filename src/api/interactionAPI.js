import sendRequest from './fetch'

export default class InteractionAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

    /**
     * getAppStats is called to fetch basic stats to display to the agent
     * returns an object like
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
     * @param {Auth} auth - the auth object
     * @return {object}
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
} 