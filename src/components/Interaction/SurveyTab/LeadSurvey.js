import React, {Component} from 'react'
import { MDBBox, MDBRow, MDBCol, MDBCard, MDBSmoothScroll} from "mdbreact";
import {connect} from "react-redux";
import SurveysContainer from "./SurveysContainer"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPoll} from '@fortawesome/pro-solid-svg-icons'
import {faCircle} from '@fortawesome/pro-light-svg-icons'
import * as moment from 'moment'
import ThumbsContainer from './ThumbsContainer';

class LeadSurvey extends Component {

    constructor(props) {
        super(props);


        this.state = {
        };

    }

    render() {
        return (
            <MDBBox className="d-flex justify-content-around">
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
