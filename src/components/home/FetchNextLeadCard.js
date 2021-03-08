import React, {useState} from "react"
import LeadAPI from "../../api/leadAPI";
import {MDBBox, MDBCard} from "mdbreact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faHeadphones} from "@fortawesome/pro-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

const FetchNextLeadCard = () => {
    const buttonLabel = useSelector(state => state.localization.home.fetchNextButtonLabel)
    const toastMessages = useSelector(state => state.localization.toast.home)
    const dispatch = useDispatch()
    const [isDisabled, setIsDisabled] = useState(false)

    const handleClick = () => {
        // prevent doubletap
        if (isDisabled) {
            return
        }

        setIsDisabled(true)
        // fetch preview data for next lead in user's queue
        LeadAPI.getNextLead().then((response) => {
            // the existing PHP endpoint has some irregular output for errors
            // first check for APIException output
            if (response.success !== true) {
                console.log("Fetch Response: ", response)
                toast.error(toastMessages.fetchQueueError)
                setIsDisabled(false)
            } else {
                // now check for empty queue situation
                if (response.data === undefined) {
                    toast.error(toastMessages.emptyQueueError)
                    setIsDisabled(false)
                } else {
                    // push preview data into redux and redirect to preview screen
                    dispatch({type: 'PREVIEW.LOAD',payload: response.data})
                }
            }
        }).catch((reason) => {
            console.log("Fetch Exception: ", reason)
            toast.error(toastMessages.fetchQueueError)
            setIsDisabled(false)
        })
    }

    return (
        <MDBCard key="fetch" className="shadow-sm mt-2 px-2 py-3">
            <MDBBox onClick={handleClick}
                  className="d-flex skin-secondary-color align-items-center mr-4 pointer">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faHeadphones} transform={"shrink-8"}
                                                     className={"skin-text"}/>
                                </span>
                <span className="ml-3">{buttonLabel}</span>
            </MDBBox>
        </MDBCard>
    )
}

export default FetchNextLeadCard