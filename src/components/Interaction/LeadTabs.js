import React, {Component} from 'react'
import {MDBBox, MDBTabPane, MDBTabContent} from "mdbreact";
import LeadSurvey from "./SurveyTab/LeadSurvey";
import LeadAppointments from "./LeadAppointments";
import LeadBooking from "./LeadBooking";
import LeadTimeline from "./LeadTimeline";
import LeadCallQueue from "./LeadCallQueue";
import LeadDocuments from "./LeadDocuments";
import LeadNotes from "./LeadNotes";
import {connect} from "react-redux";


class LeadTabs extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <MDBBox className="" style={{flex:1,order:1, overflow:"auto"}}>
                    <MDBTabContent className="p-0 mh-100 mw-100" activeItem={this.props.activeTab}>
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
