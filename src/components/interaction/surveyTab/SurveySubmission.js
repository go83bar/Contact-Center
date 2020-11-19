import React, {Component} from 'react'
import {
    MDBCard,
    MDBCardBody,
    MDBBox,
    MDBChip, MDBCollapse, MDBIcon
} from 'mdbreact';
import * as moment from 'moment'

import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faPoll} from "@fortawesome/pro-solid-svg-icons";

class SurveySubmission extends Component {

    constructor(props) {
        super(props)

        const campaign = props.lead.client.campaigns.find((campaign) => {
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
                    <strong className="f-l">Q: {response.text}</strong><br />
                    {answers}
                </MDBBox>
            )
        })

        this.state = {
            campaignName: campaign.name,
            collapsed: !props.defaultOpen,
            surveyItems: surveyItems
        }
    }

    toggleCollapse = () => {
            this.setState({collapsed: !this.state.collapsed})
    }

    render() {
        const parsedTime = moment.utc(this.props.survey.submission_date).tz(this.props.lead.details.timezone)
        const collapseLabel = this.state.collapsed ? this.props.localization.interaction.survey.showResponses : this.props.localization.interaction.survey.hideResponses
        return (
            <MDBCard id={"survey-" + this.props.survey.id} className="mb-4 w-100 border-light">
                <MDBCardBody className="d-flex justify-content-left" onClick={this.toggleCollapse}>
                    <MDBBox className="mr-2">
                        <span className={"fa-layers fa-fw fa-3x"}>
                            <FontAwesomeIcon icon={faCircle} className="skin-primary-color" />
                            <FontAwesomeIcon icon={faPoll} transform={"shrink-8"} rotation={90} />
                            {this.props.listIndex && <span className={"fa-layers-counter fa-layers-top-right skin-secondary-background-color"}>{this.props.listIndex}</span>}
                        </span>
                    </MDBBox>
                    <MDBBox className="flex-grow-1">
                        <h5 className="pt-1 pb-2">{this.props.survey.name}</h5>
                        <MDBChip className="outlineChip">{this.state.campaignName}</MDBChip>
                        <MDBChip className="outlineChip">{this.props.survey.disqualified ? "Disqualified": "Qualified"}</MDBChip>
                        <MDBChip className="outlineChip">Score: {this.props.survey.score}</MDBChip>

                    </MDBBox>
                    <MDBBox className="survey-thumb-date d-flex flex-column justify-content-between align-items-end">
                        <MDBBox>
                            <strong>{parsedTime.format("MMM D, YYYY")}</strong>&nbsp;{parsedTime.format("h:mm a")}
                        </MDBBox>
                        <MDBBox>{collapseLabel} <MDBIcon className="m-2" icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/></MDBBox>
                    </MDBBox>
                </MDBCardBody>
                <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} style={{}}>
                    <MDBCardBody className="pt-3 px-3 pb-0">
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
