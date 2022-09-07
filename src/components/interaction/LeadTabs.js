import React, { Component } from "react";
import { MDBBox, MDBTabContent } from "mdbreact";
import LeadSurvey from "./surveyTab/LeadSurvey";
import LeadAppointments from "./appointmentsTab/LeadAppointments";
import LeadQuestions from "./questionsTab/LeadQuestions";
import LeadTimeline from "./timelineTab/LeadTimeline";
import LeadDocuments from "./documentsTab/LeadDocuments";
import LeadDocusign from "./docusignTab/LeadDocusign";
import LeadNotes from "./notesTab/LeadNotes";
import { connect } from "react-redux";
import LeadRewards from "./rewardsTab/LeadRewards";
import LeadLabOrders from "./labOrdersTab/LeadLabOrders";

class LeadTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <MDBBox className="d-flex flex-1 order-1 overflow-auto">
        <MDBTabContent
          className="d-flex overflow-auto p-0 w-100 h-100"
          activeItem={this.props.activeTab}
        >
          <LeadSurvey active={this.props.activeTab === "surveys"} />
          <LeadQuestions active={this.props.activeTab === "questions"} />
          <LeadAppointments active={this.props.activeTab === "appointments"} />
          <LeadTimeline active={this.props.activeTab === "timeline"} />
          <LeadNotes active={this.props.activeTab === "notes"} />
          <LeadDocuments active={this.props.activeTab === "documents"} />
          <LeadDocusign active={this.props.activeTab === "esignatures"} />
          <LeadRewards active={this.props.activeTab === "rewards"} />
          <LeadLabOrders active={this.props.activeTab === "lab orders"} />
        </MDBTabContent>
      </MDBBox>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    lead: state.lead,
  };
};

export default connect(mapStateToProps)(LeadTabs);
