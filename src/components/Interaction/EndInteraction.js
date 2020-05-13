import React, { Component } from 'react'
import {
    MDBBox,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
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
    faClinicMedical, faEquals,

    faQuestion
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faHeadSide} from "@fortawesome/pro-regular-svg-icons";

class EndInteraction extends Component {

    constructor(props) {
        super(props)
        this.nextStep = this.nextStep.bind(this)

        this.state = {
            currentStep : 1
        }

    }
    nextStep() {
        this.setState({currentStep : this.state.currentStep + 1})
    }

    render() {
        return (
            <MDBModal isOpen={this.props.active} toggle={this.props.toggle} size={"lg"}>
                <MDBModalBody className="d-flex justify-content-between m-1" style={{backgroundColor: "#f9f9f9", minHeight: "500px"}}>
                    <MDBCard className="shadow-none pr-2">
                    <MDBStepper vertical className="customStepper d-flex m-0 p-3 h-100" >
                        <MDBStep stepName="Choose Outcome">
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "-5px"}}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === 1 ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faEquals} transform={"shrink-8"} className={"skin-secondary-color"}/>
                            </span>

                        </MDBStep>
                        <MDBStep stepName="Choose Outcome">
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "-5px"}}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === 2 ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faClinicMedical} transform={"shrink-8"} className={"skin-secondary-color"}/>
                            </span>

                        </MDBStep>
                        <MDBStep stepName="Choose Outcome">
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "-5px"}}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === 3 ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faHeadSide} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faQuestion} transform={"shrink-12"} className={"skin-secondary-color"}/>
                            </span>

                        </MDBStep>
                        <MDBStep stepName="Choose Outcome">
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "-5px"}}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === 4 ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"} className={"skin-secondary-color"}/>
                            </span>
                        </MDBStep>
                        <MDBStep stepName="Choose Outcome">
                            <span className="fa-layers fa-fw fa-4x" style={{zIndex: 2, marginLeft: "-5px"}}>
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === 5 ? "skin-primary-color" : "skin-secondary-color"}/>
                                <FontAwesomeIcon icon={faCheck} transform={"shrink-8"} className={"skin-secondary-color"}/>
                            </span>
                        </MDBStep>
                    </MDBStepper>
                    </MDBCard>
                    <MDBCard className="w-100 shadow-none ml-3">
                        <MDBCardHeader className="backgroundColorInherit"></MDBCardHeader>
                        <MDBCardBody></MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                                <MDBBtn rounded outline onClick={this.props.toggle}>Cancel</MDBBtn>
                            <MDBBox className="d-flex justify-content-end">
                                {this.state.currentStep > 1 && <MDBBtn rounded outline>Previous</MDBBtn>}
                                <MDBBtn rounded color={"primary"} onClick={this.nextStep}>Next</MDBBtn>
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
        localization: store.localization
    }
}

export default connect(mapStateToProps)(EndInteraction);
