import React, {Component} from 'react'
import {MDBBtn, MDBCol, MDBInput, MDBModal, MDBBox, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from 'mdbreact'
import {connect} from "react-redux";
import Switch from "../../ui/Switch";
import LeadAPI from "../../../api/leadAPI";

class EditLead extends Component {

    constructor(props) {
        super(props);
        this.ok = this.ok.bind(this)
        this.cancel = this.cancel.bind(this)
        this.state = {
            modalName: "Edit Lead"
        };
    }

    ok() {
        //Process the data

        this.props.closeModal(this.state.modalName)
    }

    cancel() {
        this.props.closeModal(this.state.modalName)
    }

    updatePreference = field => {
        const newPreference = !this.props.lead.contact_preferences[field]
        const payload = {
            leadID: this.props.lead.id,
            type: field,
            preference: newPreference
        }
        LeadAPI.setContactPreferences(payload)
            .then((response) => {
                if (response.success) {
                    this.props.dispatch({
                        type: "LEAD.UPDATE_CONTACT_PREFERENCES",
                        data: {
                            field: field,
                            value: newPreference
                        }
                    })
                }
            })

    }

    render() {
        let localization = this.props.localization.interaction.summary.editLead
        const switches = ['phone_calls', 'emails', 'texts'].map((field) => {
            let icon = ""
            switch (field) {
                case "phone_calls": icon = "phone"; break;
                case "emails": icon = "envelope"; break;
                case "texts": icon = "comment"; break;
                default: break
            }
            return (
                    <Switch checked={this.props.lead.contact_preferences[field]} offLabel={"Not Allowed"} key={field}
                            onLabel={"Allowed"} icon={icon} onChange={() => this.updatePreference(field)}/>
            )
        })
        return (
            <MDBModal isOpen={true} toggle={this.props.closeModal} size="lg" contentClassName="w-900px" >
                <MDBModalHeader>{localization.title}</MDBModalHeader>
                <MDBModalBody className="d-flex flex-wrap justify-content-start w-100">
                    <MDBInput type="text"
                              label={localization.firstName}
                              id="first_name"
                              outline
                              name="firstNameValue"
                              value={this.state.firstNameValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={localization.lastName}
                              id="last_name"
                              outline
                              name="leadIDValue"
                              value={this.state.leadIDValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <div className="break"/>
                    <MDBInput type="text"
                              label={localization.email}
                              id="email"
                              outline
                              name="lastNameValue"
                              value={this.state.lastNameValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                        <div className="break"/>
                    <MDBInput type="text"
                              label={localization.cellPhone}
                              id="cell"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={localization.homePhone}
                              id="home"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={localization.workPhone}
                              id="work"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <div className="break"/>
                    <MDBInput type="text"
                              label={localization.address}
                              id="address"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={localization.address2}
                              id="address2"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                        <div className="break"/>

                    <MDBInput type="text"
                              label={localization.city}
                              id="city"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={localization.state}
                              id="state"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={localization.zip}
                              id="zip"
                              outline
                              name="phoneValue"
                              value={this.state.phoneValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                    />
                    <MDBBox className="d-flex flex-wrap w-100" >
                        {switches}
                    </MDBBox>
                </MDBModalBody>

                <MDBModalFooter className="p-1">
                    <MDBRow>
                        <MDBCol size={"12"}>
                            <MDBBtn color="secondary" rounded outline className="float-left"
                                    onClick={this.cancel}>{localization.cancelButton}</MDBBtn>
                            <MDBBtn color="primary" rounded className="float-right"
                                    onClick={this.ok}>{localization.okButton}</MDBBtn>

                        </MDBCol>
                    </MDBRow>
                </MDBModalFooter>
            </MDBModal>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead: state.lead,
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditLead);
