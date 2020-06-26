import sendRequest from './fetch'
import store from '../store'

export default class AppointmentAPI {

    /**
     * @typedef GetOfficeOptionsParams
     * @type {object}
     * @property {number} apptTypeID - the appointmet type ID to load offices for
     * @property {number} regionID - the region of offices to check, should be the lead's region
     */

    /**
     * Gets the offices assigned to a given appointment type, with associated data
     *
     * @static
     * @param {GetOfficeOptionsParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getOfficeOptions(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/officeOptions.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "appointments/types/" + params.apptTypeID + "/offices",
            data: { region_id: params.regionID},
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef GetCalendarParams
     * @type {object}
     * @property {number} appointmentTypeID 
     * @property {number} officeID 
     * @property {number} leadID 
     * @property {number} month 
     * @property {number} year
     */

    /**
     * Gets data on available appointment slots for a given office and appointment type
     *
     * @static
     * @param {GetCalendarParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getCalendar(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/getCalendar.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "appointments/list",
            data: { 
                lead_id: params.leadID,
                appointment_type_id: params.appointmentTypeID,
                office_id: params.officeID,
                month: params.month,
                year: params.year
            },
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef GetBookingQuestionsParams
     * @type {object}
     * @property {number} appointmentTypeID 
     * @property {number} officeID 
     * @property {number} leadID 
     */

    /**
     * Gets the offices assigned to a given appointment type, with associated data
     *
     * @static
     * @param {GetBookingQuestionsParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async getBookingQuestions(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/getBookingQuestions.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/" + params.leadID + "/bookingquestions",
            data: { 
                appointment_type_id: params.appointmentTypeID,
                office_id: params.officeID,
            },
            method: "GET",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef BookParams
     * @type {object}
     * @property {string} appointmentTime 
     * @property {number} appointmentTypeID 
     * @property {number} officeID 
     * @property {number} leadID 
     * @property {number} interactionID 
     */

    /**
     * Books a new appointment
     *
     * @static
     * @param {BookParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async book(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/bookAppointment.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "appointments",
            data: { 
                appointment_type_id: params.appointmentTypeID,
                office_id: params.officeID,
                appointment_time: params.appointmentTime,
                lead_id: params.leadID,
                interaction_id: params.interactionID
            },
            method: "POST",
            toast: true,
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef ConfirmParams
     * @type {object}
     * @property {number} appointmentID 
     */

    /**
     * Persists updated confirmed status of a given appointment
     *
     * @static
     * @param {ConfirmParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async confirm(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/confirmAppointment.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "appointments/" + params.appointmentID + "/confirm",
            method: "POST",
            toast: true,
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef UpdateStatusParams
     * @type {object}
     * @property {number} appointmentID 
     * @property {number} statusID 
     */

    /**
     * Persists updated confirmed status of a given appointment
     *
     * @static
     * @param {UpdateStatusParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async updateStatus(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/updateAppointmentStatus.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "appointments/" + params.appointmentID + "/status",
            method: "POST",
            data: {
                status_id: params.statusID
            },
            toast: true,
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }

    /**
     * @typedef SaveResponseParams
     * @type {object}
     * @property {array} response
     * @property {number} questionableID 
     * @property {number} questionID 
     * @property {number} leadID 
     * @property {number} interactionID 
     */

    /**
     * Gets the offices assigned to a given appointment type, with associated data
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
     * @param {SaveResponseParams} params
     * @returns {Promise}
     * @memberof LeadAPI
     */
    static async saveResponse(params) {
        // Mock API responses for local dev
        if (process.env.REACT_APP_QUERY_MODE === "development") {
            const mockData = await fetch(window.location.protocol + "//" + window.location.host + "/data/saveResponse.json")

            return mockData.json()
        }

        const redux = store.getState()
        const requestOptions = {
            url: redux.config["url-api-base"] + "leads/saveresponse",
            data: params,
            method: "POST",
            auth: redux.user.auth
        }
        const result = await sendRequest(requestOptions)

        return result
    }


}