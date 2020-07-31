import React, {Component} from 'react'
import {
    MDBBox,
    MDBNav,
    MDBNavItem,
    MDBNavLink
} from "mdbreact";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import {faCircle} from "@fortawesome/pro-light-svg-icons"
import {
    faCircle as faCircleSolid,
    faPause,
    faVoicemail,
    faRandom,
    faHandPaper,
    faTh
} from "@fortawesome/pro-solid-svg-icons"
import {connect} from "react-redux"
import { TwilioDevice } from '../../twilio/TwilioDevice'
import ProviderChoices from './modals/ProviderChoices'
import Keypad from './modals/Keypad'
import DialChoice from './modals/DialChoice'
import InteractionAPI from '../../api/interactionAPI'

class CallBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            providerChoicesVisible: false,
            dialChoiceVisible: false,
            keypadVisible: false,
            callingHours: []
        }
    }

    dialLead = () => {
        // if lead only has one number, dial that number. If they have both, pop a DialChoice modal
        let hasCell = false
        let hasHome = false
        if (this.props.lead.details.cell_phone !== undefined && this.props.lead.details.cell_phone !== "") hasCell = true
        if (this.props.lead.details.home_phone !== undefined && this.props.lead.details.home_phone !== "") hasHome = true

        if (hasCell && !hasHome) {
            TwilioDevice.dialLead("cell")
        } else if (hasHome && !hasCell) {
            TwilioDevice.dialLead("home")
        } else if (hasHome && hasCell) {
            this.setState({ dialChoiceVisible: true })
        }
    }

    answerIncoming = () => {
        let callSID = this.props.preview.call_sid
        if (this.props.twilio.leadCallSID !== "") {
            // if the incoming call happened within the interaction, the leadCallSID
            // will already be populated and we should use that
            callSID = this.props.twilio.leadCallSID
        }
        TwilioDevice.connectIncoming(callSID, this.props.twilio.conferenceOID)
    }

    holdLead = () => {
        TwilioDevice.holdLead()
    }

    unholdLead = () => {
        TwilioDevice.unholdLead()
    }

    playAutoVoicemail = () => {
        TwilioDevice.playAutoVM()
    }

    disconnectLead = () => {
        TwilioDevice.disconnectLead()

        // if there is no provider connection, also hang up the conference itself
        if (this.props.twilio.providerCallSID === "" || this.props.twilio.providerCallSID === undefined) {
            this.agentDisconnect()
        }
    }

    toggleModal = (modalKey) => {
        let newState = {}
        newState[modalKey] = !this.state[modalKey]
        this.setState(newState)
    }

    openProviderChoices = () => {
        // call api to get list of available office hours
        InteractionAPI.fetchCallingHours({ regionID: this.props.lead.region_id}).then( response => {
            // endpoint returns a naked array of calling hours ohjects
            this.setState({
                providerChoicesVisible: true,
                callingHours: response
            })
        }).catch( reason => {
            // TODO handle error
            console.log("Error fetching calling hours, ", reason)
        })
    }

    selectOffice = (officeID, officeNumber) => {
        const dialNumber = officeNumber.replace(/\D/g,'');
        this.setState({ providerChoicesVisible: false })
        TwilioDevice.holdLead()
        TwilioDevice.dialProvider(officeID, dialNumber)
    }
    
    handoff = () => {
        TwilioDevice.transferHandoff()
    }

    disconnectProvider = () => {
        TwilioDevice.disconnectProvider()
    }

    agentConnect = () => {
        TwilioDevice.openAgentConnection()
    }

    agentPauseRecording = () => {
        TwilioDevice.pauseRecording()
    }

    agentResumeRecording = () => {
        TwilioDevice.resumeRecording()
    }

    agentDisconnect = () => {
        TwilioDevice.disconnect()
    }

    render() {
        const recordingEnabled = this.props.shift.clients[this.props.lead.client_index].record_calls
        if (!this.props.twilio.callbarVisible) {
            return ""
        }
        return (
            <MDBBox className="rounded p-0 mt-2 border float-right skin-border-primary skin-primary-faint-background-color callBar" style={{flex:"0 0 180px", order:2}}>
                <MDBNav className="">
                    <div className={"font-weight-bolder p-0 pb-1 mt-1 text-align-center w-100 "}>{this.props.localized.leadLabel}<br />{this.props.twilio.leadCallStatus}</div>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadHoldButtonEnabled ? "" : " hidden")} onClick={this.holdLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faHandPaper} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.holdLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadUnHoldButtonEnabled ? "" : " hidden")} onClick={this.unholdLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="stop-icon-bg"/>
                                <FontAwesomeIcon icon={faHandPaper} transform={"shrink-10"} className="stop-icon-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.unholdLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadVoicemailButtonEnabled ? "" : " hidden")} onClick={this.playAutoVoicemail}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>

                                <FontAwesomeIcon icon={faVoicemail} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.voicemailLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadDialButtonEnabled ? "" : " hidden")} onClick={this.dialLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={"skin-text"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.dialLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadConnectIncomingButtonEnabled ? "" : " hidden")} onClick={this.answerIncoming}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={"skin-text"}/>
                            </span>
                            <span className="callBarText text-danger"><br/><strong>{this.props.localized.answerIncomingLabel}</strong></span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadDisconnectButtonEnabled ? "" : " hidden")} onClick={this.disconnectLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.hangupLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}><hr className="mt-0 mb-2 w-100 skin-primary-background-color"/>{this.props.localized.agentLabel}</div>
                    <MDBNavItem className={"w-50 pb-2" + (recordingEnabled && this.props.twilio.agentPauseButtonEnabled ? "" : " hidden")} onClick={this.agentPauseRecording}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPause} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.pauseLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (recordingEnabled && this.props.twilio.agentResumeButtonEnabled ? "" : " hidden")} onClick={this.agentResumeRecording}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="stop-icon-bg"/>
                                <FontAwesomeIcon icon={faPause} transform={"shrink-10"} className="stop-icon-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.resumeLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentDisconnectButtonEnabled ? "" : " hidden")} onClick={this.agentDisconnect}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.hangupLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentKeypadButtonEnabled ? "" : " hidden")} onClick={() => this.toggleModal("keypadVisible")}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faTh} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.keypadLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}><hr className="mt-0 mb-2 w-100 skin-primary-background-color"/>{this.props.localized.providerLabel}<br />{this.props.twilio.providerCallStatus}</div>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerDialButtonEnabled ? "" : " hidden")} onClick={this.openProviderChoices}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.dialLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerTransferButtonEnabled ? "" : " hidden")} onClick={this.handoff}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faRandom} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.transferLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerDisconnectButtonEnabled ? "" : " hidden")} onClick={this.disconnectProvider}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>{this.props.localized.hangupLabel}</span>
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>

                {this.state.providerChoicesVisible === true && <ProviderChoices data={this.state.callingHours} selectOffice={this.selectOffice} toggle={() => this.toggleModal("providerChoicesVisible")} />}
                {this.state.keypadVisible === true && <Keypad toggle={() => this.toggleModal("keypadVisible")} />}
                {this.state.dialChoiceVisible === true && <DialChoice toggle={() => this.toggleModal("dialChoiceVisible")} />}
            </MDBBox>
        )
    } 
}

const mapStateToProps = state => {
    return {
        localized: state.localization.interaction.callbar,
        localization: state.localization,
        shift: state.shift,
        lead: state.lead,
        twilio: state.twilio,
        preview: state.preview
    }
}

export default connect(mapStateToProps)(CallBar);
