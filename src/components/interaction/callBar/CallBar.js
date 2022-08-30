import React, {Component} from 'react'
import {MDBBox, MDBNav, MDBNavItem, MDBNavLink} from "mdbreact";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import {faCircle} from "@fortawesome/pro-light-svg-icons"
import {
    faCheck,
    faCircle as faCircleSolid,
    faHandPaper,
    faPause,
    faRandom,
    faTh,
    faVoicemail
} from "@fortawesome/pro-solid-svg-icons"
import {connect} from "react-redux"
import {TwilioDevice} from '../../../twilio/TwilioDevice'
import ProviderChoices from './ProviderChoices'
import Keypad from './Keypad'
import DialChoice from './DialChoice'
import InteractionAPI from '../../../api/interactionAPI'
import TwilioAPI from "../../../api/twilioAPI"
import {toast} from 'react-toastify'
import {callConnected, callDisconnected, callRinging, callBusy, setProviderExtension} from "../../../twilio/actions";

class CallBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            checkStatusOutlineColor: "skin-primary-color",
            checkStatusTextColor: "skin-primary-color",
            checkStatusLabel: props.localization.interaction.callbar.checkStatusLabel,
            checkStatusDisabled: false,
            connectIncomingIconColor: "white-text",
            connectIncomingTextColor: "text-danger",
            connectIncomingLabel: props.localization.interaction.callbar.connectIncomingLabel,
            connectIncomingDisabled: false,
            dialLeadDisabled: false,
            holdLeadDisabled: false,
            unholdLeadDisabled: false,
            handoffDisabled: false,
            disconnectLeadDisabled: false,
            disconnectProviderDisabled: false,
            pauseRecordingDisabled: false,
            resumeRecordingDisabled: false,
            autovmDisabled: false,
            providerChoicesVisible: false,
            dialChoiceVisible: false,
            keypadVisible: false,
            callingHours: []
        }
    }

    checkStatus = () => {
        // do nothing if the button is in disabled state
        if (this.state.checkStatusDisabled) {
            return
        }

        const disabledState = {
            checkStatusOutlineColor: "grey-text",
            checkStatusTextColor: "grey-text",
            checkStatusLabel: this.props.localization.interaction.callbar.checkingStatusLabel,
            checkStatusDisabled: true
        }

        const enabledState = {
            checkStatusOutlineColor: "skin-primary-color",
            checkStatusTextColor: "skin-secondary-color",
            checkStatusLabel: this.props.localization.interaction.callbar.checkStatusLabel,
            checkStatusDisabled: false
        }

        this.setState(disabledState)

        TwilioAPI.checkStatus(this.props.interaction.id).then( response => {
            if (response.success) {
                // dispatch the current status action for each returned connection
                if (response.connections !== undefined) {
                    response.connections.forEach( callData => {
                        switch (callData.call_status) {
                            case "busy":
                                this.props.dispatch(callBusy(callData.call_party))
                                break;

                            case "ringing":
                                this.props.dispatch(callRinging(callData.call_party))
                                break

                            case "in-progress":
                                this.props.dispatch(callConnected(callData.call_sid, callData.call_party))
                                break

                            case "canceled":
                            case "completed":
                                this.props.dispatch(callDisconnected(callData.call_party))
                                break

                            default:
                                console.log(`RECEIVED UNKNOWN CALL STATUS ${callData.call_status} FOR ${callData.call_party} CALL`)

                        }
                    })
                }
                console.log("Status check successful")
                toast.success(this.props.localization.toast.twilio.checkStatusUpdated)
            } else {
                console.log("Status check failed:", response)
                toast.error(this.props.localization.toast.twilio.checkStatusFailed)
            }
            // either way, re-enable the button
            this.setState(enabledState)

        }).catch (error => {
            // transport error, pop message and re-enable button
            console.log("Caught some shit", error)
            toast.error(this.props.localization.toast.twilio.checkStatusFailed)
            this.setState(enabledState)
        })
    }

    dialLead = () => {
        // check for doubletap
        if (this.state.callLeadDisabled) {
            console.log("nope")
            return
        }

        // set the doubletap protection
        this.setState({callLeadDisabled: true})

        // if lead only has one number, dial that number. If they have both, pop a DialChoice modal
        let hasCell = false
        let hasHome = false
        const cellPhone = this.props.lead.details.cell_phone
        const homePhone = this.props.lead.details.home_phone
        if (cellPhone !== undefined && cellPhone !== "" && cellPhone !== null) hasCell = true
        if (homePhone !== undefined && homePhone !== "" && homePhone !== null) hasHome = true

        // this shouldn't happen but who knows
        if (!hasHome && !hasCell) {
            toast(this.props.localization.toast.twilio.noPhoneNumber)
            this.setState({callLeadDisabled: false})
            return
        }

        if (hasHome && hasCell) {
            this.setState({ dialChoiceVisible: true })
        } else {
            let dialOption = "home"
            if (hasCell && !hasHome) {
                dialOption = "cell"
            }
            this.performDial(dialOption)
        }
    }

    performDial = (dialOption) => {
        TwilioDevice.dialLead(dialOption).then( response => {
            this.setState({callLeadDisabled: false})
        })
    }

    answerIncoming = () => {
        // do nothing if the button is in disabled state
        if (this.state.connectIncomingDisabled) {
            return
        }

        const disabledState = {
            connectIncomingTextColor: "grey-text",
            connectIncomingIconColor: "grey-text",
            connectIncomingLabel: this.props.localization.interaction.callbar.connectingIncomingLabel,
            connectIncomingDisabled: true
        }

        const enabledState = {
            connectIncomingTextColor: "text-danger",
            connectIncomingIconColor: "skin-text",
            connectIncomingLabel: this.props.localization.interaction.callbar.connectIncomingLabel,
            connectIncomingDisabled: false,
        }

        this.setState(disabledState)
        let callSID = this.props.preview.call_sid
        if (this.props.twilio.leadCallSID !== "") {
            // if the incoming call happened within the interaction, the leadCallSID
            // will already be populated and we should use that
            callSID = this.props.twilio.leadCallSID
        }
        TwilioDevice.connectIncoming(callSID, this.props.twilio.conferenceOID).finally( result => {
            // we only need to re-enable the button if there was an issue
            this.setState(enabledState)
            console.log("incoming connected: ", result)
        })
    }

    holdLead = () => {
        if (this.state.holdLeadDisabled) {
            return
        }
        this.setState({holdLeadDisabled: true})
        TwilioDevice.holdLead().then( response => {
            this.setState({holdLeadDisabled: false})
        })
    }

    unholdLead = () => {
        if (this.state.unholdLeadDisabled) {
            return
        }
        this.setState({unholdLeadDisabled: true})
        TwilioDevice.unholdLead().then( response => {
            this.setState({unholdLeadDisabled: false})
        })
    }

    playAutoVoicemail = () => {
        if (this.state.autovmDisabled) {
            return
        }
        this.setState({autovmDisabled: true})
        TwilioDevice.playAutoVM().then( response => {
            this.setState({autovmDisabled: false})
        })
    }

    disconnectLead = () => {
        if (this.state.disconnectLeadDisabled) {
            return
        }
        this.setState({disconnectLeadDisabled: true})
        TwilioDevice.disconnectLead().then( response => {
            // if there is no provider connection, also hang up the conference itself
            if (this.props.twilio.providerCallSID === "" || this.props.twilio.providerCallSID === undefined) {
                this.agentDisconnect()
            }
            this.setState({disconnectLeadDisabled: false})
        })

    }

    toggleModal = (modalKey) => () => {
        let newState = {}
        newState[modalKey] = !this.state[modalKey]
        this.setState(newState)
    }

    openProviderChoices = () => {
        // call api to get list of available office hours
        InteractionAPI.fetchCallingHours({ regionID: this.props.lead.region_id}).then( response => {
            // if current lead has a preferred office, set that in front of the result array
            const preferredOfficeMeta = this.props.lead.meta.find(meta => {
                return meta.key === "preferred_office"
            })
            if (preferredOfficeMeta !== undefined) {
                const preferredOfficeID = parseInt(preferredOfficeMeta.value)
                response.sort( (a, b) => {
                    if (a.office.id === preferredOfficeID) return -1;
                    else if (b.office.id === preferredOfficeID) return 1;
                    return a.office.name < b.office.name ? -1 : 1;
                })
            }

            // set response hours into state for display
            this.setState({
                providerChoicesVisible: true,
                callingHours: response
            })
        }).catch( reason => {
            // TODO handle error
            console.log("Error fetching calling hours, ", reason)
        })
    }

    selectOffice = (officeID, officeNumber, officeExtension) => {
        const dialNumber = officeNumber.replace(/\D/g,'');
        this.setState({ providerChoicesVisible: false })

        // automatically put the lead on hold, if necessary
        if (this.props.twilio.leadCallSID !== "") TwilioDevice.holdLead()

        TwilioDevice.dialProvider(officeID, dialNumber)
        this.props.dispatch(setProviderExtension(officeExtension))
    }
    
    handoff = () => {
        if (this.state.handoffDisabled) {
            return
        }
        this.setState({handoffDisabled: true})
        TwilioDevice.transferHandoff().then( response => {
            this.setState({handoffDisabled: false})
        })
    }

    disconnectProvider = () => {
        if (this.state.disconnectProviderDisabled) {
            return
        }
        this.setState({disconnectProviderDisabled: true})
        TwilioDevice.disconnectProvider().then( response => {
            this.setState({disconnectProviderDisabled: false})
        })
    }

    agentConnect = () => {
        TwilioDevice.openAgentConnection()
    }

    agentPauseRecording = () => {
        if (this.state.pauseRecordingDisabled) {
            return
        }
        this.setState({pauseRecordingDisabled: true})
        TwilioDevice.pauseRecording().then( response => {
            this.setState({pauseRecordingDisabled: false})
        })
    }

    agentResumeRecording = () => {
        if (this.state.resumeRecordingDisabled) {
            return
        }
        this.setState({resumeRecordingDisabled: true})
        TwilioDevice.resumeRecording().then( response => {
            this.setState({resumeRecordingDisabled: false})
        })
    }

    agentDisconnect = () => {
        TwilioDevice.disconnect()
    }

    render() {
        const recordingEnabled = this.props.lead.client.record_calls
        if (!this.props.twilio.callbarVisible) {
            return ""
        }

        const generateConnectionClass = (callSID) => {
            let connectionClass = "w-100 rounded d-flex flex-wrap"
            if (callSID !== "") {
                connectionClass = connectionClass + " skin-callbar-background-lighten"
            }

            return connectionClass
        }

        const generateConnectionLabel = (callStatus) => {
            let label = this.props.localized.callStatuses[callStatus]
            if (label === undefined) label = "Unknown Status"
            return label
        }

        return (
            <MDBBox className="border rounded p-0 mt-2 float-right skin-border-primary skin-callbar-background-color callBar" style={{flex:"0 0 180px", order:2}}>
                <MDBNav className="">
                    <MDBBox className={generateConnectionClass(this.props.twilio.leadCallSID)}>
                        <div className={"font-weight-bolder p-0 pb-1 mt-1 text-align-center w-100 "}>{this.props.localized.leadLabel}<br />{generateConnectionLabel(this.props.twilio.leadCallStatus)}</div>
                        <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadHoldButtonVisible ? "" : " hidden")} onClick={this.holdLead}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-icon-darken"/>
                                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faHandPaper} transform={"shrink-10"} className="skin-primary-color"/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.holdLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadUnHoldButtonVisible ? "" : " hidden")} onClick={this.unholdLead}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-danger-background-lighten"/>
                                    <FontAwesomeIcon icon={faHandPaper} transform={"shrink-10"} className="skin-callbar-danger-color"/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.unholdLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.leadVoicemailButtonVisible && this.props.twilio.autoVoicemailURL ? "" : " hidden")} onClick={this.playAutoVoicemail}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-icon-darken"/>
                                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faVoicemail} transform={"shrink-10"} className="skin-primary-color"/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.voicemailLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadDialButtonVisible ? "" : " hidden")} onClick={this.dialLead}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={"white-text"}/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.dialLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadConnectIncomingButtonEnabled ? "" : " hidden")} onClick={this.answerIncoming}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={this.state.connectIncomingIconColor}/>
                                </span>
                                <span className={"callBarText " + this.state.connectIncomingTextColor}><br/><strong>{this.state.connectIncomingLabel}</strong></span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.leadDisconnectButtonVisible ? "" : " hidden")} onClick={this.disconnectLead}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-danger-color"/>
                                    <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="white-text" style={{fontSize:"18px"}}/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.hangupLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBBox>

                    <MDBBox className="w-100 d-flex flex-wrap skin-callbar-background-lighten">
                        <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}><hr className="mt-0 mb-2 w-100 skin-primary-background-color"/>{this.props.localized.agentLabel}</div>
                        <MDBNavItem className={"w-50 pb-2" + (recordingEnabled && this.props.twilio.agentPauseButtonVisible ? "" : " hidden")} onClick={this.agentPauseRecording}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-icon-darken"/>
                                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faPause} transform={"shrink-10"} className="skin-primary-color"/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.pauseLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-50 pb-2" + (recordingEnabled && this.props.twilio.agentResumeButtonVisible ? "" : " hidden")} onClick={this.agentResumeRecording}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-danger-background-lighten"/>
                                    <FontAwesomeIcon icon={faPause} transform={"shrink-10"} className="skin-callbar-danger-color"/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.resumeLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentDisconnectButtonVisible ? "" : " hidden")} onClick={this.agentDisconnect}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-danger-color"/>
                                    <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="white-text" style={{fontSize:"18px"}}/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.hangupLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-50 pb-2" + (this.props.twilio.agentKeypadButtonVisible ? "" : " hidden")} onClick={this.toggleModal("keypadVisible")}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-icon-darken"/>
                                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faTh} className="skin-primary-color" style={{fontSize:"20px"}}/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.keypadLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-50 pb-2"} onClick={this.checkStatus}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-icon-darken"/>
                                    <FontAwesomeIcon icon={faCircle} className={this.state.checkStatusOutlineColor}/>
                                    <FontAwesomeIcon icon={faCheck} className={this.state.checkStatusTextColor} style={{fontSize:"19px"}}/>
                                </span>
                                <span className={"callBarText " + this.state.checkStatusTextColor}><br/>{this.state.checkStatusLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBBox>

                    <MDBBox className={generateConnectionClass(this.props.twilio.providerCallSID)}>
                        <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}>
                            <hr className="mt-0 mb-2 w-100 skin-primary-background-color"/>
                            {this.props.localized.providerLabel}<br />
                            {generateConnectionLabel(this.props.twilio.providerCallStatus)}
                            {this.props.twilio.providerExtension !== "" && <React.Fragment>
                                <br />
                                {this.props.localized.providerExtensionLabel} {this.props.twilio.providerExtension}
                            </React.Fragment>}
                        </div>
                        <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerDialButtonVisible ? "" : " hidden")} onClick={this.openProviderChoices}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className="white-text"/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.dialLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerTransferButtonVisible ? "" : " hidden")} onClick={this.handoff}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-icon-darken"/>
                                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faRandom} transform={"shrink-10"} className="skin-primary-color"/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.transferLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className={"w-100 pb-2"+ (this.props.twilio.providerDisconnectButtonVisible ? "" : " hidden")} onClick={this.disconnectProvider}>
                            <MDBNavLink to="#" className={"text-align-center p-0"}>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-callbar-danger-color"/>
                                    <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className="white-text" style={{fontSize:"18px"}}/>
                                </span>
                                <span className="callBarText skin-secondary-color"><br/>{this.props.localized.hangupLabel}</span>
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBBox>
                </MDBNav>

                {this.state.providerChoicesVisible === true && <ProviderChoices data={this.state.callingHours} selectOffice={this.selectOffice} toggle={this.toggleModal("providerChoicesVisible")} />}
                {this.state.keypadVisible === true && <Keypad toggle={this.toggleModal("keypadVisible")} />}
                {this.state.dialChoiceVisible === true && <DialChoice toggle={this.toggleModal("dialChoiceVisible")} dial={this.performDial} />}
            </MDBBox>
        )
    } 
}

const mapStateToProps = state => {
    return {
        localized: state.localization.interaction.callbar,
        localization: state.localization,
        interaction: state.interaction,
        shift: state.shift,
        lead: state.lead,
        twilio: state.twilio,
        preview: state.preview
    }
}

export default connect(mapStateToProps)(CallBar);
