import sendRequest from "./fetch";
import store from "../store";

export default class LabOrderAPI {
  /**
   * @static
   * @param {FormData} form
   * @return {Promise}
   * @memberof LabOrderAPI
   */
  static async submitLabOrder(form) {
    const redux = store.getState();

    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/lead/lab_orders/create",
      data: form,
      method: "POST",
      auth: redux.user.auth,
      type: "upload",
    };

    return await sendRequest(requestOptions);
  }

  /**
   * @static
   * @param {string} id
   * @return {Promise}
   * @memberof LabOrderAPI
   */
  static async deleteLabOrder(id) {
    const redux = store.getState();

    const requestOptions = {
      url: redux.config["url-react-base"] + "activate/lead/lab_orders/delete",
      data: id,
      method: "POST",
      auth: redux.user.auth,
    };

    return await sendRequest(requestOptions);
  }
}
