import React, {Component} from 'react'
import {
    MDBCol, MDBRow,
    MDBModal, MDBModalBody, MDBModalHeader,MDBModalFooter,
    MDBBtn
 
 } from 'mdbreact'
 import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
 import { faStar } from "@fortawesome/pro-solid-svg-icons";

import {connect} from "react-redux";
import { TwilioDevice } from '../../../twilio/TwilioDevice'

class DialChoice extends Component {

    clickHandler = (phoneType) => {
        TwilioDevice.dialLead(phoneType)
        this.props.toggle()
    }

    maskPhoneValue = (rawInput) => {
        if (rawInput === undefined) {
            return ""
        }
        const matches = rawInput.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        return !matches[2] ? matches[1] : '(' + matches[1] + ') ' + matches[2] + (matches[3] ? '-' + matches[3] : '')     
    }

    render() {
        return (
            <MDBModal isOpen={true} toggle={this.props.toggle} size="lg" >
                <MDBModalHeader>{this.props.localized.title}</MDBModalHeader>
                <MDBModalBody >
                    <MDBRow className="p-2">
                        <MDBCol className="d-flex align-items-center border-right border-dark pointer" onClick={() => this.clickHandler("cell")}>
                            { this.props.lead.details.preferred_phone === "cell" && <FontAwesomeIcon icon= {faStar} className="skin-primary-color ml-2 mr-1"/>}
                            <span>{this.props.localized.cellLabel} </span>
                            <span className="skin-primary-color p-2 font-weight-bold" style={ {fontSize: "large"}}>{this.maskPhoneValue(this.props.lead.details.cell_phone)}</span>

                        </MDBCol>
                        <MDBCol className="d-flex align-items-center pointer" onClick={() => this.clickHandler("home")}>
                        { this.props.lead.details.preferred_phone === "home" && <FontAwesomeIcon icon= {faStar} className="skin-primary-color ml-2 mr-1"/>}
                            <span>{this.props.localized.homeLabel} </span>
                            <span className="skin-primary-color p-2 font-weight-bold" style={ {fontSize: "large"}}>{this.maskPhoneValue(this.props.lead.details.home_phone)}</span>                            
                        </MDBCol>
                        
                    </MDBRow>
                </MDBModalBody>
                <MDBModalFooter className="p-1 justify-content-start">
                    <MDBRow>
                        <MDBCol size={"12"}>
                            <MDBBtn color="secondary" rounded outline className="float-left"
                                    onClick={this.props.toggle}>{this.props.localization.buttonLabels.cancel}</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBModalFooter>

            </MDBModal>
        )
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        localized: state.localization.interaction.callbar.dialChoice,
        lead: state.lead
    }
}

export default connect(mapStateToProps)(DialChoice);
