import React, {Component} from 'react'
import {MDBBox, MDBTabContent} from "mdbreact";
import LeadSurvey from "./SurveyTab/LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadQuestions from "./LeadQuestions";
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
                        <LeadSurvey active={this.props.activeTab === 'surveys'}/>
                        <LeadQuestions active={this.props.activeTab === 'questions'}/>
                        <LeadAppointments active={this.props.activeTab === 'appointments'}/>
                        <LeadTimeline active={this.props.activeTab === 'timeline'}/>
                        <LeadCallQueue active={this.props.activeTab === '5'}/>
                        <LeadNotes active={this.props.activeTab === 'notes'}/>
                        <LeadDocuments active={this.props.activeTab === 'documents'}/>
                        <LeadDocusign active={this.props.activeTab === 'esignatures'}/>
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
