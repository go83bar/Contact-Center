import React, {useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faStar as solidStar
} from "@fortawesome/pro-solid-svg-icons";
import {faStar as emptyStar} from "@fortawesome/pro-regular-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import LeadAPI from "../../../api/leadAPI";
import {setCurrentEmail, deselectEmail} from "../../../reducers/actions/interactionActions";

const EmailSummary = ({summary}) => {
    const [isCurrent, setIsCurrent] = useState(summary.is_current)
    const localized = useSelector(state => state.localization)
    const dispatch = useDispatch()

    useEffect(() => {
        setIsCurrent(summary.is_current)
    }, [summary])

    const toggleCurrent = () => {
        // this is a current summary that we want to make non-current
        if (isCurrent) {
            setIsCurrent(0)
            LeadAPI.deselectEmail(summary.id).then( response => {
                if (response.success) {
                    dispatch(deselectEmail(summary.id))
                    toast.success(localized.toast.editLead.emailNoncurrent)

                } else {
                    setIsCurrent(1)
                    toast.error(localized.toast.editLead.emailNoncurrentError)
                }
            })
            return
        }

        // if agent clicked an unusable summary, just do nothing
        if (!summary.is_usable) return

        // otherwise this is a usable, non-current email that we want to make current
        setIsCurrent(1)
        LeadAPI.setCurrentEmail(summary.id).then( response => {
            if (response.success) {
                dispatch(setCurrentEmail(summary.id))
                toast.success(localized.toast.editLead.emailCurrent)
            } else {
                setIsCurrent(0)
                toast.error(localized.toast.editLead.emailCurrentError)
            }
        })

    }

    const starClass = summary.is_usable ? "skin-primary-color pointer" : "skin-accent-color"
    const inputClass = summary.is_usable ? "" : " skin-accent-color"

    return (
        <div className="d-flex mb-2" style={{flex: "0 0 35%"}}>
            <FontAwesomeIcon icon={isCurrent === 1 && summary.is_usable ? solidStar : emptyStar}
                             onClick={toggleCurrent}
                             className={starClass + " align-self-center ml-2 mr-1"} />
            <div className={"m-0 pr-2 flex-grow-1 border-bottom border-light" + inputClass}>
                {summary.email_address}
            </div>
        </div>
    )
}

export default EmailSummary