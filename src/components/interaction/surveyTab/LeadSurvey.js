import React, {Component} from 'react'
import {
    MDBCard,
    MDBBox
} from "mdbreact";
import {connect} from "react-redux";
import SurveySubmission from "./SurveySubmission"

class LeadSurvey extends Component {

    render() {

        if (this.props.active === true) {
            if (this.props.lead.surveys.length > 0) {
                let surveyCount = this.props.lead.surveys.length
                const surveys = this.props.lead.surveys.map( (submission) => {
                    // the first one should be open, they all need the index to display in the icon, last first
                    const thisSubmission = (<SurveySubmission
                        key={submission.id}
                        survey={submission}
                        listIndex={surveyCount}
                        defaultOpen={surveyCount === this.props.lead.surveys.length}
                    />)
                    surveyCount--
                    return thisSubmission
                })

                return (
                    <MDBBox className="d-flex flex-1 overflow-auto">

                        <MDBBox border="light" className="w-100 rounded d-flex overflow-auto flex-1 order-1">
                            <div className="w-100 smooth-scroll flex-1 order-1 d-flex overflow-auto flex-column">
                                {surveys}
                            </div>
                        </MDBBox>
                    </MDBBox>
                )
            } else {
                return (
                    <MDBCard border="light" className="p5 rounded w-100 d-flex justify-content-center">
                        <h3>No surveys</h3>
                    </MDBCard>
                )
            }
        } else {
            return null
        }
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization,
        client: store.client,
        lead: store.lead
    }
}

export default connect(mapStateToProps)(LeadSurvey);
