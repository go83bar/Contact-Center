import React, {useCallback, useEffect, useRef, useState} from 'react'
import {MDBBtn, MDBModal, MDBModalBody} from "mdbreact";
import {useDispatch, useSelector} from "react-redux";
import ConnectAPI from "./api/connectAPI";
import {useCookies} from "react-cookie";
import store from "./store";
import {toast} from "react-toastify";

const ExpiredTokenModal = () => {
    const localization = useSelector( state => state.localization.auth)
    const tokenRefreshToastError = useSelector( state => state.localization.toast.tokenRefresh.refreshError)
    const showInactiveWarning = useSelector( state => state.auth.showInactiveWarning)
    const userID = useSelector( state => state.user.id)
    const authToken = useSelector( state => state.user.auth.token)
    const [cookies, setCookie, removeCookie] = useCookies([])
    const [timerValue, setTimerValue] = useState(30)
    const timerRef = useRef()
    const dispatch = useDispatch()

    const userLogout = useCallback(() => {
        // hit logout endpoint
        ConnectAPI.logout(userID).then(responseJson => {
            // wipe out auth cookie
            if (cookies.auth !== undefined) {
                removeCookie('auth')
            }

            // wipe out store
            store.dispatch({
                type: "USER.LOG_OUT"
            })
        }).catch(error => {
            toast.error("PLEASE REFRESH YOUR BROWSER")
            console.log("LOGOUT ERROR: ", error)
        })
    }, [cookies, removeCookie, userID])

    useEffect( () => {
        if (showInactiveWarning) {
            setTimerValue(30)
            let timerID = setInterval( () => {
                setTimerValue(value => value - 1)
            }, 1000)
            timerRef.current = timerID
            return () => clearInterval(timerID)
        }
    }, [showInactiveWarning])


    // effect to nuke user if timer ever reaches zero
    useEffect( () => {
        if (timerValue === 0) {
            userLogout()
        }
    }, [timerValue, dispatch, removeCookie, cookies.auth, userLogout])

    const handleRefreshClick = useCallback(() => {
        clearInterval(timerRef.current)
        ConnectAPI.validateAuth({userID, token: authToken}, true).then( response => {
            if (response.success) {
                //set new token into cookies
                setCookie('auth', response.auth)

                // set new token into user.auth and set hasTakenAction to false
                dispatch({
                    type: "USER.TOKEN_REFRESHED",
                    data: response.auth
                })
            } else {
                console.log("Token refresh failed: " + response.errorMessage)
                toast.error(tokenRefreshToastError)
                userLogout()
            }

        }).catch( error => {
            console.log("Token refresh exception: " + error)
            toast.error(tokenRefreshToastError)
            userLogout()
        })
    }, [timerRef, userID, authToken, setCookie, dispatch, tokenRefreshToastError, userLogout])


    return (
        <MDBModal isOpen={showInactiveWarning} centered keyboard={false}>
            <MDBModalBody className="p-4">
                <h3>{localization.inactivityTitle}</h3>
                <p className="text-center">{localization.inactivityCopy.replace('$', timerValue)}</p>
                <MDBBtn onClick={handleRefreshClick} className="mx-auto my-2">{localization.inactivityButtonLabel}</MDBBtn>
            </MDBModalBody>
        </MDBModal>
    )
}

export default ExpiredTokenModal
