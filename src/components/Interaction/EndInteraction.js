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

    faQuestion
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faHeadSide} from "@fortawesome/pro-regular-svg-icons";

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

    selectOutcome(outcome_id) {
        const outcome = this.state.outcomes.find(o => o.id === outcome_id)
        let steps = ["outcome"]
        if (outcome.requires_office === true) steps.push("office")
        if (outcome.requires_appointment === true) steps.push("appointment")
        if (outcome.outcome_reasons && outcome.outcome_reasons.length > 0) steps.push("reason")
        steps.push("finish")
        this.setState({ steps, outcome, reason : undefined }, this.nextStep)
    }

    selectReason(reason_id) {
        const reason = this.state.outcome.outcome_reasons.find(r => r.id === reason_id)
        this.setState({ reason }, this.nextStep)
    }

    nextStep() {
        const index = this.state.steps.indexOf(this.state.currentStep)
        this.setState({currentStep : this.state.steps[index + 1]})
    }

    previousStep() {
        const index = this.state.steps.indexOf(this.state.currentStep)
        this.setState({currentStep : this.state.steps[index - 1]})
    }

    render() {

        return (
            <MDBModal isOpen={this.props.active} toggle={this.props.toggle} size={"fluid"}>
                <MDBModalBody className="d-flex justify-content-between m-1" style={{backgroundColor: "#f9f9f9", minHeight: "500px"}}>
                    <MDBCard className="shadow-none px-2 pt-4" style={{minWidth:"210px"}}>
                    <MDBStepper vertical className="eiStepper d-flex m-0 p-0 h-100">
                        <MDBStep stepName="Choose Outcome" className="">
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "48px"}}>
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
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "48px"}}>
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
                                <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "48px"}}>
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
                                    <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "48px"}}>
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
                        <MDBCardHeader className="backgroundColorInherit"><h3>{this.getHeaderText()}</h3></MDBCardHeader>
                        <MDBCardBody>
                            {this.state.currentStep === "outcome" &&
                                <MDBBox className="d-flex flex-wrap">
                                    {this.state.outcomes.map(outcome =>
                                        <MDBBtn style={{minWidth: "300px"}} rounded outline key={"outcome-" + outcome.id} onClick={()=> this.selectOutcome(outcome.id)}>{outcome.label}</MDBBtn>
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
                                <MDBBox className="d-flex flex-wrap">
                                    {this.state.outcome.outcome_reasons.map(reason =>
                                        <MDBBtn style={{minWidth: "300px"}} rounded outline key={"reason-" + reason.id} onClick={()=> this.selectReason(reason.id)}>{reason.text}</MDBBtn>
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
                            <MDBBox>
                                Finish
                            </MDBBox>
                            }

                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                                <MDBBtn rounded outline onClick={this.props.toggle}>Cancel</MDBBtn>
                            <MDBBox className="d-flex justify-content-end">
                                {this.state.steps.indexOf(this.state.currentStep) > 0 && <MDBBtn rounded outline onClick={this.previousStep}>Previous</MDBBtn>}
                                {this.state.steps.indexOf(this.state.currentStep) < (this.state.steps.length -1) && <MDBBtn rounded color={"primary"} onClick={this.nextStep}>Next</MDBBtn>}
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
        shift : store.shift
    }
}

export default connect(mapStateToProps)(EndInteraction);
