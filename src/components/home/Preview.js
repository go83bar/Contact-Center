import React, {useEffect, useState} from "react"
import LoadingScreen from "../LoadingScreen";
import LeadAPI from "../../api/leadAPI";
import Lead from "../../utils/Lead";
import {MDBBox, MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader} from "mdbreact";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import * as moment from "moment";
import {DisplayDashboard} from "../../reducers/actions/hubActions";
import {loadInteraction} from "../../reducers/actions/interactionActions";

const Preview = () => {
    const localization = useSelector( state => state.localization.preview)
    const toastMessages = useSelector( state => state.localization.toast.interaction.preview)
    const previewData = useSelector( state => state.preview)
    const userName = useSelector( state => state.user.label_name)
    const dispatch = useDispatch()

    const [previewTime, setPreviewTime] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)

    // start fetching full lead data, and set preview time
    useEffect( () => {
        setPreviewTime(moment().utc().format('YYYY-MM-DD HH:mm:ss'))
        Lead.loadLead(previewData.lead_id).then( result => {
            setIsLoading(false)
            console.log("Lead loaded")
        }).catch( reason => {
            toast.error("Lead could not be loaded!")
            console.log("Lead load failed: ", reason)
            dispatch(DisplayDashboard())
        });
    }, [dispatch, previewData])

    // handler for start interaction button
    const startInteraction = () => {
        // prevent doubletap
        setIsLoading(true)

        // determine parameters
        let callReason = ""
        if (previewData.call_sid !== null) {
            callReason = "incoming"
        } else if (previewData.queue_id === "search") {
            callReason = "search"
        }
        const payload = {
            callQueueID: previewData.queue_id === undefined ? null : previewData.queue_id,
            leadID: previewData.lead_id,
            previewStartTime: previewTime,
            callReason: callReason
        }
        // Make API call to start interaction
        LeadAPI.startInteraction(payload).then( response => {
            if (response.success) {
                // dispatch event to populate interaction data in redux, this will also display the interaction view
                dispatch(loadInteraction(response.data.id, userName))
            } else if (response.error === "locked") {
                // the lead specified was locked to another user, this usually happens because another
                // agent was faster picking up the incoming call
                toast.error(toastMessages.leadLockedError)
                dispatch(DisplayDashboard())
            } else {
                // there was a problem getting an interaction for this lead
                toast.error(toastMessages.interactionStartError)
                dispatch(DisplayDashboard())
            }
        }).catch( error => {
            console.log("Could not start interaction: ", error)

            // Pop error and redirect to dashboard view
            toast.error(toastMessages.interactionStartError)
            dispatch(DisplayDashboard())
        })


    }

    // just display a loading screen if the preview data isn't loaded yet
    if (previewData === undefined || previewData.meta === undefined) {
        return <LoadingScreen />
    }

    // Build filtered list of preview data items
    const data = previewData.meta.filter(item => {
        const filteredFieldList = [
            "Last Contact",
            "Phase",
            "Client",
            "Region",
            "Campaign"
        ]
        return filteredFieldList.includes(item.name)
    }).map((item, i) => {
        return (
            <MDBBox key={i} className="pt-2 border-top mt-2">{item.name}: <span className="font-weight-bold skin-secondary-color">{item.value}</span></MDBBox>
        )
    })

    return (
        <MDBBox className="d-flex justify-content-center" style={{margin: "10% auto"}} >
            <MDBCard className="d-flex card-body" style={{width:"585px", height:"480px"}}>
                <MDBCardHeader className="d-flex justify-content-start backgroundColorInherit">
                    <h3>
                        <strong>{previewData.lead_name}</strong> <small className="font-italic">/ {previewData.reason}</small>
                    </h3>
                </MDBCardHeader>
                <MDBCardBody className='justify-content-start border skin-border-primary'>
                    <div>
                        <MDBBox className="pt-2 mt-2">{localization.id}: <span className="font-weight-bold skin-secondary-color">{previewData.lead_id}</span></MDBBox>
                    </div>
                    <div>
                        {data}
                    </div>
                </MDBCardBody>
                <MDBCardFooter className="d-flex justify-content-end">
                    <MDBBtn rounded className="skin-primary-background-color f-l" disabled={isLoading} onClick={startInteraction}>{localization.nextButton}</MDBBtn>
                </MDBCardFooter>
            </MDBCard>
        </MDBBox>

    )

}

export default Preview