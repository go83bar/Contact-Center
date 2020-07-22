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

import {toast} from "react-toastify"
import moment from "moment"
import store from "../store"

/**
 * Performs the actual fetch API call
 *
 * @export
 * @param {RequestOptions} options
 * @returns {object}
 */
export default async function (options) {
    // check estimated token expiration time and drop immediately to login screen if we're stale
    const redux = store.getState()
    const currentTime = moment.utc()
    if (redux.user.auth !== undefined && 
        redux.user.auth.expirationTime !== undefined && 
        currentTime.isAfter(redux.user.auth.expirationTime)) {
            store.dispatch({ type: "USER.TOKEN_EXPIRED"})
            throw new Error("Token Expired")
    }

    // set up common sense defaults
    let defaultOptions = {
        url: "",
        method: "POST",
        type: "form",
        data: {},
        auth: {},
        toast: false

    }

    // merge in passed options
    options = Object.assign({}, defaultOptions, options)

    // begin building fetch API parameter object
    let fetchOptions = {
        method: options.method,
        cache: "no-cache",
        //credentials: "include",
        headers: {}
    }

    // optionally set API authentication headers
    if (options.auth.token !== undefined) {
        fetchOptions.headers = {
            "X-AUTH-TOKEN": options.auth.token,
            "X-USER-ID": options.auth.userID
        }
    }

    // set content-type according to HTTP method for now
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

    // optionally pop toast message and fire off fetch API request
    const ref = Math.random()
    options.toast && toast.info(redux.localization.toast.saving, {toastId: ref, autoClose: false})
    const response = await fetch(options.url, fetchOptions)
    
    // trigger immediate redirect to login on Unauthorized response
    if (response.status === 401) {
        store.dispatch({ type: "USER.TOKEN_EXPIRED"})
        throw new Error("Token Expired")
    }

    // else reset token expiration timer
    const newExpirationTime = moment.utc().add(60, 'minutes')
    store.dispatch({ type: "USER.TOKEN_REFRESH", data: newExpirationTime})

    // optionally cut toast short, and return fetch API response
    options.toast && toast.update(ref, {autoClose: 1000})
    return response.json()
  }
