import sendRequest from "./fetch";
import store from "../store";

export default class DocumentAPI {
  /**
   * @typedef CreateParams
   * @type {object}
   * @property {number} documentID
   * @property {number} leadID
   * @property {number} agentID
   */

  /**
   * Fetches new document instance for given lead and document
   *
   * @static
   * @param {CreateParams} params
   * @returns {Promise}
   * @memberof LeadAPI
   */
  static async createInstance(params) {
    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-api-base"] + "documents/create",
      method: "GET",
      data: {
        document_id: params.documentID,
        lead_id: params.leadID,
        agent_id: params.agentID,
      },
      auth: redux.user.auth,
    };
    return await sendRequest(requestOptions);
  }

  /**
   * @typedef LoadParams
   * @type {object}
   * @property {number} documentInstanceID
   */

  /**
   * Loads an existing document instance
   *
   * @static
   * @param {LoadParams} params
   * @returns {Promise}
   * @memberof LeadAPI
   */
  static async loadInstance(params) {
    const redux = store.getState();
    const requestOptions = {
      url:
        redux.config["url-api-base"] + "documents/" + params.documentInstanceID,
      method: "GET",
      auth: redux.user.auth,
    };
    return await sendRequest(requestOptions);
  }

  /**
   * Saves both new documents and existing documents
   * @param params
   * @returns {Promise}
   */
  static async saveDocument(params) {
    const payload = {
      agent_id: params.agentID,
      document_id: params.documentID,
      lead_id: params.leadID,
      responses: params.responses,
      uses_json: true,
    };

    if (params.documentInstanceID !== undefined) {
      payload.document_instance_id = params.documentInstanceID;
    }

    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-api-base"] + "documents/save",
      method: "POST",
      data: payload,
      auth: redux.user.auth,
    };
    return await sendRequest(requestOptions);
  }

  /**
   * Sends a DocuSign Envelope from a template
   * @param params
   * @returns {Promise}
   */
  static async sendDocusign(params) {
    const payload = {
      template_id: params.templateID,
      lead_id: params.leadID,
    };

    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/lead/docusign",
      method: "POST",
      data: payload,
      auth: redux.user.auth,
    };
    return await sendRequest(requestOptions);
  }

  /**
   * Reends a DocuSign Envelope
   * @param params
   * @returns {Promise}
   */
  static async resendDocusign(params) {
    const payload = {
      envelope_id: params.envelopeID,
    };

    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/lead/docusignresend",
      method: "POST",
      data: payload,
      auth: redux.user.auth,
    };
    return await sendRequest(requestOptions);
  }

  /**
   * Updates a DocuSign Envelope
   * @param params
   * @returns {Promise}
   */
  static async updateDocusignStatus(params) {
    const payload = {
      envelope_id: params.envelopeID,
      new_status: params.newStatus,
    };

    const redux = store.getState();
    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/lead/docusign/update",
      method: "POST",
      data: payload,
      auth: redux.user.auth,
    };
    return await sendRequest(requestOptions);
  }
}
