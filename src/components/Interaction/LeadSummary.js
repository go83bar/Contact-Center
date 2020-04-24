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
import {faCircle, faComment, faEnvelope, faUserEdit, faObjectGroup, faUserPlus, faMapMarkedAlt,faIdBadge,faEllipsisH} from "@fortawesome/pro-solid-svg-icons";
import {faPhone, faTimes} from "@fortawesome/pro-solid-svg-icons";
import CreateLead from "./modals/CreateLead";
import ContactPreferences from "./modals/ContactPreferences";
import EditLead from "./modals/EditLead";
import MergeLead from "./modals/MergeLead";


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

    showModal(modalName) {
        this.setState({modal : modalName})
    }
    closeModal() {
        this.setState({modal : undefined})
    }
    render() {
        let localization = this.props.localization.interaction.summary
        return (
            <MDBBox className='p-0 m-0 w-100 d-flex' style={{flex:"0 53px", fontSize:"18px"}}>
                <MDBCard className='skin-border-primary rounded w-100 h-100'>
                    <MDBBox className="backgroundColorInherit border-0 p-0 m-0 px-3 w-100">
                        <span className={"d-inline-block font-weight-bolder p-0 m-0 mt-2"} style={{fontSize:"1.5rem"}}>{this.props.lead.first_name} {this.props.lead.last_name}</span>
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
                            <div className={"d-inline-block ml-5"}>
                                {this.props.lead.city !== null ? this.props.lead.city + ", " : ""} {this.props.lead.state !== null ? this.props.lead.state : ""}
                            </div>
                            <div className={"d-inline-block font-weight-bolder ml-3"}>
                                {this.props.lead.timezone_short}
                            </div>
                            <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.client} : {this.state.clientName}</MDBChip>
                            <MDBChip className={"outlineChip ml-1 mb-0"}>{this.state.campaignName}</MDBChip>
                        </div>
                        <MDBNav className={"justify-content-end float-right border-left skin-border-primary h-100"}>
                            <MDBNavItem className="px-2 skin-primary-background-color h-100" onClick={this.props.toggleCallBar}>
                                <MDBNavLink to="#" className={"py-0 px-2 align-middle"}>
                                    <span className="fa-layers fa-2x mt-2">
                                        <FontAwesomeIcon icon={faCircle} className={"skin-text"}/>
                                        <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2">
                                <MDBNavLink to="#" style={{padding:"12px"}}>
                                    <FontAwesomeIcon icon={faEnvelope} size={"lg"} className={"skin-secondary-color"}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2">
                                <MDBNavLink to="#" style={{padding:"12px"}}>
                                    <FontAwesomeIcon icon={faComment} size={"lg"} className={"skin-secondary-color"}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem className="px-2">
                                <MDBNavLink to="/" className={"py-0 px-2 align-middle"}>
                                    <span className="fa-layers fa-2x mt-2">
                                        <FontAwesomeIcon icon={faCircle} className={"text-danger"}/>
                                        <FontAwesomeIcon icon={faTimes} transform={"shrink-8"} className={"skin-text"}/>
                                    </span>
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
        shift: state.shift
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadSummary);
