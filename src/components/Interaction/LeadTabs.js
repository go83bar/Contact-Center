import React, {Component} from 'react'
import {MDBBox, MDBTabContent} from "mdbreact";
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
        var activeTab
        switch(this.props.activeTab) {
            case '1' :
                activeTab = <LeadSurvey/>
                break
            case '2' :
                activeTab = <LeadAppointments/>
                break
            case '3' :
                activeTab = <LeadBooking/>
                break
            case '4' :
                activeTab = <LeadTimeline/>
                break
            case '5' :
                activeTab = <LeadCallQueue/>
                break
            case '6' :
                activeTab = <LeadNotes/>
                break
            case '7' :
                activeTab = <LeadDocuments/>
                break
            default :
                activeTab = <div/>
                break
        }
        return (
            <MDBBox className="d-flex flex-1 order-1 overflow-auto">
                    <MDBTabContent className="d-flex overflow-auto p-0 w-100 h-100" activeItem={this.props.activeTab}>
                        {activeTab}
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
