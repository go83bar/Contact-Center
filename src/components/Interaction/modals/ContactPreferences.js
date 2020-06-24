import React, {Component} from 'react'
import {MDBBtn, MDBCol, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from 'mdbreact'
import {connect} from "react-redux";
import {toast} from "react-toastify"
import Switch from "../../ui/Switch";
import LeadAPI from '../../../api/leadAPI';

class ContactPreferences extends Component {

    updatePreference = field => {
        const newPreference = !this.props.lead.contact_preferences[field]
        const payload = {
            leadID: this.props.lead.id,
            type: field,
            preference: newPreference
        }
        LeadAPI.setContactPreferences(payload)
            .then( (response) => {
                if (response.success) {
                    this.props.dispatch({
                        type:"LEAD.UPDATE_CONTACT_PREFERENCES", 
                        data: { 
                            field: field, 
                            value: newPreference
                        }
                    })
                    console.log("message", this.props.localization.toast.editContactPreferences.success)
                    toast.success(this.props.localization.toast.editContactPreferences.success, {delay: 1000})
                } else {
                    toast.error(this.props.localization.toast.editContactPreferences.error, {delay: 1000})
                }
            })

    }
    cancel = () => {
        this.props.closeModal("Contact Preferences")
    }

    render() {
        const localization = this.props.localization.interaction.summary.contactPreferences
        const switches = ['phone_calls', 'emails', 'texts'].map( (field) => {
            return (
                <MDBCol size="4" key={field}>
                    <label htmlFor={field} className="grey-text">{localization[field]}</label>
                    <Switch checked={this.props.lead.contact_preferences[field]} offLabel={"Not Allowed"} onLabel={"Allowed"} onChange={() => this.updatePreference(field)}/>
                </MDBCol>
            )
        })
        return (
            <MDBModal size="lg" isOpen={true} toggle={this.props.closeModal}>
                <MDBModalHeader>{localization.title}</MDBModalHeader>
                <MDBModalBody >
                    <MDBRow className="p-2">
                        {switches}
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
const mapStateToProps = store => {
    return {
        localization: store.localization,
        lead : store.lead,
    }
}

export default connect(mapStateToProps)(ContactPreferences);
