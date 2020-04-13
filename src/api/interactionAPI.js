import sendRequest from './fetch'

export default class InteractionAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

     static async GetIssues(auth, params) {
        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "interaction/" + params.interactionID + "/getissues",
            method: "GET",
            data: params,
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result
     }
} 