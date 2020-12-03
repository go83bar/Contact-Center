import React, {useState} from "react"
import {MDBBox, MDBInput} from "mdbreact";
import {useSelector} from "react-redux";
import AgentAPI from "../../api/agentAPI";
import {toast} from "react-toastify";

const ConfirmedPhoneInput = ({initialPhoneNumber, setConfirmedNumber}) => {
    const inputLabel = useSelector( state => state.localization.profile.account.phone)
    const codeLabel = useSelector( state => state.localization.profile.account.code)
    const successToast = useSelector( state => state.localization.toast.profile.numberVerified)
    const pinErrorToast = useSelector( state => state.localization.toast.profile.pinNotSent)
    const errorToast = useSelector( state => state.localization.toast.profile.numberNotVerified)
    const [currentPhone, setCurrentPhone] = useState(initialPhoneNumber)
    const [currentCode, setCurrentCode] = useState("")
    const [showCodeEntry, setShowCodeEntry] = useState(false)
    const [codeError, setCodeError] = useState(false)
    const [isBusy, setBusy] = useState(false)

    const handleNumberUpdates = (evt) => {
        const newValue = evt.target.value.replace(/\D/g, '')
        setCurrentPhone(newValue)

        const isNewNumber = newValue.length === 10 && newValue !== initialPhoneNumber
        setBusy(isNewNumber)

        if (isNewNumber) {
            // this is a new phone number that we need to confirm
            AgentAPI.verifyPhoneNumber(newValue).then( response => {
                if (response.success) {
                    setBusy(false)
                    setShowCodeEntry(true)
                } else {
                    toast.error(pinErrorToast)
                }
            }).catch( error => {
                console.log("verifyError: ", error)
                toast.error(pinErrorToast)
            })
        } else if (showCodeEntry) {
          setShowCodeEntry(false)
        }
        //setConfirmedNumber(newValue)
    }

    const handleCodeUpdates = (evt) => {
        const newValue = evt.target.value
        setCurrentCode(newValue)

        if (newValue.length === 6) {
            setBusy(true)
            AgentAPI.confirmPhoneNumber(currentPhone, newValue).then( response => {
                if (response.success) {
                    // all set, everything's good
                    setBusy(false)
                    setShowCodeEntry(false)
                    setCurrentCode("")
                    toast.success(successToast)
                } else {
                    // code didn't match or perhaps was expired
                    setCodeError(true)
                    setBusy(false)
                }
            }).catch( error => {
                console.log("confirmError: ", error)
                toast.error(errorToast)
            })
        }

    }

   const maskPhoneValue = (rawInput) => {
        if (rawInput === undefined) {
            return ""
        }
        const matches = rawInput.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        return !matches[2] ? matches[1] : '(' + matches[1] + ') ' + matches[2] + (matches[3] ? '-' + matches[3] : '')
    }

    return (
        <MDBBox>
            <MDBInput
                label={inputLabel}
                value={maskPhoneValue(currentPhone)}
                onChange={handleNumberUpdates}
                disabled={isBusy}
            />
            <MDBBox display={showCodeEntry ? "block" : "none"}>
                <MDBInput
                    label={codeLabel}
                    value={currentCode}
                    maxLength={6}
                    onChange={handleCodeUpdates}
                    color={codeError ? "red": "inherit"}
                    disabled={isBusy}
                />
            </MDBBox>
        </MDBBox>
    )
}

export default ConfirmedPhoneInput