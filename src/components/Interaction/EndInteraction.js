import React, { Component } from 'react'
import {
    MDBBox,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader, MDBChip,
    MDBModal,
    MDBModalBody,
    MDBStep,
    MDBStepper
} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,

    faCheck,
    faCircle as faCircleSolid,
    faClinicMedical, faDoorOpen,
    faTimes,
    faQuestion
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faHeadSide} from "@fortawesome/pro-regular-svg-icons";
import LeadAPI from "../../api/leadAPI";

var truncate = function (str, limit) {
    var bits, i;
    bits = str.split('');
    if (bits.length > limit) {
        for (i = bits.length - 1; i > -1; --i) {
            if (i > limit) {
                bits.length = i;
            }
            else if (' ' === bits[i]) {
                bits.length = i;
                break;
            }
        }
        bits.push('...');
    }
    return bits.join('');
};

class EndInteraction extends Component {

    constructor(props) {
        super(props)
        this.nextStep = this.nextStep.bind(this)
        this.previousStep = this.previousStep.bind(this)
        this.getHeaderText = this.getHeaderText.bind(this)
        this.selectOutcome = this.selectOutcome.bind(this)
        this.selectReason = this.selectReason.bind(this)
        this.endInteraction = this.endInteraction.bind(this)
        this.endInteractionFetch = this.endInteractionFetch.bind(this)
        this.renderLeadSummary = this.renderLeadSummary.bind(this)
        this.toStep = this.toStep.bind(this)

        const client = this.props.shift.clients.find(client => client.id === this.props.lead.client_id)
        const phase = client.phases.find(phase => phase.id === this.props.lead.phase_id)
        let outcomes = []
        phase.outcomes.forEach((o) => {
          let oc = this.props.shift.outcomes.find(outcome => outcome.id === o.id)
          if (o.outcome_reasons && o.outcome_reasons.length > 0) {
              let ors = []
              o.outcome_reasons.forEach((or) => {
                  ors.push(this.props.shift.outcome_reasons.find(reason => reason.id === or))
              })
              oc.outcome_reasons = ors.slice()
          }
          outcomes.push(oc)
        })

        this.state = {
            currentStep : "outcome",
            showPrevious : false,
            showNext : true,
            steps : ["outcome"],
            outcomes : outcomes
        }

    }

    getHeaderText() {
        switch(this.state.currentStep) {
            case "outcome": return "Choose Outcome"
            case "office": return "Choose Office"
            case "reason": return "Choose Reason"
            case "appointment": return "Select an Appointment"
            default : return "End Interaction"
        }
    }

    endInteraction(fetch) {
        console.log("End Interaction")
        let payload = {
            interaction_id: this.props.interaction.id,
            outcome: this.state.outcome.name
        }

        if (this.state.reason) payload["outcome_reason_id"] = this.state.reason.id
        if (this.state.office) payload["office_id"] = this.state.office.id
        if (this.state.appointment) payload["appointment_id"] = this.state.appointment.id
        console.log("End Interaction Payload: ", payload)
        LeadAPI.endInteraction(payload).then(response => {
            if (response.success) {
                this.props.dispatch({
                    type: "INTERACTION.END",
                    data: {
                        interactionID: payload.interactionID
                    }
                })
            }
        })
        fetch === true ? this.props.history.push("/next") : this.props.history.push("/")
    }
    endInteractionFetch() {
       this.endInteraction(true)
    }

    selectOutcome(outcome_id) {
        const outcome = this.state.outcomes.find(o => o.id === outcome_id)
        let steps = ["outcome"]
        if (outcome.requires_office === true) steps.push("office")
        if (outcome.requires_appointment === true) steps.push("appointment")
        if (outcome.outcome_reasons && outcome.outcome_reasons.length > 0) steps.push("reason")
        steps.push("finish")
        this.setState({ steps, outcome, reason : undefined, appointment : undefined, office : undefined }, this.nextStep)
    }

    selectReason(reason_id) {
        const reason = this.state.outcome.outcome_reasons.find(r => r.id === reason_id)
        this.setState({ reason, appointment : undefined, office : undefined }, this.nextStep)
    }

    nextStep() {
        const index = this.state.steps.indexOf(this.state.currentStep)
        this.setState({currentStep : this.state.steps[index + 1]})
    }

    previousStep() {
        const index = this.state.steps.indexOf(this.state.currentStep)
        this.setState({currentStep : this.state.steps[index - 1]})
    }

    toStep(currentStep) {
        const currentIndex = this.state.steps.indexOf(this.state.currentStep)
        if (currentIndex > this.state.steps.indexOf(currentStep))
            this.setState( { currentStep })
    }

