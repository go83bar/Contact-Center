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
    MDBDropdownItem

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
    faMapMarkedAlt,
    faIdBadge,
    faEllipsisH,
    faPhone
} from "@fortawesome/pro-solid-svg-icons";
import CreateLead from "./modals/CreateLead";
import ContactPreferences from "./modals/ContactPreferences";
import EditLead from "./modals/EditLead";
import MergeLead from "./modals/MergeLead";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faCalendar} from "@fortawesome/pro-regular-svg-icons"
import Timer from 'react-compound-timer'
import { TwilioDevice } from '../../twilio/TwilioDevice'


class LeadSummary extends Component {

    constructor(props) {
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this)
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
            modal : undefined

        };
    }

    toggleCollapse() {
        this.setState(this.state.collapsed ? {collapsed : false, closed : false} : {collapsed: true} )
    }
    collapseClosed() {
        this.setState({closed : true} )
    }

    openTwilio = () => {
        TwilioDevice.openAgentConnection()
    }

    showModal(modalName) {
        this.setState({modal : modalName})
    }
    closeModal() {
        this.setState({modal : undefined})
    }
    render() {
        let localization = this.props.localization.interaction.summary
        let lead = this.props.lead
        return (
            <MDBBox className='p-0 m-0 w-100 d-flex' style={{flex:"0 53px", fontSize:"18px"}}>
                <MDBCard className='skin-border-primary rounded w-100 h-100'>
                    <MDBBox className="backgroundColorInherit border-0 p-0 m-0 px-3 w-100">
                        <span className={"d-inline-block font-weight-bolder p-0 m-0 mt-2"} style={{fontSize:"1.5rem"}}>{lead.details.first_name} {lead.details.last_name}</span>
                        <div className="d-inline-block pl-3 pr-2" onClick={()=>this.showModal("Edit Lead")}><FontAwesomeIcon icon={faUserEdit} size={"lg"} className={"skin-secondary-color"}/></div>
                        <MDBDropdown className={"d-inline-block"}>
                            <MDBDropdownToggle nav className="px-2">
                                <span className=""><FontAwesomeIcon icon={faEllipsisH} size={"lg"} className={"skin-secondary-color"}/></span>
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className={"rounded pr-2"}>
                                <MDBDropdownItem href="#"><div onClick={() => this.showModal("Merge Lead")}><FontAwesomeIcon icon={faObjectGroup} size={"lg"} className={"skin-primary-color pr-1"}/> {localization.mergeLead.title} </div></MDBDropdownItem>
                                <MDBDropdownItem href="#"><div onClick={() => this.showModal("Create Lead")}><FontAwesomeIcon icon={faUserPlus} size={"lg"} className={"skin-primary-color pr-1"}/> {localization.createLead.title}</div></MDBDropdownItem>
                                <MDBDropdownItem href="#"><div><FontAwesomeIcon icon={faMapMarkedAlt} size={"lg"} className={"skin-primary-color pr-1"}/> {localization.changeRegion.title}</div></MDBDropdownItem>
                                <MDBDropdownItem href="#"><div onClick={() => this.showModal("Contact Preferences")}><FontAwesomeIcon icon={faIdBadge} size={"lg"} className={"skin-primary-color pr-1"}/> {localization.contactPreferences.title}</div></MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <div className="d-inline-block" style={{lineHeight:1.25}}>
                            <div className={"d-inline-block font-weight-bolder ml-3"}>
                                {lead.details.timezone_short}
                            </div>
                            <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.client} : {this.state.clientName}</MDBChip>
                            <MDBChip className={"outlineChip ml-1 mb-0"}>{this.state.campaignName}</MDBChip>
                        </div>
                        <MDBNav className="justify-content-end float-right skin-border-primary h-100">
                            { this.props.twilio.conferenceSID && <div className="f-m border-right p-2 py-0 mt-2"><span className="text-danger">Recording: </span>
                                <Timer formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}>
                                    <Timer.Hours />:
                                    <Timer.Minutes />:
                                    <Timer.Seconds />
                                </Timer>
                            </div>}
                            <MDBNavItem className="px-2 h-100" onClick={this.openTwilio}>
                                <MDBNavLink to="#" className={"py-0 px-2 align-middle"}>
                                    <span className="fa-layers fa-2x mt-2">
                                        <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                        <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                        {true && <span className="fa-layers-counter fa-layers-top-left red-darken-2"></span>}
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2" onClick={this.props.toggleCallback}>
                                <MDBNavLink to="#" className="p-0">
                                    <span className="fa-layers fa-2x mt-2 p-0 px-2">
                                        <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                        <FontAwesomeIcon icon={faPhone} transform={"shrink-12 down-1"} className={"skin-secondary-color"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2" onClick={this.props.toggleEmail}>
                                <MDBNavLink to="#" className="p-0" disabled={lead.contact_preferences.emails !== true}>
                                    <span className="fa-layers fa-2x mt-2 p-0 px-2">
                                        <FontAwesomeIcon icon={faCircle} className={lead.contact_preferences.emails === true ? "skin-primary-color" : "disabledColor"}/>
                                        <FontAwesomeIcon icon={faEnvelope} transform={"shrink-8"} className={lead.contact_preferences.emails === true ? "skin-secondary-color" : "disabledColor"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2" onClick={this.props.toggleText}>
                                <MDBNavLink to="#" className="p-0" disabled={lead.contact_preferences.texts !== true}>
                                    <span className="fa-layers fa-2x mt-2 p-0 px-2">
                                        <FontAwesomeIcon icon={faCircle} className={lead.contact_preferences.texts === true ? "skin-primary-color" : "disabledColor"}/>
                                        <FontAwesomeIcon icon={faSms} transform={"shrink-8"} className={lead.contact_preferences.texts === true ? "skin-secondary-color" : "disabledColor"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="rounded-pill m-2 red-darken-2 m-1" onClick={this.props.toggleEndInteraction}>
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
            </MDBBox>
        )
    }

}
const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead : state.lead,
        shift: state.shift,
        twilio: state.twilio
    }
}

export default connect(mapStateToProps)(LeadSummary);
