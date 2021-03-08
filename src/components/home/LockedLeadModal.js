import React, {useState} from "react"
import {MDBBox, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader} from "mdbreact"
import {useDispatch, useSelector} from "react-redux"
import AgentAPI from "../../api/agentAPI"
import {toast} from "react-toastify"
import * as moment from 'moment'
import Lead from "../../utils/Lead";
import {resumeInteraction} from "../../reducers/actions/interactionActions";

const LockedLeadModal = ({isOpen, closeFunction, leadData}) => {
    const localization = useSelector( state => state.localization.home.lockedLead)
    const clients = useSelector( state => state.shift.clients)
    const userName = useSelector( state => state.user.label_name)
    const [isWorking, setIsWorking] = useState(false)
    const dispatch = useDispatch()

    const acceptLead = () => {
        setIsWorking(true)
        if (leadData.interaction_id !== undefined) {
            // if we have an unfinished interaction, load the lead and dispatch resume action
            Lead.loadLead(leadData.lead_id).then( () => {
                dispatch(resumeInteraction(leadData.interaction_id, leadData.interaction_start, userName))
            })
        } else {
            // load preview screen as locked lead
            Lead.loadPreview(leadData.lead_id).then( () => {console.log("Preview loaded")})
        }
    }

    const declineLead = () => {
        setIsWorking(true)

        AgentAPI.declineLockedLead(leadData.lead_id).then( response => {
            if (response.success) {
                toast.success("Lead unlocked!")
                setIsWorking(false)
                closeFunction()
            } else {
                console.log(response.error)
                toast.error("Error unlocking lead! Please contact dev.")
            }
        }).catch( reason => {
            toast.error("Error unlocking lead! Please contact dev.")
            console.log(reason)
        })
    }

    // process only if we have data
    let clientName = localization.unknownClientName
    let acceptButtonLabel = localization.startButton
    let unfinishedInteraction = false
    if (leadData.lead_id !== undefined) {
        // fetch client name from store
        const leadClient = clients.find( client => client.id === leadData.client_id)
        if (leadClient) {
            clientName = leadClient.name
        }

        // couple things depend on the presence of an unfinished interaction
        if (leadData.interaction_id !== undefined) {
            unfinishedInteraction = moment.utc(leadData.interaction_start).fromNow()
            acceptButtonLabel = localization.resumeButton
        }

    }


    return (
        <MDBModal isOpen={isOpen} toggle={() => {}} centered keyboard={false}>
            <MDBModalHeader>{localization.title}</MDBModalHeader>
            <MDBModalBody className="p-4 d-flex flex-column align-items-center">
                <p>{localization.content}</p>
                <MDBBox className="pt-2 border-top mt-2">{localization.idLabel}: <span className="font-weight-bold skin-secondary-color">{leadData.lead_id}</span></MDBBox>
                <MDBBox className="pt-2 border-top mt-2">{localization.nameLabel}: <span className="font-weight-bold skin-secondary-color">{leadData.lead_name}</span></MDBBox>
                <MDBBox className="pt-2 border-top mt-2">{localization.clientLabel}: <span className="font-weight-bold skin-secondary-color">{clientName}</span></MDBBox>
                {unfinishedInteraction && <MDBBox className="pt-2 border-top mt-2">{localization.interactionLabel}: <span className="font-weight-bold skin-secondary-color">{unfinishedInteraction}</span></MDBBox>}
                <MDBBox className="d-flex flex-row justify-content-between">
                    <MDBBtn className="button danger p-3 m-3 rounded-pill" disabled={isWorking} onClick={declineLead}>{localization.declineButton}</MDBBtn>
                    <MDBBtn className="button success p-3 m-3 rounded-pill" disabled={isWorking} onClick={acceptLead}>{acceptButtonLabel}</MDBBtn>
                </MDBBox>
            </MDBModalBody>
        </MDBModal>

    )
}

export default LockedLeadModal