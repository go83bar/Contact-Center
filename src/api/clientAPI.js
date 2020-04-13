import sendRequest from './fetch'

export default class ClientAPI {
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
     *  ],
     *  error: {string}
     * }
     * 
     * @param {Auth} auth - the auth token
     * @return {Promise}
     * @memberof ClientAPI
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

}