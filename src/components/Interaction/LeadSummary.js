import React, {Component} from 'react'
import {
    MDBBox,
    MDBNavItem,
    MDBNavLink,
    MDBNav,
    MDBChip,
    MDBCard,

    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem, MDBPopover, MDBPopoverHeader, MDBPopoverBody, MDBBtn

} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
//    faCircle as faCircleSolid,
    faSms,
    faEnvelope,
    faUserEdit,
    faObjectGroup,
    faUserPlus,
//    faMapMarkedAlt,
//    faIdBadge,
    faEllipsisH,
    faPhone,
    faSyncAlt,
} from "@fortawesome/pro-solid-svg-icons";
import CreateLead from "./modals/CreateLead";
import ContactPreferences from "./modals/ContactPreferences";
import EditLead from "./modals/EditLead";
import MergeLead from "./modals/MergeLead";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faCalendar} from "@fortawesome/pro-regular-svg-icons"
import Timer from 'react-compound-timer'
import { TwilioDevice } from '../../twilio/TwilioDevice'
import EmailForm from './messaging/EmailForm'
import TextForm from './messaging/TextForm'
import CallbackForm from './messaging/CallbackForm'
import moment from "moment-timezone";
import { toast } from 'react-toastify';
import Slack from '../../utils/Slack';
import Lead from "../../utils/Lead";


class LeadSummary extends Component {

    constructor(props) {
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.toggleTimezone = this.toggleTimezone.bind(this)
        this.collapseClosed = this.collapseClosed.bind(this)
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        const client = this.props.shift.clients[this.props.lead.client_index]
        const campaign = client.campaigns[this.props.lead.campaign_index]
        this.state = {
            collapsed: true,
            closed: false,
            clientName: client.name,
            campaignName: campaign.name,
            modal : undefined,
            emailVisible: false,
            textVisible: false,
            callbackVisible: false,
            timezoneVisible : false,
            isRefreshing: false

        };
    }

    toggleCollapse() {
        this.setState(this.state.collapsed ? {collapsed : false, closed : false} : {collapsed: true} )
    }
    collapseClosed() {
        this.setState({closed : true} )
    }

    openTwilio = () => {
        // make sure there is no active connection already 
        if (TwilioDevice.checkActiveConnection() === true) {
            return
        }

        // make sure lead is not opted out
        if (this.props.lead.contact_preferences.phone_calls !== true) {
            toast.error("Lead has opted out of phone calls, cannot connect to Twilio.")
            return
        }

        // make sure there's no data issues that will trip up twilio
        if (this.props.interaction.id === undefined) {
            toast.error("Twilio connection cannot be opened. Please alert dev.")
            Slack.sendMessage("Agent " + this.props.user.id + " cannot open Twilio due to interaction being undefined for lead " + this.props.lead.id)
            const interactionData = JSON.stringify(this.props.interaction)
            Slack.sendMessage("Redux Interaction object: " + interactionData)
            return
        }

        // open twilio connection in normal mode
        TwilioDevice.openAgentConnection(false)
    }

    refreshLead = () => {
        if (!this.state.isRefreshing) {
            this.setState({isRefreshing: true})
            Lead.loadLead(this.props.lead.id).then( result => {
                toast.success(this.props.localization.toast.leadSummary.leadRefreshed, {autoClose: 1000})
                this.setState({isRefreshing: false})
            }).catch( reason => {
                console.log("Refresh lead failed: ", reason)
            })
        }
    }

    toggleEmail = () => {
        if (this.props.lead.contact_preferences.emails === true)
        this.setState({emailVisible : !this.state.emailVisible})
    }
    toggleText = () => {
        if (this.props.lead.contact_preferences.texts === true)
        this.setState({textVisible : !this.state.textVisible})
    }
    toggleCallback = () => {
        if (this.props.lead.contact_preferences.phone_calls === true)
            this.setState({callbackVisible : !this.state.callbackVisible})
    }
    toggleTimezone() {
        if (this.state.timezoneVisible === false) {
            let leadTime = moment.tz(moment(), this.props.lead.details.timezone)
            leadTime = {
                "ampm": leadTime.hour() > 11 ? "pm" : "am",
                "moment": leadTime.add(leadTime.utcOffset(), 'm'),
                "zone": moment.tz.zone(this.props.lead.details.timezone).abbr(leadTime)
            }
            let times = []
            this.props.localization.interaction.timezoneChoices.forEach((timezone) => {
                if (timezone.value !== this.props.lead.details.timezone) {
                    let tzt = moment.tz(moment(), timezone.value)
                    let ampm = tzt.hour() > 11 ? "pm" : "am"
                    times.push({
                        "moment": tzt.add(tzt.utcOffset(), "m"),
                        "zone": moment.tz.zone(timezone.value).abbr(tzt),
                        ampm
                    })
                }
            })
            this.setState({timezoneVisible: !this.state.timezoneVisible, leadTime, times})
        } else {
            this.setState({timezoneVisible: !this.state.timezoneVisible, leadTime : undefined, times: undefined})
        }
    }

