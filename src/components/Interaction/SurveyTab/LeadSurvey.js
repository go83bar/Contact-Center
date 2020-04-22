import React, {Component} from 'react'
import {MDBBox} from "mdbreact";
import {connect} from "react-redux";
import SurveysContainer from "./SurveysContainer"

import ThumbsContainer from './ThumbsContainer';

class LeadSurvey extends Component {

    constructor(props) {
        super(props);


        this.state = {};

    }

    render() {
        return (
            <MDBBox className="d-flex flex-1 overflow-auto">
                <ThumbsContainer surveys={this.props.lead.surveys} />
                <SurveysContainer surveys={this.props.lead.surveys} />
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
/*            <MDBBox className={"p-0 m-0 w-auto"}>
                    <h3>{this.props.localization.interaction.survey.tabTitle}</h3>
            </MDBBox>*/
