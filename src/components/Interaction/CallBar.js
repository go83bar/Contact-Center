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
    faCheck,
    faCircle as faCircleSolid,
    faPause,
    faVoicemail,
    faRandom,
    faHandPaper,
    faTh
} from "@fortawesome/pro-solid-svg-icons"
import {connect} from "react-redux"
import { TwilioDevice } from '../../twilio/TwilioDevice'

class CallBar extends Component {

    dialLead = () => {
        TwilioDevice.dialLead("cell")
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
    }

    dialProvider = () => {
        TwilioDevice.dialProvider()
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

    agentShowKeypad = () => {
        TwilioDevice.showKeypad()
    }
    
    agentDisconnect = () => {
        TwilioDevice.disconnect()
    }

    render() {
        if (!this.props.twilio.callbarVisible) {
            return ""
        }
        return (
            <MDBBox className="rounded p-0 mt-2 border float-right skin-border-primary skin-primary-faint-background-color callBar" style={{flex:"0 0 180px", order:2}}>
                <MDBNav className="">
                    <div className={"font-weight-bolder p-0 pb-1 mt-1 text-align-center w-100 "}>Lead<br />{this.props.twilio.leadCallStatus}</div>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadHoldButtonEnabled ? "" : " hidden")} onClick={this.holdLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faHandPaper} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Hold</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadUnHoldButtonEnabled ? "" : " hidden")} onClick={this.unholdLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="stop-icon-bg"/>
                                <FontAwesomeIcon icon={faHandPaper} transform={"shrink-10"} className="stop-icon-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Unhold</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadVoicemailButtonEnabled ? "" : " hidden")} onClick={this.playAutoVoicemail}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>

                                <FontAwesomeIcon icon={faVoicemail} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Voicemail</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadDialButtonEnabled ? "" : " hidden")} onClick={this.dialLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={"skin-text"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Dial</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadDisconnectButtonEnabled ? "" : " hidden")} onClick={this.disconnectLead}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Hang Up</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}><hr className="mt-0 mb-2 w-100 skin-primary-background-color"/>Me</div>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentStatusButtonEnabled ? "" : " hidden")}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faCheck} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Check</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentPauseButtonEnabled ? "" : " hidden")} onClick={this.agentPauseRecording}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPause} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Pause</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentResumeButtonEnabled ? "" : " hidden")} onClick={this.agentResumeRecording}>>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="stop-icon-bg"/>
                                <FontAwesomeIcon icon={faPause} transform={"shrink-10"} className="stop-icon-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Resume</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentDisconnectButtonEnabled ? "" : " hidden")} onClick={this.agentDisconnect}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Hang Up</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentKeypadButtonEnabled ? "" : " hidden")} onClick={this.agentShowKeypad}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faTh} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Keypad</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}><hr className="mt-0 mb-2 w-100 skin-primary-background-color"/>Provider<br />{this.props.twilio.providerCallStatus}</div>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerDialButtonEnabled ? "" : " hidden")} onClick={this.dialProvider}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Dial</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerTransferButtonEnabled ? "" : " hidden")} onClick={this.handoff}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faRandom} transform={"shrink-10"} className="skin-secondary-color"/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Transfer</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerDisconnectButtonEnabled ? "" : " hidden")} onClick={this.disconnectProvider}>
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="skin-secondary-color" style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Hang Up</span>
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
            </MDBBox>
        )
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization,
        client: store.client,
        lead: store.lead,
        auth: store.auth,
        twilio: store.twilio
    }
}

export default connect(mapStateToProps)(CallBar);
