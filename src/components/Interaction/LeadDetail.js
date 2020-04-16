import React, {Component} from 'react'
import {MDBContainer, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent} from "mdbreact";
import LeadSurvey from "./LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadBooking from "./LeadBooking";
import LeadTimeline from "./LeadTimeline";
import LeadCallQueue from "./LeadCallQueue";
import LeadDocuments from "./LeadDocuments";
import LeadNotes from "./LeadNotes";
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPoll, faCalendarCheck,faEdit,faCalendarPlus, faStream, faList, faFile, faBars} from '@fortawesome/pro-solid-svg-icons'
class LeadDetail extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this)
        this.state = {
            activeItem: "1"
        }
    }

    toggle = tab => () => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    }

    render() {
        return (
            <MDBContainer fluid className={"h-100 p-0"}>
                <MDBContainer fluid className="d-flex flex-row p-0">
                <MDBNav className="float-left border skin-secondary-background-color" style={{width: "100px", fontSize:"14px"}}>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text p-3"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "1"}
                                    onClick={this.toggle("1")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-text fa-lg" icon={faBars}/>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "1"}
                                    onClick={this.toggle("1")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-primary-color fa-lg" icon={faPoll}/><br/>Survey
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "2"}
                                    onClick={this.toggle("2")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-primary-color fa-lg" icon={faCalendarCheck}/><br/>Appointments
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "3"}
                                    onClick={this.toggle("3")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-primary-color fa-lg" icon={faCalendarPlus}/><br/>Booking
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "4"}
                                    onClick={this.toggle("4")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-primary-color fa-lg" icon={faStream}/><br/>Timeline
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "5"}
                                    onClick={this.toggle("5")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-primary-color fa-lg" icon={faList}/><br/>Queue
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "6"}
                                    onClick={this.toggle("6")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-primary-color fa-lg" icon={faEdit}/><br/>Notes
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100">
                        <MDBNavLink className={"text-align-center skin-text"}
                                    link
                                    to="#"
                                    active={this.state.activeItem === "7"}
                                    onClick={this.toggle("7")}
                                    role="tab"
                        >
                            <FontAwesomeIcon className="skin-primary-color fa-lg" icon={faFile}/><br/>Documents
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
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
                </MDBContainer>
            </MDBContainer>
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
