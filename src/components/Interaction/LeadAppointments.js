import React, {Component} from 'react'
import {MDBBox, MDBBtn} from 'mdbreact'
import {connect} from "react-redux";
import Active from "./appointments/cards/Active";
import moment from "moment";
import NewAppointmentBooking from './appointments/NewAppointmentBooking';

class LeadAppointments extends Component {

    constructor(props) {
        super(props);
        this.renderAppointments = this.renderAppointments.bind(this)
        this.state = {
        };
    }

    renderAppointments() {
        const appts = this.props.lead.appointments.map((appt, index) => {
            return <Active key={"appointment-" + index} data={appt}/>
        })
        return appts
    }

    render() {
        let localization = this.props.localization.interaction.appointment
        return (
            <MDBBox className={this.props.active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}>
                <div className="d-flex w-100 justify-content-end gray-border rounded">
                    <NewAppointmentBooking />
                </div>
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                        <span className="f-l font-weight-bold m-2">{localization.appointments}</span>
                        {this.props.lead.appointments && this.renderAppointments()}
                    </div>
                </MDBBox>
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        shift: state.shift
    }
}

export default connect(mapStateToProps)(LeadAppointments);

