import React, {Component} from 'react'
import {MDBBtn, MDBCol, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from 'mdbreact'
import {connect} from "react-redux";

class MergeLead extends Component {

    constructor(props) {
        super(props);
        this.ok = this.ok.bind(this)
        this.cancel = this.cancel.bind(this)
        this.state = {
            modalName : "Merge Lead"
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
        let localization = this.props.localization.interaction.summary.mergeLead
        return (
            <MDBModal isOpen={true} toggle={this.props.closeModal} >
                <MDBModalHeader>{localization.title}</MDBModalHeader>
                <MDBModalBody >
                    <MDBRow className="p-2">
                        <MDBCol size="6">
                            <label htmlFor="first_name" className="grey-text">{localization.firstName}</label>
                            <input type="text"
                                   id="first_name"
                                   name="firstNameValue"
                                   className="form-control"
                                   value={this.state.firstNameValue}
                                   onChange={this.handleFormInput}
                            />
                        </MDBCol>
                        <MDBCol size="6">
                            <label htmlFor="lead_id" className="grey-text">{localization.lastName}</label>
                            <input type="text"
                                   id="last_name"
                                   name="leadIDValue"
                                   className="form-control"
                                   value={this.state.leadIDValue}
                                   onChange={this.handleFormInput}
                            />
                        </MDBCol>
                        <MDBCol size="6">
                            <label htmlFor="last_name" className="grey-text">{localization.email}</label>
                            <input type="text"
                                   id="email"
                                   name="lastNameValue"
                                   className="form-control"
                                   value={this.state.lastNameValue}
                                   onChange={this.handleFormInput}
                            />
                        </MDBCol>
                        <MDBCol size="6">
                            <label htmlFor="phone" className="grey-text">{localization.cellPhone}</label>
                            <input type="text"
                                   id="cell"
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
                            <MDBBtn color="primary" className="rounded float-right" onClick={this.search}>{localization.searchButton}</MDBBtn>

                        </MDBCol>
                    </MDBRow>
                </MDBModalBody>
            </MDBModal>
        )
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead : state.lead,
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(MergeLead);
