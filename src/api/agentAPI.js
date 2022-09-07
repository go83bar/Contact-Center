import sendRequest from "./fetch";
import store from "../store";

export default class AgentAPI {
  /**
   * getAppStats is called to fetch basic stats to display to the agent
   * Promise resolves to an object like
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
   * @static
   * @param {string} targetDate
   * @return {Promise}
   * @memberof AgentAPI
   */
  static async getAppStats(targetDate) {
    const redux = store.getState();

    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/agent/appstats",
      data: { user_id: redux.user.id, target_date: targetDate },
      method: "POST",
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }

  /**
   * verifyPhoneNumber is called to send a confirm code when the user wants
   * to change their phone number
   * Promise resolves to an object like
   * {
   *  success: {boolean},
   * }
   *
   * @static
   * @param {string} phoneNumber
   * @return {Promise}
   * @memberof AgentAPI
   */
  static async verifyPhoneNumber(phoneNumber) {
    const redux = store.getState();

    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/agent/verifyphone",
      data: { number: phoneNumber },
      method: "POST",
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }

  /**
   * confirmPhoneNumber is called to verify a confirm code and update the phone
   * to change their phone number
   * Promise resolves to an object like
   * {
   *  success: {boolean},
   * }
   *
   * @static
   * @param {string} phoneNumber
   * @param {string} pinEntry
   * @return {Promise}
   * @memberof AgentAPI
   */
  static async confirmPhoneNumber(phoneNumber, pinEntry) {
    const redux = store.getState();

    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/agent/confirmphone",
      data: { number: phoneNumber, pin: pinEntry },
      method: "POST",
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }

  /**
   * @typedef UpdateProfileParams
   * @type {object}
   * @property {string} first_name
   * @property {string} last_name
   * @property {string} phone
   * @property {string} email
   * @property {string} password
   */

  /**
   * updateProfile is called to persist new agent profile info
   * Promise resolves to an object like
   * {
   *  success: {boolean},
   * }
   *
   * @static
   * @param {UpdateProfileParams} params
   * @return {Promise}
   * @memberof AgentAPI
   */
  static async updateProfile(params) {
    const redux = store.getState();

    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/agent/profile",
      method: "POST",
      data: params,
      toast: true,
      auth: redux.user.auth,
    };
    return await sendRequest(requestOptions);
  }

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
   * @returns {Promise}
   * @memberof RecentAPI
   */
  static async getRecentLeads() {
    // Mock API responses for local dev
    if (process.env.REACT_APP_QUERY_MODE === "development") {
      const mockData = await fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/data/recentLeads.json"
      );

      return mockData.json();
    }

    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-api-base"] + "agents/recentleads",
      method: "GET",
      auth: redux.user.auth,
    };
    const result = await sendRequest(requestOptions);

    return result;
  }

  /**
   * @typedef ResendEmailParams
   * @type {object}
   * @property {number} leadID
   * @property {number} logEmailID
   */

  /**
   * Resends logged email to lead's current email
   *
   * @static
   * @param {ResendEmailParams} params
   * @returns {Promise}
   * @memberof LeadAPI
   */
  static async resendEmail(params) {
    // Mock API responses for local dev
    if (process.env.REACT_APP_QUERY_MODE === "development") {
      const mockData = await fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/data/resendEmail.json"
      );

      return mockData.json();
    }

    const redux = store.getState();
    const requestOptions = {
      url:
        redux.config["url-api-base"] +
        "leads/" +
        params.leadID +
        "/timeline/resend",
      method: "POST",
      data: {
        log_id: params.logEmailID,
      },
      toast: true,
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }

  /**
   * @typedef ResendRewardParams
   * @type {object}
   * @property {number} rewardID
   */

  /**
   * Resends client reward to lead's current email
   *
   * @static
   * @param {{rewardID: *}} params
   * @returns {Promise}
   * @memberof LeadAPI
   */
  static async resendReward(params) {
    // Mock API responses for local dev
    if (process.env.REACT_APP_QUERY_MODE === "development") {
      const mockData = await fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/data/resendReward.json"
      );

      return mockData.json();
    }

    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/lead/resendreward",
      method: "POST",
      type: "json",
      data: {
        reward_id: params.rewardID,
      },
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }

  /**
   * Gets the user's current shift data, returns a fairly large object with all the assigned clients' data
   */
  static async getShiftData() {
    // Mock API responses for local dev
    if (process.env.REACT_APP_QUERY_MODE === "development") {
      const mockData = await fetch(
        window.location.protocol +
          "//" +
          window.location.host +
          "/data/shiftDTO.json"
      );

      return mockData.json();
    }

    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/agent/shift",
      method: "POST",
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }

  /**
   * Signals to the API that the user is declining to work the lead locked to them
   *
   * @param leadID
   * @returns {Promise<{error: string}|{error: string}|*>}
   */
  static async declineLockedLead(leadID) {
    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/agent/declinelock",
      method: "POST",
      data: {
        lead_id: leadID,
      },
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }
}
