import React, {Component} from 'react'
import {MDBBox, MDBTabPane, MDBTabContent} from "mdbreact";
import LeadSurvey from "./SurveyTab/LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadBooking from "./LeadBooking";
import LeadTimeline from "./LeadTimeline";
import LeadCallQueue from "./LeadCallQueue";
import LeadDocuments from "./LeadDocuments";
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
                        {this.props.activeTab === '1' && <LeadSurvey/>}
                        {this.props.activeTab === '2' &&  <LeadAppointments/>}
                        {this.props.activeTab === '3' && <LeadBooking/>}
                        {this.props.activeTab === '4' && <LeadTimeline/>}
                        {this.props.activeTab === '5' && <LeadCallQueue/>}
                        {this.props.activeTab === '6' &&  <LeadNotes/>}
                        {this.props.activeTab === '7' && <LeadDocuments/>}
                    </MDBTabContent>

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

export default connect(mapStateToProps, mapDispatchToProps)(LeadTabs);
