import React, {useEffect, useState} from "react"
import {MDBBtn, MDBModal, MDBModalBody, MDBModalHeader} from "mdbreact";
import {useDispatch, useSelector} from "react-redux";
import TwilioAPI from "../../api/twilioAPI";
import useSound from "use-sound";
import iPhoneRing from "../../assets/iphone_ring.wav";
import LeadAPI from "../../api/leadAPI";
import {toast} from "react-toastify";

const IncomingCallModal = () => {
    const [isDisabled, setDisabled] = useState(false)
    const incomingCallQueue = useSelector( state => state.twilio.incomingCallQueue)
    const localization = useSelector(state => state.localization.home)
    const toastMessages = useSelector( state => state.localization.toast.home)
    const dispatch = useDispatch()

    const incomingCallSoundOptions = {
        volume: 1,
        loop: true,
        interrupt: false
    }
    const [playRinging, ringingSound] = useSound(iPhoneRing, incomingCallSoundOptions)

    // set up an effect to start/stop the incoming call sound when the incoming call queue changes
    useEffect( () => {
        ringingSound.stop()
        if (incomingCallQueue.length > 0) {
            playRinging()
        }
    }, [incomingCallQueue, playRinging, ringingSound])

    // handle incoming call modal close
    const closeIncoming = () => {
        if (incomingCallQueue.length > 0) {
            dispatch({type: "TWILIO.INCOMING_CANCEL"})
        }
    }

    // handle incoming call accept
    const acceptIncoming = () => {
        setDisabled(true)

        if (ringingSound.isPlaying) {
            ringingSound.stop();
        }

        // if there's still a call on the incoming hold queue, let's fetch it and display the preview
        if (incomingCallQueue.length > 0) {
            console.log("clearing ", incomingCallQueue[0], " from the queue")
            const callSID = incomingCallQueue[0]
            TwilioAPI.clearIncomingHold(callSID).then(() => {
                dispatch({type: "TWILIO.INCOMING_CANCEL"})
                LeadAPI.getNextLead().then((response) => {
                    // the existing PHP endpoint has some irregular output for errors
                    // first check for APIException output
                    if (response.success !== true) {
                        toast.error(toastMessages.fetchIncomingError)
                        setDisabled(false)
                        closeIncoming()
                    } else {
                        // now check for empty queue situation
                        if (response.data === undefined) {
                            toast.error(toastMessages.incomingTooLate)
                            setDisabled(false)
                            closeIncoming()
                        } else {
                            // now just a helpful note to the agent if the returned preview lead is not the incoming call
                            if (response.data.call_sid !== undefined || response.data.call_sid !== callSID) {
                                toast.success(toastMessages.nextLeadNotIncoming)
                            }
                            // push preview data into redux and redirect to preview screen
                            dispatch({type: 'PREVIEW.LOAD',payload: response.data})
                        }
                    }
                }).catch((reason) => {
                    console.log("Fetch Exception: ", reason)
                    toast.error(toastMessages.fetchIncomingError)
                    setDisabled(false)
                })
            })
        }
    }

    return (
        <MDBModal isOpen={(incomingCallQueue.length > 0)} toggle={closeIncoming} centered>
            <MDBModalHeader toggle={closeIncoming}>{localization.incoming}</MDBModalHeader>
            <MDBModalBody className="p-3 d-flex justify-content-between">
                <MDBBtn rounded outline onClick={closeIncoming}>{localization.dismissIncomingButtonLabel}</MDBBtn>
                <MDBBtn rounded disabled={isDisabled} onClick={acceptIncoming}>{localization.answerIncomingButtonLabel}</MDBBtn>
            </MDBModalBody>
        </MDBModal>

    )
}

export default IncomingCallModal