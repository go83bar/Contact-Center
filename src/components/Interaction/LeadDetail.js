import React, {Component} from 'react'
import {MDBBox, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTooltip} from "mdbreact";
import LeadSurvey from "./SurveyTab/LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadBooking from "./LeadBooking";
import LeadTimeline from "./LeadTimeline";
import LeadCallQueue from "./LeadCallQueue";
import LeadDocuments from "./LeadDocuments";
import LeadNotes from "./LeadNotes";
import {connect} from "react-redux";
//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPoll, faCalendarCheck,faEdit,faCalendarPlus, faStream, faList, faFile, faBars} from '@fortawesome/pro-regular-svg-icons'
import SideNavItem from "./ui/SideNavItem";

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
                <MDBBox className="float-left border skin-secondary-background-color" style={{width: slim ? "50px": "100px", minHeight : "647px", fontSize:"14px"}}>
                    <MDBNav>
                        <SideNavItem active={false} icon={faBars} label={""} slim={false} onClick={this.toggleNav}/>
                        <SideNavItem active={this.state.activeItem === "1"} icon={faPoll} label={localization.survey.tabTitle} rotation={90} slim={slim} onClick={this.toggleTab("1")}/>
                        <SideNavItem active={this.state.activeItem === "2"} icon={faCalendarCheck} label={localization.appointments.tabTitle} slim={slim} onClick={this.toggleTab("2")}/>
                        <SideNavItem active={this.state.activeItem === "3"} icon={faCalendarPlus} label={localization.booking.tabTitle} slim={slim} onClick={this.toggleTab("3")}/>
                        <SideNavItem active={this.state.activeItem === "4"} icon={faStream} label={localization.timeline.tabTitle} slim={slim} onClick={this.toggleTab("4")}/>
                        <SideNavItem active={this.state.activeItem === "5"} icon={faList} label={localization.queue.tabTitle} slim={slim} onClick={this.toggleTab("5")}/>
                        <SideNavItem active={this.state.activeItem === "6"} icon={faEdit} label={localization.notes.tabTitle} slim={slim} onClick={this.toggleTab("6")}/>
                        <SideNavItem active={this.state.activeItem === "7"} icon={faFile} label={localization.documents.tabTitle} slim={slim} onClick={this.toggleTab("7")}/>
                    </MDBNav>
                </MDBBox>
                <MDBBox className="mr-3">
                    <MDBTabContent className="p-0 w-100 mh-100" activeItem={this.state.activeItem}>
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