    showModal(modalName) {
        this.setState({modal : modalName})
    }
    closeModal() {
        this.setState({modal : undefined})
    }

    generateStatusLabel = () => {
        const client = this.props.shift.clients[this.props.lead.client_index]
        let labelClass = "text-danger"
        if (this.props.twilio.recordingPaused || !client.record_calls) labelClass = "text-success"

        let label = this.props.localization.interaction.summary.recordingActiveLabel
        if (this.props.twilio.recordingPaused) label = this.props.localization.interaction.summary.recordingPausedLabel
        if (client.record_calls === 0) label = this.props.localization.interaction.summary.callActiveLabel
        return (
            <span className={ labelClass }>
                { label }: &nbsp; 
            </span>  
        )
    }

    componentDidMount() {
        // check to see if this is an incoming call on hold
        if (this.props.preview.call_sid !== null) {
            // open twilio connection in incoming call mode
            TwilioDevice.openAgentConnection(true)
        }
    }

    render() {
        const localization = this.props.localization.interaction.summary
        const lead = this.props.lead
        const client = this.props.shift.clients[lead.client_index]

        return (
            <MDBBox className='p-0 m-0 w-100 d-flex' style={{flex:"0 53px", fontSize:"18px"}}>
                <MDBCard className='skin-border-primary rounded w-100 h-100'>
                    <MDBBox className="backgroundColorInherit border-0 p-0 m-0 px-3 w-100 d-flex justify-content-between">
                        <MDBBox>
                            <span className={"d-inline-block font-weight-bolder p-0 m-0 mt-2"} style={{fontSize:"1.5rem"}}>{lead.details.first_name} {lead.details.last_name}</span>
                            <div className="d-inline-block pl-3 pr-2 pointer" onClick={()=>this.showModal("Edit Lead")}><FontAwesomeIcon icon={faUserEdit} size={"lg"} className={"skin-secondary-color"}/></div>
                            <MDBDropdown className={"d-inline-block"}>
                                <MDBDropdownToggle nav className="px-2">
                                    <span className=""><FontAwesomeIcon icon={faEllipsisH} size={"lg"} className={"skin-secondary-color"}/></span>
                                </MDBDropdownToggle>
                                <MDBDropdownMenu className={"rounded pr-2"}>
                                    <MDBDropdownItem href="#"><div onClick={() => this.showModal("Merge Lead")}><FontAwesomeIcon icon={faObjectGroup} size={"lg"} className={"skin-primary-color pr-1"}/> {localization.mergeLead.title} </div></MDBDropdownItem>
                                    <MDBDropdownItem href="#"><div onClick={() => this.showModal("Create Lead")}><FontAwesomeIcon icon={faUserPlus} size={"lg"} className={"skin-primary-color pr-1"}/> {localization.createLead.title}</div></MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                            <div className="d-inline-block pl-3 pr-2 pointer" onClick={this.refreshLead}><FontAwesomeIcon icon={faSyncAlt} size={"lg"} spin={this.state.isRefreshing} className={this.state.isRefreshing ? "grey-text" : "skin-secondary-color"}/></div>

                        </MDBBox>
                        <div className="mt-2 pt-1 d-inline-block" style={{lineHeight:1.25}}>

                            <MDBPopover
                                placement="bottom"
                                popover
                                clickable
                                id="timezonepopper"
                                onChange={this.toggleTimezone}
                                isVisible={this.state.timezoneVisible}
                            >
                                <MDBBtn flat className={"d-inline-block f-l font-weight-bolder p-0 m-0"}>
                                    {lead.details.timezone_short}
                                </MDBBtn>
                                <div>
                                    <MDBPopoverHeader>
                                        {this.state.leadTime && <div>
                                        <Timer initialTime={this.state.leadTime.moment} formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}>
                                            <Timer.Hours formatValue={(value) => `${(value > 12 ? `${value-12}` : value)}`}/>:
                                            <Timer.Minutes />
                                        </Timer>{this.state.leadTime.ampm} {this.state.leadTime.zone}</div>
                                        }
                                    </MDBPopoverHeader>
                                    <MDBPopoverBody>
                                        {this.state.times && this.state.times.map((time,index) => {
                                            return (<div key={"tz" + index}>
                                            <Timer initialTime={time.moment} formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}>
                                                <Timer.Hours formatValue={(value) => `${(value > 12 ? `${value-12}` : value)}`}/>:
                                                <Timer.Minutes />
                                            </Timer>{time.ampm} {time.zone}</div>
                                        )
                                        })}

