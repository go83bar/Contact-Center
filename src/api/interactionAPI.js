import sendRequest from './fetch'

export default class InteractionAPI { 
    static async GetIssues(params) {
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