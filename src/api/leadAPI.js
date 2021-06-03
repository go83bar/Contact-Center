import sendRequest from './fetch'
import store from '../store'

export default class LeadAPI {

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
     * @param {SearchParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async moduleSearch(params) {
        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/search",
            method: "GET",
            data: params,
            auth: redux.user.auth
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
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getNextLead() {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/nextLead.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/next",
            method: "GET",
            auth: redux.user.auth
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
     * @param {LeadPreviewParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getLeadPreview(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/nextLead.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/preview",
            method: "GET",
            auth: redux.user.auth
        }

        if (params.callQueueID !== undefined) {
            requestOptions.data = {call_queue_id: params.callQueueID}
        }

        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef StartInteractionParams
     * @type {object}
     * @property {number} leadID
     * @property {string} callQueueID - supports integers as well as "search"
     * @property {string} callReason - used for "search" and "incoming"
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
     * @param {StartInteractionParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async startInteraction(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/startInteraction.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/startinteraction",
            data: {
                call_queue_id: params.callQueueID,
                preview_start_time: params.previewStartTime,
                call_reason: params.callReason
            },
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * Calls the backend function to load a locked lead and any unfinished interaction ID attached to it
     *
     * @static
     * @param {number} leadID
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async fetchLockedLead(leadID) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/startInteraction.json")
            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + leadID + "/lockedlead",
            method: "GET",
            auth: redux.user.auth
        }
        return await sendRequest(requestOptions)
    }

    /**
     * End an interaction
     *
     * @param {EndInteractionParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async endInteraction(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }
        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + redux.lead.id + "/outcome",
            method: "POST",
            data: params,
            auth: redux.user.auth
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
     * @param {LeadDTOParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getLeadDTO(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/leadDTOReact.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-react-base"] + "activate/lead",
            method: "POST",
            data: {
                lead_id: params.leadID
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef LeadAppointmentsParams
     * @type {object}
     * @property {number} leadID
     */

    /**
     * Gets just the appointments and appointment_logs elements of the lead DTO object
     * 
     *
     * @static
     * @param {LeadAppointmentParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getLeadAppointments(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/leadAppointments.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-react-base"] + "activate/lead/appointments",
            method: "POST",
            data: {
                lead_id: params.leadID
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef MergeLeadParams
     * @type {object}
     * @property {number} targetLeadID
     * @property {number} sourceLeadID
     * @property {number} interactionID
     * @property mergeFields
     */

    /**
     * Merge the source lead's data into the target lead and archive the source lead
     *
     *
     * @static
     * @param {MergeLeadParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async mergeLead(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.sourceLeadID + "/merge",
            method: "POST",
            type: "json",
            data: {
                interaction_id: params.interactionID,
                target_lead_id: params.targetLeadID,
                overwrite_values: params.mergeFields
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef CreateLeadParams
     * @type {object}
     * @property {string} first_name
     * @property {string} last_name
     * @property {string} email
     * @property {string} cell_phone
     * @property {string} home_phone
     * @property {string} street_1
     * @property {string} street_2
     * @property {string} city
     * @property {string} state
     * @property {string} zip
     * @property {number} client_id
     * @property {number} vertical_id
     * @property {number} campaign_id
     * @property {number} region_id
     * @property mergeFields
     */

    /**
     * Create a new lead in the current lead's client, region, campaign, and vertical
     * The backend API also locks this lead to the current user so it appears next in their queue
     *
     *
     * @static
     * @param {CreateLeadParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async createLead(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/create",
            method: "POST",
            type: "json",
            data: params,
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef EmailContentParams
     * @type {object}
     * @property {number} leadID
     * @property {number} emailLogID
     */

    /**
     * Gets the contents of an email from the API
     *
     * @static
     * @param {EmailContentParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getEmailContent(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/emailContent.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/timeline/view",
            method: "POST",
            data: {
                log_id: params.emailLogID
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef ContactPreferenceParams
     * @type {object}
     * @property {number} leadID
     * @property {string} type
     * @property {boolean} preference
     */

    /**
     * Sets the lead contact preferences
     *
     * @static
     * @param {ContactPreferenceParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async setContactPreferences(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/optout",
            method: "POST",
            data: {
                agent_id: redux.user.id,
                type: params.type,
                preference: params.preference
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef ContactInfoParams
     * @type {object}
     * @property {number} leadID
     * @property {object} payload
     */

    /**
     * Updates the lead contact information
     *
     * @static
     * @param {ContactInfoParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async saveContactInfo(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/contact",
            method: "POST",
            data: params.payload,
            auth: redux.user.auth,
            toast : true
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef UpdateDetailsParams
     * @type {object}
     * @property {number} lead_id
     * @property {object} updates
     */

    /**
     * Updates the lead details in the new react controller
     *
     * @static
     * @param {UpdateDetailsParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async updateDetails(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-react-base"] + "activate/lead/updatedetails",
            method: "POST",
            type: "json",
            data: params,
            auth: redux.user.auth,
            toast : true
        }
        return await sendRequest(requestOptions)
    }

    /**
     * @typedef ClientResponsesParams
     * @type {object}
     * @property {number} lead_id
     * @property {number} interaction_id
     * @property {array} questions
     */

    /**
     * Updates the lead contact information
     *
     * @static
     * @param {ClientResponsesParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async saveClientResponses(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-react-base"] + "activate/lead/clientresponses",
            method: "POST",
            type: "json",
            data: params,
            auth: redux.user.auth,
            toast : true
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef UpdateNoteParams
     * @type {object}
     * @property {number} noteID
     * @property {string} noteContent
     *
     */

     /**
      * Updates a note previously saved in the interaction
      *
      * @param {UpdateNoteParams} params
      * @returns {Promise}
      * @memberof LeadAPI
      */
    static async updateNote(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + redux.lead.id + "/notes/update",
            method: "POST",
            data: {
                agent_id: redux.user.id,
                note_id: params.noteID,
                note_content: params.noteContent
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef SaveNoteParams
     * @type {object}
     * @property {string} noteContent
     * @property {number} interactionID
     *
     */

     /**
      * Updates a note previously saved in the interaction
      *
      * @param {SaveNoteParams} params
      * @returns {Promise}
      * @memberof LeadAPI
      */
     static async saveNote(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/saveNote.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + redux.lead.id + "/notes",
            method: "POST",
            data: {
                interaction_id: params.interactionID,
                message: params.noteContent
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

    /**
     * @typedef DeleteNoteParams
     * @type {object}
     * @property {number} leadID
     * @property {number} noteID
     *
     */

     /**
      * Deletes a note previously saved in the interaction
      *
      * @param {DeleteNoteParams} params
      * @returns {Promise}
      * @memberof LeadAPI
      */
     static async deleteNote(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/successTrue.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/notes/delete ",
            method: "POST",
            data: {
                note_id: params.noteID,
            },
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result

    }

}
