import React, {Component} from 'react'
import {MDBBox} from 'mdbreact'

class LeadAppointments extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MDBBox className="d-flex border justify-content-around" >
                <div className="w-100">Appointments</div>
            </MDBBox>
        )
    }
}
export default LeadAppointments;
