import React, {Component} from 'react'
import {
    MDBBox,
    MDBNav,
    MDBModal,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBRow,
    MDBCol,
    MDBBtn
} from "mdbreact"
import {ToastContainer, Slide} from "react-toastify"
import LeadSummary from "./Interaction/LeadSummary"
import LeadDetail from "./Interaction/LeadDetail"
import CallBar from "./Interaction/CallBar"
import {connect} from "react-redux"
import LoadingScreen from './LoadingScreen'
import SideNavItem from "./ui/SideNavItem"
import {
    faBars,
    faCalendarCheck,
    faEdit, faFile,
    faPoll, faStream
} from "@fortawesome/pro-regular-svg-icons"
import LeadTabs from "./Interaction/LeadTabs"
import {faChevronRight, faUser} from "@fortawesome/pro-solid-svg-icons"
import moment from "moment"
import EndInteraction from "./Interaction/EndInteraction"
import "react-toastify/dist/ReactToastify.css";
import {TwilioDevice} from "../twilio/TwilioDevice";
class Interaction extends Component {

    constructor(props) {
        super(props);
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleEndInteraction = this.toggleEndInteraction.bind(this)
        this.toggleDetails = this.toggleDetails.bind(this)
        this.state = {
            endInteractionVisible : false,
            unsavedNoteModalVisible: false,
            slim : false,
            details : true,
            activeItem : "1",
            date: moment(),
            time: moment().hour(0).minute(0)
        };

    }
    
