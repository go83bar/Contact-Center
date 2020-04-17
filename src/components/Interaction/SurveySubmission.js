import React, {Component} from 'react'
import { 
    MDBCard,
    MDBCardBody,
    MDBCollapse,
    MDBCollapseHeader,
    MDBIcon,
    MDBBox,
    MDBChip
} from 'mdbreact';
import {connect} from "react-redux";

class SurveySubmission extends Component {

    constructor(props) {
        super(props)

        var client = props.shift.clients[props.lead.client_index]
        var campaign = client.campaigns.find((campaign) => {
            return campaign.id === props.survey.campaign_id
        }) 

        const surveyItems = this.props.survey.responses.map( (response) => {
            const answers = response.answers.map( (answer, index) => {
                return (
                    <MDBBox key={index} className="ml-4">{answer.text}</MDBBox>
                )
            })
            return (
                <MDBBox key={response.question_id} tag="div" className="mt-3">
                    <strong>{response.text}</strong><br />
                    {answers}
                </MDBBox>
            )
        })

        this.state = {
            campaignName: campaign.name,
            collapseName: "collapse" + props.survey.id,
            surveyItems: surveyItems
        }

        this.toggleCollapse = this.toggleCollapse.bind(this)
    }

    toggleCollapse() {
        this.props.collapseCallback(this.state.collapseName)
    }

    render() {
        return (
            <MDBCard>
                <MDBCollapseHeader
                tagClassName='d-flex justify-content-between'
                onClick={this.toggleCollapse}
                >
                {this.props.survey.submission_date}
                <strong>{this.props.survey.name}</strong> 
                <MDBIcon
                    icon={this.props.collapseID === this.state.collapseName ? 'angle-up' : 'angle-down'}
                />
                </MDBCollapseHeader>
                <MDBCollapse id={this.state.collapseName} isOpen={this.props.collapseID}>
                <MDBCardBody className="color-black">
                    <MDBChip className="outlineChip">{this.state.campaignName}</MDBChip>
                    <MDBChip className="outlineChip">{this.props.survey.disqualified ? "Disqualified": "Qualified"}</MDBChip>
                    <MDBChip className="outlineChip">Score: {this.props.survey.score}</MDBChip>
                    {this.state.surveyItems}
                </MDBCardBody>
                </MDBCollapse>
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
