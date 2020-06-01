import sendRequest from './fetch'
import store from '../store'

export default class TwilioAPI {

    /**
     * Performs access token call.  This cannot be mocked as Twilio requires valid expiring JWTs
     * Promise resolves to an object like this:
     * {
     *  "access_token": {string},
     * }
     *
     * @param {number} loginPIN
     * @param {string} loginEmail
     * @return {boolean|Auth}
     */
    static async getAccessToken(userID, authToken) {
        const redux = store.getState()
        const payload = {
            user_id: userID,
            token: authToken
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/token",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)
    }

    /**
     * Performs call to initiate outbound dial to lead.  Lead's call is then routed into the
     * given Conference ID.  Returns the SID of the lead's call leg.
     * Promise resolves to an object like this:
     * {
     *  "call_sid": {string},
     * }
     *
     * @param {string} dialOption
     * @return {Promise}
     */
    static async dialLead(dialOption) {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            lead_id: redux.lead.id,
            conference_id: redux.twilio.conferenceOID,
            dial_option: dialOption
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/call/lead",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)

    }

    /**
     * Performs call to place lead leg on hold.  Returns boolean success.
     * Promise resolves to an object like this:
     * {
     *  "success": {bool},
     * }
     *
     * @return {Promise}
     */
    static async holdLead() {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            call_sid: redux.twilio.leadCallSID
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/call/hold",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)

    }

    /**
     * Performs call to remove lead leg from hold.  Returns boolean success.
     * Promise resolves to an object like this:
     * {
     *  "success": {bool},
     * }
     *
     * @return {Promise}
     */
    static async unholdLead() {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            conference_oid: redux.twilio.conferenceOID,
            call_sid: redux.twilio.leadCallSID
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/call/unhold",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)
    }

    /**
     * Performs call to drop lead into autovoicemail leg.  Returns boolean success.
     * Promise resolves to an object like this:
     * {
     *  "success": {bool},
     * }
     *
     * @return {Promise}
     */
    static async playAutoVM() {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            lead_id: redux.lead.id,
            call_sid: redux.twilio.leadCallSID
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/call/autovm",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)
    }


    /**
     * Performs call to pause or resume conferencce recording.  Returns boolean success.
     * Promise resolves to an object like this:
     * {
     *  "success": {bool},
     * }
     *
     * @return {Promise}
     */
    static async modifyRecording(action) {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            action: action,
            conference_oid: redux.twilio.conferenceOID
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/conference/modify",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)
    }

    /**
     * Performs call to initiate outbound dial to provider.  Provider's call is then routed into the
     * given Conference ID.  Returns the SID of the provider's call leg.
     * Promise resolves to an object like this:
     * {
     *  "call_sid": {string},
     * }
     *
     * @param {int} officeID
     * @param {string} officeNumber
     * @return {Promise}
     */
    static async dialProvider(officeID, officeNumber) {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            lead_id: redux.interaction.lead_id,
            conferenceID: redux.interaction.conferenceID,
            office_id: officeID,
            office_number: officeNumber
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/call/provider",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)

    }

    /**
     * Performs call to move lead and provider into new conference.  Returns boolean success.
     * Promise resolves to an object like this:
     * {
     *  "success": {bool},
     * }
     *
     * @return {Promise}
     */
    static async transferHandoff() {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            interaction_id: redux.interaction.id,
            lead_call_sid: redux.twilio.leadCallSID,
            provider_call_sid: redux.twilio.providerCallSID

        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/conference/transfer",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)
    }

    /**
     * Performs call to disconnect a call.
     * Promise resolves to an object like this:
     * {
     *  "success": {bool},
     * }
     *
     * @param {string} callSID
     * @return {Promise}
     */
    static async disconnectCall(callSID) {
        const redux = store.getState()
        const payload = {
            token: redux.user.auth.token,
            call_sid: callSID
        }

        const requestOptions = {
            url: redux.config["url-twilio-base"] + "connect/call/end",
            data: payload,
            type: "json"
        }
        return await sendRequest(requestOptions)

    }

}