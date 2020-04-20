import React, {Component} from 'react'
import {MDBBtn, MDBCol, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from 'mdbreact'
import {connect} from "react-redux";

class CreateLead extends Component {

    constructor(props) {
        super(props);
        this.ok = this.ok.bind(this)
        this.cancel = this.cancel.bind(this)
        this.state = {
            modalName : "Create Lead"
        };
    }

    ok() {
        //Process the data

        this.props.closeModal(this.state.modalName)
    }
    cancel() {
        this.props.closeModal(this.state.modalName)
    }

    render() {
        let localization = this.props.localization.interaction.summary.createLead
        return (
            <MDBModal isOpen={true} toggle={this.props.closeModal} >
                <MDBModalHeader>{localization.title}</MDBModalHeader>
                <MDBModalBody >
                    <MDBRow className="p-2">
                        <MDBCol size="4">
                            <label htmlFor="first_name" className="grey-text">{localization.firstName}</label>
                            <input type="text"
                                   id="first_name"
                                   name="firstNameValue"
                                   className="form-control"
                                   value={this.state.firstNameValue}
                                   onChange={this.handleFormInput}
                            />
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="lead_id" className="grey-text">{localization.lastName}</label>
                            <input type="text"
                                   id="last_name"
                                   name="leadIDValue"
                                   className="form-control"
                                   value={this.state.leadIDValue}
                                   onChange={this.handleFormInput}
                            />
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="last_name" className="grey-text">{localization.email}</label>
                            <input type="text"
                                   id="email"
                                   name="lastNameValue"
                                   className="form-control"
                                   value={this.state.lastNameValue}
                                   onChange={this.handleFormInput}
                            />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="p-2">
                        <MDBCol size="4">
                            <label htmlFor="phone" className="grey-text">{localization.cellPhone}</label>
                            <input type="text"
                                   id="cell"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="phone" className="grey-text">{localization.homePhone}</label>
                            <input type="text"
                                   id="home"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="phone" className="grey-text">{localization.workPhone}</label>
                            <input type="text"
                                   id="work"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="p-2">
                        <MDBCol size="6">
                            <label htmlFor="phone" className="grey-text">{localization.address}</label>
                            <input type="text"
                                   id="address"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                        <MDBCol size="6">
                            <label htmlFor="phone" className="grey-text">{localization.address2}</label>
                            <input type="text"
                                   id="address2"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="p-2">
                        <MDBCol size="4">
                            <label htmlFor="phone" className="grey-text">{localization.city}</label>
                            <input type="text"
                                   id="city"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="phone" className="grey-text">{localization.state}</label>
                            <input type="text"
                                   id="state"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                        <MDBCol size="4">
                            <label htmlFor="phone" className="grey-text">{localization.zip}</label>
                            <input type="text"
                                   id="zip"
                                   name="phoneValue"
                                   value={this.state.phoneValue}
                                   onChange={this.handleFormInput}
                                   className="form-control"
                            />
                        </MDBCol>
                    </MDBRow>
                    <MDBModalFooter className="p-1"/>
                    <MDBRow>
                        <MDBCol size={"12"}>
                            <MDBBtn color="secondary" className="rounded float-left" onClick={this.cancel}>{localization.cancelButton}</MDBBtn>
                            <MDBBtn color="primary" className="rounded float-right" onClick={this.ok}>{localization.okButton}</MDBBtn>

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

export default connect(mapStateToProps, mapDispatchToProps)(CreateLead);
