import React, {Component} from 'react'
import {MDBBtn, MDBCol, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from 'mdbreact'
import {connect} from "react-redux";
import Switch from "../ui/Switch";

class ContactPreferences extends Component {

    constructor(props) {
        super(props);
        this.ok = this.ok.bind(this)
        this.cancel = this.cancel.bind(this)
        this.phoneChange=this.phoneChange.bind(this)
        this.emailChange=this.emailChange.bind(this)
        this.textChange=this.textChange.bind(this)
        this.state = {
            modalName : "Contact Preferences",
            phone : false,
            email : true,
            text : false
        };
    }

    phoneChange() {
        this.setState({phone : !this.state.phone})
    }
    emailChange(checked) {
        this.setState({email : !this.state.email})
    }
    textChange(checked) {
        this.setState({text : !this.state.text})
    }

    ok() {
        //Process the data

        this.props.closeModal(this.state.modalName)
    }
    cancel() {
        this.props.closeModal(this.state.modalName)
    }

    render() {
        let localization = this.props.localization.interaction.summary.contactPreferences
        return (
            <MDBModal size="lg" isOpen={true} toggle={this.props.closeModal}>
                <MDBModalHeader>{localization.title}</MDBModalHeader>
                <MDBModalBody >
                    <MDBRow className="p-2">
                        <MDBCol size="4">
                            <label htmlFor="first_name" className="grey-text">{localization.phone}</label>
                            <Switch checked={this.state.phone} offLabel={"Not Allowed"} onLabel={"Allowed"} onChange={this.phoneChange}/>
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="lead_id" className="grey-text">{localization.email}</label>
                            <Switch checked={this.state.email} offLabel={"Not Allowed"} onLabel={"Allowed"} onChange={this.emailChange}/>
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="last_name" className="grey-text">{localization.text}</label>
                            <Switch checked={this.state.text} offLabel={"Not Allowed"} onLabel={"Allowed"} onChange={this.textChange}/>
                        </MDBCol>
                    </MDBRow>
                    <MDBModalFooter className="p-1"/>
                    <MDBRow>
                        <MDBCol size={"12"}>
                            <MDBBtn color="secondary" className="rounded float-left" onClick={this.cancel}>{localization.cancelButton}</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBModalBody>
            </MDBModal>
        )
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead : state.lead,
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactPreferences);
