import React, {Component} from 'react'
import {MDBBox, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent} from "mdbreact";
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
        var slim = this.state.slim
        return (
            <MDBBox className={"h-100 w-100 p-0"}>
                <MDBBox className="float-left border skin-secondary-background-color" style={{width: slim ? "50px": "100px", fontSize:"14px"}}>
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
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "1"}
                                        onClick={this.toggleTab("1")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faPoll} rotation={90}/>{!slim && <div>Survey</div>}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "2"}
                                        onClick={this.toggleTab("2")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faCalendarCheck}/>{!slim && <div>Appointments</div>}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "3"}
                                        onClick={this.toggleTab("3")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faCalendarPlus}/>{!slim && <div>Booking</div>}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "4"}
                                        onClick={this.toggleTab("4")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faStream}/>{!slim && <div>Timeline</div>}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "5"}
                                        onClick={this.toggleTab("5")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faList}/>{!slim && <div>Queue</div>}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "6"}
                                        onClick={this.toggleTab("6")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faEdit}/>{!slim && <div>Notes</div>}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem className="w-100">
                            <MDBNavLink className={"text-align-center skin-text p-0 py-3"}
                                        link
                                        to="#"
                                        active={this.state.activeItem === "7"}
                                        onClick={this.toggleTab("7")}
                                        role="tab"
                            >
                                <FontAwesomeIcon className="skin-primary-color fa-2x" icon={faFile}/>{!slim && <div>Documents</div>}
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBNav>
                </MDBBox>
                <MDBBox>
                    <MDBTabContent className="p-3 w-100 mh-100" activeItem={this.state.activeItem}>
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