                                    </MDBPopoverBody>
                                </div>
                            </MDBPopover>
                            <MDBChip className={"outlineChip ml-4 mb-0"} style={{ backgroundColor: client.theme.primary, borderColor: client.theme.text, color: client.theme.text }}>{this.state.clientName}</MDBChip>
                            <MDBChip className={"outlineChip ml-1 mb-0"}>{this.state.campaignName}</MDBChip>
                            <MDBChip className={"outlineChip ml-1 mb-0" + (this.props.preview.call_sid !== null ? " green accent-2" : "")}>{this.props.preview.reason}</MDBChip>
                        </div>
                        <MDBNav className="d-flex justify-content-end float-right skin-border-primary h-100 flex-nowrap">
                            { this.props.twilio.conferenceSID && <div className="f-m border-right p-2 py-0 mt-2">{ this.generateStatusLabel() }
                                <Timer formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}>
                                    <Timer.Hours />:
                                    <Timer.Minutes />:
                                    <Timer.Seconds />
                                </Timer>
                            </div>}
                            { (this.props.twilio.leadCallSID === undefined && this.props.preview.call_sid) && <div className="f-m border-right p-2 py-0 mt-2">
                                <span className="text-danger">{ localization.incomingCallLabel }</span>
                                
                            </div>}
                            <MDBNavItem className="px-2 h-100" onClick={this.openTwilio}>
                                <MDBNavLink to="#" className={"py-0 px-2 align-middle"}>
                                    <span className="fa-layers fa-2x mt-2">
                                        <FontAwesomeIcon icon={faCircle} className={lead.contact_preferences.phone_calls === true ? "skin-primary-color" : "disabledColor"}/>
                                        <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={lead.contact_preferences.phone_calls === true ? "skin-secondary-color" : "disabledColor"}/>
                                        {this.props.twilio.conferenceSID && <span className="fa-layers-counter fa-layers-top-left red-darken-2"></span>}
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2" onClick={this.toggleCallback}>
                                <MDBNavLink to="#" className="p-0">
                                    <span className="fa-layers fa-2x mt-2 p-0 px-2">
                                        <FontAwesomeIcon icon={faCircle} className={lead.contact_preferences.phone_calls === true ? "skin-primary-color" : "disabledColor"}/>
                                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"} className={lead.contact_preferences.phone_calls === true ? "skin-secondary-color" : "disabledColor"}/>
                                        <FontAwesomeIcon icon={faPhone} transform={"shrink-12 down-1"} className={lead.contact_preferences.phone_calls === true ? "skin-secondary-color" : "disabledColor"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2" onClick={this.toggleEmail}>
                                <MDBNavLink to="#" className="p-0" disabled={lead.contact_preferences.emails !== true}>
                                    <span className="fa-layers fa-2x mt-2 p-0 px-2">
                                        <FontAwesomeIcon icon={faCircle} className={lead.contact_preferences.emails === true ? "skin-primary-color" : "disabledColor"}/>
                                        <FontAwesomeIcon icon={faEnvelope} transform={"shrink-8"} className={lead.contact_preferences.emails === true ? "skin-secondary-color" : "disabledColor"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2" onClick={this.toggleText}>
                                <MDBNavLink to="#" className="p-0" disabled={lead.contact_preferences.texts !== true}>
                                    <span className="fa-layers fa-2x mt-2 p-0 px-2">
                                        <FontAwesomeIcon icon={faCircle} className={lead.contact_preferences.texts === true ? "skin-primary-color" : "disabledColor"}/>
                                        <FontAwesomeIcon icon={faSms} transform={"shrink-8"} className={lead.contact_preferences.texts === true ? "skin-secondary-color" : "disabledColor"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="rounded-pill m-2 red-darken-2 m-1" style={{maxHeight: "37px"}} onClick={this.props.toggleEndInteraction}>
                                <MDBNavLink to="#" className="py-0 px-2 m-2 align-middle skin-text f-s font-weight-bold">
                                    {localization.endInteraction}
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                    </MDBBox>
                </MDBCard>

                {this.state.modal === "Merge Lead" && <MergeLead closeModal={this.closeModal}/>}
                {this.state.modal === "Edit Lead" && <EditLead closeModal={this.closeModal}/>}
                {this.state.modal === "Create Lead" && <CreateLead closeModal={this.closeModal}/>}
                {this.state.modal === "Contact Preferences" && <ContactPreferences closeModal={this.closeModal}/>}
                {this.state.emailVisible === true && <EmailForm toggle={this.toggleEmail} />}
                {this.state.textVisible === true && <TextForm toggle={this.toggleText} />}
                {this.state.callbackVisible === true && <CallbackForm toggle={this.toggleCallback} />}

            </MDBBox>
        )
    }

}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        preview : state.preview,
        lead : state.lead,
        shift: state.shift,
        twilio: state.twilio,
        interaction: state.interaction,
        user: state.user
    }
}

export default connect(mapStateToProps)(LeadSummary);
