import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBCardBody, MDBCard, MDBSelect} from 'mdbreact'
import {connect} from "react-redux";

class LeadBooking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apptType: [
                { text : "type", value:"1"}
            ],
            office: [
                { text : "type", value:"1"}
            ]

        };
    }

    render() {
        if (this.props.active === true) {

            let localization = this.props.localization.interaction.booking
            return (
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className="d-flex w-100 justify-content-end gray-border rounded p-2">
                        <MDBBtn rounded>{localization.bookButton}</MDBBtn>
                    </div>
                    <MDBCard className="d-flex flex-column w-100 mt-2 bg-white gray-border">
                        <div className="gray-background p-2">{localization.title}</div>
                        <MDBCardBody className="d-flex w-100 flex-row flex-wrap justify-content-center">
                            <MDBBox className="d-flex w-50">
                                <MDBSelect className="w-100" options={this.state.apptType} selected={localization.selectAppointment}/>
                            </MDBBox>
                            <MDBBox className="d-flex w-50">
                                <MDBSelect className="w-100" options={this.state.office} selected={localization.selectOffice}/>
                            </MDBBox>
                            <MDBBox className="d-flex w-100">
                                <MDBBox className="d-flex flex-column w-50">
                                    {localization.qualifyingTitle}
                                    <MDBSelect className="d-flex w-50" options={this.state.apptType} selected={localization.selectAppointment}/>
                                    <MDBSelect className="d-flex w-50" options={this.state.office} selected={localization.selectOffice}/>
                                </MDBBox>
                                <MDBBox className="d-flex flex-column w-50">
                                    {localization.qualifyingTitle}
                                    <MDBSelect className="d-flex w-50" options={this.state.apptType} selected={localization.selectAppointment}/>
                                    <MDBSelect className="d-flex w-50" options={this.state.office} selected={localization.selectOffice}/>
                                </MDBBox>
                            </MDBBox>
                        </MDBCardBody>
                    </MDBCard>
                </MDBBox>
            )
        } else {
            return null
        }
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead : state.lead,
        shift: state.shift
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadBooking);
