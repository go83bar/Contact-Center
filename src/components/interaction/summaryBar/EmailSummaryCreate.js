import React, {useState} from 'react'
import {MDBBtn, MDBInputGroup} from "mdbreact";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import LeadAPI from "../../../api/leadAPI";
import {setValidatedEmail} from "../../../reducers/actions/interactionActions";

const EmailSummaryCreate = () => {
    const leadID = useSelector(state => state.lead.id)
    const clientID = useSelector(state => state.lead.client_id)
    const localized = useSelector(state => state.localization)
    const validateButtonLabel = localized.buttonLabels.validate
    const workingButtonLabel = localized.buttonLabels.working
    const [displayMode, setDisplayMode] = useState("button")
    const [buttonsDisabled, setButtonsDisabled] = useState(false)
    const [buttonLabel, setButtonLabel] = useState(validateButtonLabel)
    const [emailValue, setEmailValue] = useState("")
    const dispatch = useDispatch()


    const updateValue = (evt) => {
        setEmailValue(evt.target.value)
    }

    const triggerValidation = () => {
        console.log("Validating " + emailValue)

        // smoke test for xxx@yyy.zzz
        const re = /\S+@\S+\.\S+/;
        if (!re.test(emailValue)) {
            toast.error(localized.toast.editLead.emailMalformed)
            return
        }

        // disable buttons to prevent spam clicks
        setButtonsDisabled(true)
        setButtonLabel(workingButtonLabel)

        // make backend call
        const params = {
            email: emailValue,
            leadID: leadID,
            clientID: clientID,
            summaryID: 0
        }
        LeadAPI.createEmail(params).then( response => {
            // pop a toast message to the user indicating the result
            if (response.summary !== undefined && response.summary.is_current === 1) {
                toast.success(localized.toast.editLead.emailCurrent)

            } else {
                const toastMsg = localized.toast.editLead.emailInvalid
                toast.error(toastMsg.replace("$", emailValue))
            }

            // reducer will set the new email in it's proper place in the array
            dispatch(setValidatedEmail(response.summary.id, response.summary.is_current, response.summary.is_usable, emailValue))
            setButtonsDisabled(false)
            setButtonLabel(validateButtonLabel)
            setDisplayMode("button")
            setEmailValue("")
        })
    }

    const cancel = () => {
        setDisplayMode("button")
        setEmailValue("")
    }

    if (displayMode === "button") {
        return (
            <MDBBtn rounded outline onClick={() => {setDisplayMode("form")}}>+ {localized.buttonLabels.addEmail}</MDBBtn>
        )
    }

    return (
        <MDBInputGroup material
                       value={emailValue}
                       hint={localized.interaction.summary.editLead.newEmailAddress}
                       onChange={updateValue}
                       disabled={buttonsDisabled}
                       append={
                        <>
                            <MDBBtn onClick={triggerValidation} disabled={buttonsDisabled} rounded size="sm" color="primary">{buttonLabel}</MDBBtn>
                            <MDBBtn onClick={cancel} disabled={buttonsDisabled} rounded outline size="sm" color="secondary">Cancel</MDBBtn>
                        </>
                       } />

    )
}

export default EmailSummaryCreate