    renderStepSummary(step, localization) {
        switch (step) {
            case "outcome" :
                return (
                    <MDBBox key={"outcomeSummary"}>
                        <span className="font-weight-bold">{localization.outcomeSummaryLabel}</span>{this.state.outcome.label}
                    </MDBBox>
                )
            case "office" :
                return (
                    <MDBBox key={"officeSummary"}>
                        <span className="font-weight-bold">{localization.officeSummaryLabel}</span>{this.state.office.label}
                    </MDBBox>
                )
            case "reason" :
                return (
                    <MDBBox key={"reasonSummary"}>
                        <span className="font-weight-bold">{localization.reasonSummaryLabel}</span>{this.state.reason.text}
                    </MDBBox>
                )
            case "appointment" :
                return (
                    <MDBBox key={"appointmentSummary"}>
                        <span className="font-weight-bold">{localization.apptSummaryLabel}</span>{this.state.appointment.label}
                    </MDBBox>
                )
            default: return null
        }
    }

    renderLeadSummary(localization) {
        const lead = this.props.lead
        return (
            <MDBCard className="border shadow-none skin-border-primary mb-2">
                <MDBCardBody className="d-flex flex-column">
                    <div>{localization.leadName} {lead.details.first_name} {lead.details.last_name} <MDBChip className="outlineChip">{lead.id}</MDBChip></div>
                    {lead.details.address_1 && <div>{localization.address} {lead.details.address_1} {lead.details.address_2}</div>}
                    <div className="d-flex">{lead.details.city && <div>{localization.city} {lead.details.city}</div>} {lead.details.state && <div>{localization.state} {lead.details.state}</div>} {lead.details.zip && <div>{localization.zip} {lead.details.zip}</div>}</div>
                </MDBCardBody>
            </MDBCard>
        )
    }
    render() {
        const localization = this.props.localization.interaction.endInteraction

        return (
            <MDBModal isOpen={true} toggle={this.props.toggle} size={"fluid"}>
                <MDBModalBody className="d-flex justify-content-between m-1" style={{backgroundColor: "#f9f9f9", minHeight: "500px"}}>
                    <MDBCard className="shadow-none px-2 pt-4" style={{minWidth:"210px"}}>
                    <MDBStepper vertical className="eiStepper d-flex m-0 p-0 h-100">
                        <MDBStep stepName="Choose Outcome" className="">
                            <span className="fa-layers fa-fw fa-4x pointer" style={{zIndex: 2, marginLeft: "48px"}} onClick={()=>this.toStep("outcome")}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === "outcome" ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faDoorOpen} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                {this.state.currentStep !== "outcome" && <span className={"fa-layers-counter fa-layers-top-right skin-primary-background-color"}>
                                    <FontAwesomeIcon icon={faCheck} className="skin-text"/>
                                </span>}
                            </span>
                            {this.state.outcome !== undefined && <MDBChip className="shadow-sm mt-4 z-2 text-align-center skin-secondary-background-color skin-text" style={{width:"190px"}}>{truncate(this.state.outcome.label,25)}</MDBChip>}
                        </MDBStep>
                        { this.state.steps.includes("office") &&
                            <MDBStep stepName="Choose Office">
                            <span className="fa-layers fa-fw fa-4x pointer" style={{zIndex: 2, marginLeft: "48px"}} onClick={()=>this.toStep("office")}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle}
                                                 className={this.state.currentStep === "office" ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faClinicMedical} transform={"shrink-8"}
                                                 className={"skin-secondary-color"}/>
                                {this.state.steps.indexOf(this.state.currentStep) > this.state.steps.indexOf("office") &&
                                <span className={"fa-layers-counter fa-layers-top-right skin-primary-background-color"}>
                                    <FontAwesomeIcon icon={faCheck} className="skin-text"/>
                                </span>}
                            </span>
                            </MDBStep>
                        }
                        {this.state.steps.includes("appointment") &&
                            <MDBStep stepName="Choose Appointment">
                                <span className="fa-layers fa-fw fa-4x pointer" style={{zIndex: 2, marginLeft: "48px"}} onClick={()=>this.toStep("appointment")}>
                                    <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                    <FontAwesomeIcon icon={faCircle}
                                                     className={this.state.currentStep === "appointment" ? "skin-primary-color" : "skin-secondary-color"}/>
                                    <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}
                                                     className={"skin-secondary-color"}/>
                                    {this.state.steps.indexOf(this.state.currentStep) > this.state.steps.indexOf("appointment") &&
                                    <span className={"fa-layers-counter fa-layers-top-right skin-primary-background-color"}>
                                        <FontAwesomeIcon icon={faCheck} className="skin-text"/>
                                    </span>}
                                </span>
                            </MDBStep>
                        }
                        {this.state.steps.includes("reason") &&
                            <MDBStep stepName="Choose Reason">
                                    <span className="fa-layers fa-fw fa-4x pointer" style={{zIndex: 2, marginLeft: "48px"}} onClick={()=>this.toStep("reason")}>
                                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                        <FontAwesomeIcon icon={faCircle}
                                                         className={this.state.currentStep === "reason" ? "skin-primary-color" : "skin-secondary-color"}/>
                                        <FontAwesomeIcon icon={faHeadSide} transform={"shrink-8"}
                                                         className={"skin-secondary-color"}/>
                                        <FontAwesomeIcon icon={faQuestion} transform={"shrink-12"}
                                                         className={"skin-secondary-color"}/>
                                        {this.state.steps.indexOf(this.state.currentStep) > this.state.steps.indexOf("reason") && <span
                                            className={"fa-layers-counter fa-layers-top-right skin-primary-background-color"}>
                                            <FontAwesomeIcon icon={faCheck} className="skin-text"/>
                                        </span>}
                                    </span>
                                    {this.state.reason !== undefined && <MDBChip className="shadow-sm mt-4 z-2 text-align-center skin-secondary-background-color skin-text" style={{minWidth:"190px"}}>{truncate(this.state.reason.text,25)}</MDBChip>}
                            </MDBStep>
                        }
                        <MDBStep stepName="Finish">
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "48px"}}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === 5 ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faCheck} transform={"shrink-8"} className={"skin-secondary-color"}/>
                            </span>
                        </MDBStep>
                    </MDBStepper>
                    </MDBCard>
                    <MDBCard className="w-100 shadow-none ml-3" style={{minHeight: this.state.steps.length > 3 ? "600px" : "300px"}}>
                        <MDBCardHeader className="d-flex justify-content-between backgroundColorInherit">
                            <h3 className="skin-secondary-color">{this.getHeaderText()}</h3>
                            <FontAwesomeIcon icon={faTimes} onClick={this.props.toggle} className="mt-2 pointer"/>
                        </MDBCardHeader>
                        <MDBCardBody>
                            {this.state.currentStep === "outcome" &&
                                <MDBBox className="d-flex flex-wrap justify-content-center">
                                    {this.state.outcomes.map(outcome =>
                                        <MDBBtn style={{minWidth: "300px"}} rounded outline={!(this.state.outcome && this.state.outcome.id === outcome.id)} key={"outcome-" + outcome.id} color={this.state.outcome && this.state.outcome.id === outcome.id ? "primary" : undefined} onClick={()=> this.selectOutcome(outcome.id)}>{outcome.label}</MDBBtn>
                                    )}
                                </MDBBox>
                            }
                            {this.state.currentStep === "office" &&
                            <MDBBox>
                                Choose Office Content
                            </MDBBox>
                            }
                            {this.state.currentStep === "reason" &&
                            <MDBBox>
                                <MDBBox className="d-flex flex-wrap justify-content-center">
                                    {this.state.outcome.outcome_reasons.map(reason =>
                                        <MDBBtn style={{minWidth: "300px"}} rounded outline={!(this.state.reason && this.state.reason.id === reason.id)} key={"reason-" + reason.id} color={this.state.reason && this.state.reason.id === reason.id ? "primary" : undefined} onClick={()=> this.selectReason(reason.id)}>{reason.text}</MDBBtn>
                                    )}
                                </MDBBox>
                            </MDBBox>
                            }
                            {this.state.currentStep === "appointment" &&
                            <MDBBox>
                                Choose Appointment Content
                            </MDBBox>
                            }
                            {this.state.currentStep === "finish" &&
                            <MDBBox className="d-flex flex-column align-items-center w-100 f-l">
                                {this.renderLeadSummary(localization)}
                                {this.state.steps.map(step => this.renderStepSummary(step, localization))}
                            </MDBBox>
                            }

                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBox className="d-flex justify-content-start w-100">
                                <MDBBtn rounded outline onClick={this.props.toggle}>{localization.cancelButton}</MDBBtn>
                                {this.state.steps.indexOf(this.state.currentStep) > 0 && <MDBBtn rounded outline onClick={this.previousStep}>{localization.previousButton}</MDBBtn>}
                            </MDBBox>
                            <MDBBox className="d-flex justify-content-end w-100">
                                {(this.state.steps.indexOf(this.state.currentStep) < (this.state.steps.length -1) && this.state[this.state.currentStep] !== undefined) && <MDBBtn rounded color={"primary"} onClick={this.nextStep}>{localization.nextButton}</MDBBtn>}
                                {this.state.currentStep === "finish" &&  <MDBBtn rounded color={"primary"} onClick={this.endInteraction}>{localization.endButton}</MDBBtn>}
                                {this.state.currentStep === "finish" &&  <MDBBtn rounded color={"primary"} onClick={this.endInteractionFetch}>{localization.endFetchButton}</MDBBtn>}
                            </MDBBox>
                        </MDBCardFooter>
                    </MDBCard>
                </MDBModalBody>
            </MDBModal>
        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization,
        lead : store.lead,
        shift : store.shift,
        interaction: store.interaction
    }
}

export default connect(mapStateToProps)(EndInteraction);
