import React, {Component} from 'react'
import { MDBTypography, MDBBox} from "mdbreact";
import {connect} from "react-redux";
import SurveySubmission from "./SurveySubmission"

class LeadSurvey extends Component {

    constructor(props) {
        super(props);


        this.state = {
            collapseID: ""
        };

        this.toggleCollapse = this.toggleCollapse.bind(this)
    }

    toggleCollapse(collapseID) {
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
          }))
    }
    render() {
        const surveys = this.props.lead.surveys.map( (submission) => {
            return <SurveySubmission 
                key={submission.id} 
                survey={submission} 
                collapseID={this.state.collapseID}
                collapseCallback={this.toggleCollapse}
                />
        })
        return (
            <MDBBox className={"p-0 m-0 w-auto"}>
                    <h3>{this.props.localization.interaction.survey.tabTitle}</h3> 
                    <MDBBox className='w-100 p-0 md-accordion mt-5'>
                        {surveys}
                    </MDBBox>
            </MDBBox>
        )
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        client: state.client,
        lead: state.lead
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadSurvey);
