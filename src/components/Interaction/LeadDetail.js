import React, {Component} from 'react'
import {MDBBox, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTooltip} from "mdbreact";
import LeadSurvey from "./LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadBooking from "./LeadBooking";
import LeadTimeline from "./LeadTimeline";
import LeadCallQueue from "./LeadCallQueue";
import LeadDocuments from "./LeadDocuments";
import LeadNotes from "./LeadNotes";
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPoll, faCalendarCheck,faEdit,faCalendarPlus, faStream, faList, faFile, faBars} from '@fortawesome/pro-regular-svg-icons'

class LeadDetail extends Component {

    constructor(props) {
        super(props);
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleTab = this.toggleTab.bind(this)
        this.state = {
            activeItem: "1",
            slim : false
        }
    }
    toggleNav()
    {
        this.setState({slim : !this.state.slim})
    }

    toggleTab = tab => () => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    }

    render() {
        let slim = this.state.slim
        let localization = this.props.localization.interaction
        return (
            <MDBBox className={"h-100 w-100 p-0"}>
                <MDBBox className="float-left border skin-secondary-background-color h-100" style={{width: slim ? "50px": "100px", fontSize:"14px"}}>
                    <MDBNav>
                        <MDBNavItem className="w-100">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "1"}
                                        onClick={this.toggleNav}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-text fa-2x" icon={faBars}/>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBTooltip material placement="right">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "1"}
                                        onClick={this.toggleTab("1")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faPoll} rotation={90}/>{!slim && <div>{localization.survey.tabTitle}</div>}
                            </MDBNavLink><div>{localization.survey.tabTitle}</div></MDBTooltip>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBTooltip material placement="right">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "2"}
                                        onClick={this.toggleTab("2")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faCalendarCheck}/>{!slim && <div>{localization.appointments.tabTitle}</div>}
                            </MDBNavLink>
                            <div>{localization.appointments.tabTitle}</div></MDBTooltip>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBTooltip material placement="right">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "3"}
                                        onClick={this.toggleTab("3")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faCalendarPlus}/>{!slim && <div>{localization.booking.tabTitle}</div>}
                            </MDBNavLink><div>{localization.booking.tabTitle}</div></MDBTooltip>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBTooltip material placement="right">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "4"}
                                        onClick={this.toggleTab("4")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faStream}/>{!slim && <div>{localization.timeline.tabTitle}</div>}
                            </MDBNavLink><div>{localization.timeline.tabTitle}</div></MDBTooltip>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBTooltip material placement="right">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "5"}
                                        onClick={this.toggleTab("5")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faList}/>{!slim && <div>{localization.queue.tabTitle}</div>}
                            </MDBNavLink><div>{localization.queue.tabTitle}</div></MDBTooltip>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBTooltip material placement="right">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "6"}
                                        onClick={this.toggleTab("6")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faEdit}/>{!slim && <div>{localization.notes.tabTitle}</div>}
                            </MDBNavLink><div>{localization.notes.tabTitle}</div></MDBTooltip>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBTooltip material placement="right">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "7"}
                                        onClick={this.toggleTab("7")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faFile}/>{!slim && <div>{localization.documents.tabTitle}</div>}
                            </MDBNavLink><div>{localization.documents.tabTitle}</div></MDBTooltip>
                        </MDBNavItem>
                    </MDBNav>
                </MDBBox>
                <MDBBox className="w-100" >
                        <MDBTabContent className="p-3 w-100" activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel">
                                <LeadSurvey/>
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel">
                                <LeadAppointments/>
                            </MDBTabPane>
                            <MDBTabPane tabId="3" role="tabpanel">
                                <LeadBooking/>
                            </MDBTabPane>
                            <MDBTabPane tabId="4" role="tabpanel">
                                <LeadTimeline/>
                            </MDBTabPane>
                            <MDBTabPane tabId="5" role="tabpanel">
                                <LeadCallQueue/>
                            </MDBTabPane>
                            <MDBTabPane tabId="6" role="tabpanel">
                                <LeadNotes/>
                            </MDBTabPane>
                            <MDBTabPane tabId="7" role="tabpanel">
                                <LeadDocuments/>
                            </MDBTabPane>
                        </MDBTabContent>
                </MDBBox>

            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead: state.lead
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetail);
