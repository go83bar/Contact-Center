import React, {Component} from 'react'
import {MDBBox, MDBTabContent} from "mdbreact";
import LeadSurvey from "./SurveyTab/LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadBooking from "./LeadBooking";
import LeadTimeline from "./LeadTimeline";
import LeadCallQueue from "./LeadCallQueue";
import LeadDocuments from "./LeadDocuments";
import LeadDocusign from "./LeadDocusign";
import LeadNotes from "./NotesTab/LeadNotes";
import {connect} from "react-redux";


class LeadTabs extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <MDBBox className="d-flex flex-1 order-1 overflow-auto">
                    <MDBTabContent className="d-flex overflow-auto p-0 w-100 h-100" activeItem={this.props.activeTab}>
                        <LeadSurvey active={this.props.activeTab === '1'}/>
                        <LeadAppointments active={this.props.activeTab === '2'}/>
                        <LeadBooking active={this.props.activeTab === '3'}/>
                        <LeadTimeline active={this.props.activeTab === '4'}/>
                        <LeadCallQueue active={this.props.activeTab === '5'}/>
                        <LeadNotes active={this.props.activeTab === '6'}/>
                        <LeadDocuments active={this.props.activeTab === '7'}/>
                        <LeadDocusign active={this.props.activeTab === '8'}/>
                    </MDBTabContent>

            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead
    }
}

export default connect(mapStateToProps)(LeadTabs);
