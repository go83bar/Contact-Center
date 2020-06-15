import React, {Component} from 'react'
import {
    MDBCol, MDBRow,
    MDBModal, MDBModalBody, MDBModalHeader, 
 } from 'mdbreact'
 import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircle} from "@fortawesome/pro-light-svg-icons"

import {connect} from "react-redux";
import { TwilioDevice } from '../../../twilio/TwilioDevice'

class Keypad extends Component {

    clickHandler = (tone) => {
        TwilioDevice.sendKeypadInput(tone)
    }

    generateButton = (tone, alpha) => {
        let textClass = "skin-secondary-color pt-2"
        if (tone === "*") {
            textClass = "skin-secondary-color pt-3"
        }
        return (
            <MDBCol className={"text-align-center ml-2"}>
            <span className="fa-layers fa-fw fa-3x pointer" onClick={() => this.clickHandler(tone)}>
                <h3 className={textClass}>{tone}</h3>
                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
            </span>
            <span className="callBarText skin-secondary-color"><br/>{alpha}</span>
        </MDBCol>

        )
    }
    render() {
        return (
            <MDBModal isOpen={true} toggle={this.props.toggle} size="sm" >
                <MDBModalHeader>{this.props.localized.title}</MDBModalHeader>
                <MDBModalBody >
                    <MDBRow className="pb-3">
                        {this.generateButton("1", "")}
                        {this.generateButton("2", "ABC")}
                        {this.generateButton("3", "DEF")}
                    </MDBRow>
                    <MDBRow className="pb-3">
                        {this.generateButton("4", "GHI")}
                        {this.generateButton("5", "JKL")}
                        {this.generateButton("6", "MNO")}
                    </MDBRow>
                    <MDBRow className="pb-3">
                        {this.generateButton("7", "PQRS")}
                        {this.generateButton("8", "TUV")}
                        {this.generateButton("9", "WXYZ")}
                    </MDBRow>
                    <MDBRow className="pb-3">
                        {this.generateButton("*", "")}
                        {this.generateButton("0", "")}
                        {this.generateButton("#", "")}
                    </MDBRow>
                </MDBModalBody>
            </MDBModal>
        )
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        localized: state.localization.interaction.callbar.keypad,
    }
}

export default connect(mapStateToProps)(Keypad);
