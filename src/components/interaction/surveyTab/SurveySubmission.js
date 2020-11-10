import React, {Component} from 'react'
import {
    MDBCard,
    MDBCardBody,
    MDBBox,
    MDBChip
} from 'mdbreact';
import * as moment from 'moment'

import SurveyIcon from './SurveyIcon'

import {connect} from "react-redux";

class SurveySubmission extends Component {

    constructor(props) {
        super(props)

        var campaign = props.lead.client.campaigns.find((campaign) => {
            return campaign.id === props.survey.campaign_id
        })

        const surveyItems = this.props.survey.responses.map( (response) => {
            const answers = response.answers.map( (answer, index) => {
                return (
                    <MDBBox key={index}><strong>A:</strong> {answer.text}</MDBBox>
                )
            })
            return (
                <MDBBox key={response.question_id} tag="div" className="mt-3">
                    <strong>Q: {response.text}</strong><br />
                    {answers}
                </MDBBox>
            )
        })

        this.state = {
            campaignName: campaign.name,
            surveyItems: surveyItems
        }
    }

    render() {
        const parsedTime = moment.utc(this.props.survey.submission_date).tz(this.props.lead.details.timezone)
        return (
            <MDBCard id={"survey-" + this.props.survey.id} className="mb-4 w-100 border-light">
                <MDBCardBody className="d-flex justify-content-left">
                    <MDBBox className="mr-2">
                        <SurveyIcon size="2x" />
                    </MDBBox>
                    <MDBBox className="w-100">
                        <MDBBox className="float-right survey-thumb-date">
                            <strong>{parsedTime.format("MMM D, YYYY")}</strong>
                            &nbsp;{parsedTime.format("h:mm a")}
                        </MDBBox>
                        <h5 className="pt-1 pb-2">{this.props.survey.name}</h5>
                        <MDBChip className="outlineChip">{this.state.campaignName}</MDBChip>
                        <MDBChip className="outlineChip">{this.props.survey.disqualified ? "Disqualified": "Qualified"}</MDBChip>
                        <MDBChip className="outlineChip">Score: {this.props.survey.score}</MDBChip>
                        {this.state.surveyItems}

                    </MDBBox>
                </MDBCardBody>
            </MDBCard>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        shift: state.shift,
        lead: state.lead
    }
}

export default connect(mapStateToProps)(SurveySubmission);
