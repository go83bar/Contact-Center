import React, {Component} from 'react'
import {MDBContainer, MDBIcon, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent} from "mdbreact";
import LeadSurvey from "./LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadBooking from "./LeadBooking";
import LeadTimeline from "./LeadTimeline";
import LeadCallQueue from "./LeadCallQueue";
import LeadDocuments from "./LeadDocuments";
import LeadNotes from "./LeadNotes";
import {connect} from "react-redux";

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
            <MDBContainer fluid>
                <MDBNav tabs style={{padding: "4px"}} className={"justify-content-center"}>
                    <MDBNavItem>
                        <MDBNavLink
                            link
                            to="#"
                            active={this.state.activeItem === "1"}
                            onClick={this.toggle("1")}
                            role="tab"
                        >
                            <MDBIcon icon="poll"/> Survey
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            link
                            to="#"
                            active={this.state.activeItem === "2"}
                            onClick={this.toggle("2")}
                            role="tab"
                        >
                            <MDBIcon icon="calendar-check"/> Appointments
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            link
                            to="#"
                            active={this.state.activeItem === "3"}
                            onClick={this.toggle("3")}
                            role="tab"
                        >
                            <MDBIcon icon="calendar-plus"/> Booking
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            link
                            to="#"
                            active={this.state.activeItem === "4"}
                            onClick={this.toggle("4")}
                            role="tab"
                        >
                            <MDBIcon icon="stream"/> Timeline
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            link
                            to="#"
                            active={this.state.activeItem === "5"}
                            onClick={this.toggle("5")}
                            role="tab"
                        >
                            <MDBIcon icon="list"/> Queue
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            link
                            to="#"
                            active={this.state.activeItem === "6"}
                            onClick={this.toggle("6")}
                            role="tab"
                        >
                            <MDBIcon icon="edit"/> Notes
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            link
                            to="#"
                            active={this.state.activeItem === "7"}
                            onClick={this.toggle("7")}
                            role="tab"
                        >
                            <MDBIcon icon="file"/> Documents
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
                <MDBTabContent
                    className="card"
                    activeItem={this.state.activeItem}
                >
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
        )
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead : state.lead
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetail);
