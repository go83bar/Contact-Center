/**@typedef Auth
 * @type {object}
 * @property {string} token - The token string
 * @property {number} userID - The ID of the current User
 *
 */

/**
 * @typedef RequestOptions
 * @type {object}
 * @property {string} url
 * @property {string} method
 * @property {string} type
 * @property {object} data
 * @property {Auth} auth
 * @property {boolean} toast
 */

import {toast} from "react-toastify";
import store from "../store";

/**
 * Performs the actual fetch API call
 *
 * @export
 * @param {RequestOptions} options
 * @returns {object}
 */
export default async function (options) {
    let defaultOptions = {
        url: "",
        method: "POST",
        type: "form",
        data: {},
        auth: {},
        toast: false

    }
    options = Object.assign({}, defaultOptions, options)
    let fetchOptions = {
        method: options.method,
        cache: "no-cache",
        //credentials: "include",
        headers: {}
    }
    if (options.auth.token !== undefined) {
        fetchOptions.headers = {
            "X-AUTH-TOKEN": options.auth.token,
            "X-USER-ID": options.auth.userID
        }
    }
    if (options.method === "POST" || options.method === "PUT") {
        if (options.type === "json") {
            fetchOptions.headers["Content-Type"] = "application/json"
            fetchOptions.body = JSON.stringify(options.data)

        } else if (options.type === "form"){
            fetchOptions.headers["Content-Type"] = "application/x-www-form-urlencoded"
            fetchOptions.body = new URLSearchParams(options.data)
        } else {
            return {error: "Unsupported post content type"}
        }
    } else if (options.method === "GET") {
        if (Object.keys(options.data).length > 0) {
            let params = new URLSearchParams(options.data)
            options.url = options.url + "?" + params.toString()
        }
    } else {
        return { error: "Unsupported method"}
    }
    const ref = Math.random()
    options.toast && toast.info(store.getState().localization.toast.saving, {toastId: ref, autoClose: false})
    const response = await fetch(options.url, fetchOptions)
    options.toast && toast.update(ref, {autoClose: 1000})
    return response.json()
  }