    earlyCloseWarning = (ev) => {
        ev.preventDefault()
		const confirmationMessage = this.props.localization.interaction.earlyCloseWarning

        ev.returnValue = confirmationMessage    // Gecko, Trident, Chrome 34+
		return confirmationMessage             // Gecko, WebKit, Chrome <34
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.earlyCloseWarning)
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.earlyCloseWarning)
    }

    componentDidUpdate(prevProps) {
        // we can start or stop the incoming audio ring based on changes in the incomingCallQueue length
        if (prevProps.twilio.interactionIncomingCallSID === "" && this.props.twilio.interactionIncomingCallSID !== "") {
            // incoming call has come in, fire up the audio if we haven't already
            if (this.ringAudio === undefined) {
                let src = 'https://83b-audio.s3.amazonaws.com/agent/iphone_ring.wav';
                this.ringAudio = new Audio(src)
                this.ringAudio.loop = true;
            }

            // get it playing
            this.ringAudio.play();
        } else if (prevProps.twilio.interactionIncomingCallSID !== "" && this.props.twilio.interactionIncomingCallSID === "") {
            // other way around, stop the music
            if (this.ringAudio !== undefined) {
                this.ringAudio.pause();
            }
        }
    }

    answerIncoming = () => {
        if (this.props.twilio.conferenceOID === "") {
            TwilioDevice.openAgentConnection(true)
        } else {
            TwilioDevice.connectIncoming(this.props.twilio.interactionIncomingCallSID, this.props.twilio.conferenceOID)
        }
    }

    toggleEndInteraction() {
        // do nothing if twilio connection is still active
        if (this.props.twilio.callbarVisible) return

        // pop a warning if there is unsaved note content
        if (this.props.interaction.hasUnsavedNote) {
            this.setState({ unsavedNoteModalVisible: true})
            return
        }

        // otherwise pop the endInteraction modal
        this.setState({endInteractionVisible : !this.state.endInteractionVisible})
    }

    closeUnsavedNoteModal = () => {
        this.setState({ unsavedNoteModalVisible: false })
    }

    ignoreUnsavedNote = () => {
        this.props.dispatch({type: "INTERACTION.CLEAR_UNSAVED_NOTE"})
        this.setState({ unsavedNoteModalVisible: false, endInteractionVisible: true })
    }

    toggleNav()
    {
        this.setState({slim : !this.state.slim})
    }

    toggleDetails() {
        this.setState({details : !this.state.details})
    }

    toggleTab = tab => () => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    }

    render() {
        if (this.props.lead === undefined || this.props.lead.id === undefined) {
            return <LoadingScreen />
        }

        let slim = this.state.slim
        let localization = this.props.localization.interaction

        return(
            <MDBBox className="d-flex w-100 skin-secondary-color">
                <MDBBox className="m-0 my-2 ml-2 border rounded skin-secondary-background-color" style={{flex: slim ? "0 0 50px" : "0 0 100px", order : 0,  fontSize:"14px"}}>
                    <MDBNav>
                        <SideNavItem active={false} toggle icon={faBars} label={""} slim={false} onClick={this.toggleNav}/>
                        <SideNavItem active={this.state.details} toggle toggleIcon={faChevronRight} icon={faUser} label={localization.details.tabTitle} slim={slim} onClick={this.toggleDetails}/>
                        <SideNavItem active={this.state.activeItem === "1"} icon={faPoll} label={localization.survey.tabTitle} rotation={90} slim={slim} onClick={this.toggleTab("1")}/>
                        <SideNavItem active={this.state.activeItem === "4"} icon={faStream} label={localization.timeline.tabTitle} slim={slim} onClick={this.toggleTab("4")}/>
                        <SideNavItem active={this.state.activeItem === "2"} icon={faCalendarCheck} label={localization.appointment.tabTitle} slim={slim} onClick={this.toggleTab("2")}/>
                        <SideNavItem active={this.state.activeItem === "6"} icon={faEdit} label={localization.notes.tabTitle} slim={slim} onClick={this.toggleTab("6")}/>
                        <SideNavItem active={this.state.activeItem === "7"} icon={faFile} label={localization.documents.tabTitle} slim={slim} onClick={this.toggleTab("7")}/>
                    </MDBNav>
                </MDBBox>
                <MDBBox className="d-flex m-2" style={{flex: 1, overflow:"auto", flexDirection:"column"}}>
                    <LeadSummary toggleEndInteraction={this.toggleEndInteraction} className=""/>
                    <MDBBox className="d-flex" style={{flex: 1, overflow:"auto", flexDirection:"row"}}>
                        <MDBBox className="d-flex mt-2 mr-2" style={{flex: 1, overflow:"auto", flexDirection:"column"}}>
                            {this.state.details && <LeadDetail />}
                            <LeadTabs activeTab={this.state.activeItem}/>
                        </MDBBox>
                        <CallBar />
                    </MDBBox>
                </MDBBox>
                {this.state.endInteractionVisible && <EndInteraction history={this.props.history} toggle={this.toggleEndInteraction}/>}
                <MDBModal isOpen={this.state.unsavedNoteModalVisible} toggle={this.closeUnsavedNoteModal}>
                    <MDBModalHeader>{localization.endInteraction.unsavedNoteModalHeader}</MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow className="p-2">
                            {localization.endInteraction.unsavedNoteModalBody}
                        </MDBRow>
                        <MDBModalFooter className="p-1"/>
                        <MDBRow>
                            <MDBCol size={"12"}>
                                <MDBBtn
                                    color="primary"
                                    rounded
                                    outline
                                    className="float-left"
                                    onClick={this.closeUnsavedNoteModal}
                                >
                                    {this.props.localization.buttonLabels.cancel}
                                </MDBBtn>
                                <MDBBtn
                                    color="primary"
                                    rounded
                                    className="float-right"
                                    onClick={this.ignoreUnsavedNote}
                                >
                                    {localization.endInteraction.endWithoutSavingNoteButton}
                                </MDBBtn>
                            </MDBCol>
                        </MDBRow>
                    </MDBModalBody>
                </MDBModal>
                <MDBModal isOpen={this.props.twilio.interactionIncomingCallSID !== ""} centered toggle={() => {}} keyboard={false}>
                    <MDBModalBody className="p-4 d-flex flex-column align-items-center">
                        <h3>{localization.answerInteractionIncomingTitle.replace("$", this.props.lead.details.first_name)}</h3>
                        <MDBBtn className="button danger p-1 m-3" onClick={this.answerIncoming}>{localization.answerInteractionIncomingLabel}</MDBBtn>
                    </MDBModalBody>
                </MDBModal>

                <ToastContainer
                    position="bottom-left"
                    hideProgressBar={false}
                    newestOnTop={true}
                    autoClose={5000}
                    pauseOnHover={false}
                    transition={Slide}
                />
            </MDBBox>
        )
    }

}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead : state.lead,
        twilio: state.twilio,
        interaction: state.interaction
    }
}

export default connect(mapStateToProps)(Interaction);
