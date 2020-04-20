import React, {Component} from 'react'
import {
    MDBBox,
    MDBNavItem,
    MDBNavLink,
    MDBNav,
    MDBIcon,
    MDBChip,
    MDBCard,
    MDBCardBody,
    MDBCollapse,
    MDBCollapseHeader,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem

} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faComment, faEnvelope, faUserCog, faEdit, faObjectGroup, faUserPlus, faMapMarkedAlt,faIdBadge} from "@fortawesome/pro-solid-svg-icons";
import {faPhone, faTimes} from "@fortawesome/pro-solid-svg-icons";
import CreateLead from "./modals/CreateLead";
import ContactPreferences from "./modals/ContactPreferences";


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
            collapsed: false,
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
        //let localization = this.props.localization.interaction.summary
        return (
            <MDBBox className={'md-accordian p-0 w-100'}>
                <MDBCard className='mt-3 skin-border-primary rounded'>
                    <MDBCollapseHeader className={"backgroundColorInherit border-0 p-0 m-0"}>
                        <div className={"d-inline-block font-weight-bolder pl-3 pt-4"}>{this.props.lead.first_name} {this.props.lead.last_name}</div>
                        <MDBDropdown className={"d-inline-block"}>
                            <MDBDropdownToggle nav>
                                <span className=""><FontAwesomeIcon icon={faUserCog} size={"lg"} className={"skin-secondary-color"}/></span>
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className={"rounded pr-2"}>
                                <MDBDropdownItem href="#"><div><FontAwesomeIcon icon={faEdit} size={"lg"} className={"skin-primary-color pr-1"} /> Edit Lead Information</div></MDBDropdownItem>
                                <MDBDropdownItem href="#"><div><FontAwesomeIcon icon={faObjectGroup} size={"lg"} className={"skin-primary-color pr-1"}/> Merge Lead Information</div></MDBDropdownItem>
                                <MDBDropdownItem href="#"><div onClick={() => this.showModal("Create Lead")}><FontAwesomeIcon icon={faUserPlus} size={"lg"} className={"skin-primary-color pr-1"}/> Create New Lead</div></MDBDropdownItem>
                                <MDBDropdownItem href="#"><div><FontAwesomeIcon icon={faMapMarkedAlt} size={"lg"} className={"skin-primary-color pr-1"}/> Change Lead Region</div></MDBDropdownItem>
                                <MDBDropdownItem href="#"><div onClick={() => this.showModal("Contact Preferences")}><FontAwesomeIcon icon={faIdBadge} size={"lg"} className={"skin-primary-color pr-1"}/> Contact Preferences</div></MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <div className={"d-inline-block ml-5"}>
                            {this.props.lead.city !== null ? this.props.lead.city + ", " : ""} {this.props.lead.state !== null ? this.props.lead.state : ""}
                        </div>
                        <div className={"d-inline-block font-weight-bolder ml-3"}>
                            {this.props.lead.timezone_short}
                        </div>
                        <MDBChip className={"outlineChip ml-4 mb-0"}>Client: {this.state.clientName}</MDBChip>
                        <MDBChip className={"outlineChip ml-1 mb-0"}>{this.state.campaignName}</MDBChip>

                        <MDBNav className={"justify-content-end float-right border-left skin-border-primary " + (!this.state.closed && "border-bottom ")}>
                            <MDBNavItem className={"skin-primary-background-color"} onClick={this.props.toggleCallBar}>
                                <MDBNavLink to="#" className={"py-0 px-2 align-middle"}>
                                    <span className="fa-layers fa-2x mt-2">
                                        <FontAwesomeIcon icon={faCircle} className={"skin-text"}/>
                                        <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#" className={"py-3 px-3"}>
                                    <FontAwesomeIcon icon={faEnvelope} size={"lg"} className={"skin-secondary-color"}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#" className={"py-3 px-3"}>
                                    <FontAwesomeIcon icon={faComment} size={"lg"} className={"skin-secondary-color"}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#" className={"py-0 px-2 align-middle"}>
                                    <span className="fa-layers fa-2x mt-2">
                                        <FontAwesomeIcon icon={faCircle} className={"text-danger"}/>
                                        <FontAwesomeIcon icon={faTimes} transform={"shrink-8"} className={"skin-text"}/>
                                    </span>
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBNav className={"justify-content-end float-right border-0 px-4 mr-2 pt-4"} onClick={this.toggleCollapse}>
                            <MDBIcon size={"lg"} icon={this.state.collapsed === true ? 'angle-up' : 'angle-down'} />
                        </MDBNav>

                    </MDBCollapseHeader>
                    <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} onClosed={this.collapseClosed}>
                        <MDBCardBody className={"px-3"}>
                            Pariatur cliche reprehenderit, enim eiusmod high life accusamus
                            terry richardson ad squid. 3 wolf moon officia aute, non
                            cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
                            laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a
                            bird on it squid single-origin coffee nulla assumenda shoreditch
                            et. Nihil anim keffiyeh helvetica, craft beer.
                        </MDBCardBody>
                    </MDBCollapse>
                </MDBCard>

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
