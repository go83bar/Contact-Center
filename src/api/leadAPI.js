import sendRequest from './fetch'

export default class LeadAPI {
    /**@typedef Auth
     * @type {object}
     * @property {string} token - The token string
     * @property {number} userID - The ID of the current User
     * 
     */

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
     * Performs the search module API call
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
     *  ],
     *  error: {string}
     * }
     * 
     * @static
     * @param {Auth} auth
     * @param {SearchParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async moduleSearch(auth, params) {
        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "leads/search",
            method: "GET",
            data: params,
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result
    }

    /**
     * Fetches the next lead for the current user, if any
     * 
     * Promise resolves to the same object that LeadPreview returns, see below
     * In addition to the standard error format, it's also possible to have no errors but there's 
     * simply no leads left in the queue. In this case the response will resolve to an object 
     * exactly like this:
     * 
     * {
     *  success: true,
     *  lead: null
     * }
     * 
     * because reasons
     *
     * @static
     * @param {Auth} auth
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getNextLead(auth) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "//data//nextLead.json")
            
            return mockData.json()
        }

        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "leads/next",
            method: "GET",
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result

    }

    /**
     * @typedef LeadPreviewParams
     * @type {object}
     * @property {number} leadID - the lead ID to preview
     * @property {string} callQueueID - ID of call queue or the string "search"
     */

    /**
     * Gets the preview information for a given lead ID, used from Search or Recent
     * Promise resolves to an object like
     * {
     *  success: {boolean},
     *  data: {
     *      lead_id: {number},
     *      lead_name: {string},
     *      call_sid: {string},
     *      reason: {string},
     *      meta: [{
     *          name: {string},
     *          value: {string}
     *      }]
     *  }
     * }
     * 
     * @static
     * @param {Auth} auth 
     * @param {LeadPreviewParams} params 
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getLeadPreview(auth, params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "//data//nextLead.json")
            
            return mockData.json()
        }

        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "leads/" + params.leadID + "/preview",
            data: { call_queue_id: params.callQueueID},
            method: "GET",
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result
    }

    /** 
     * @typedef StartInteractionParams
     * @type {object}
     * @property {number} leadID
     * @property {string} callQueueID - supports integers as well as "search"
     * @property {string} previewStartTime
     */

    /**
     * Performs the interaction start-up in the backend, returns the interaction ID
     * Promise resolves to an object like 
     * {
     *  success: {boolean},
     *  data: {
     *      id: {number} - the freshly created interaction ID
     *  }
     * }
     *
     * @static
     * @param {Auth} auth
     * @param {StartInteractionParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async startInteraction(auth, params) {
        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "leads/" + params.leadID + "/startinteraction",
            data: { 
                call_queue_id: params.callQueueID,
                preview_start_time: params.previewStartTime
            },
            method: "GET",
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result
    }

    /**
     * @typedef LeadDTOParams
     * @type {object}
     * @property {number} leadID 
     */

    /**
     * Gets the large lead DTO that the interaction views are based on
     * Promise resolves to the large object structure represented in leadDTOReact.json
     *
     * @static
     * @param {Auth} auth
     * @param {LeadDTOParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getLeadDTO(auth, params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "//data//leadDTOReact.json")
            
            return mockData.json()
        }

        const requestOptions = {
            url: process.env.REACT_APP_API_BASE_URL + "leads/" + params.leadID + "/reactDTO",
            method: "GET",
            auth: auth
        }
        const result = await sendRequest(requestOptions)
        
        return result
    }

} 