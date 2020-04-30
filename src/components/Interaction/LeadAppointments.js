import React, {Component} from 'react'
import {MDBBox} from 'mdbreact'
import {connect} from "react-redux";
import Active from "./appointments/cards/Active";

class LeadAppointments extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        if (this.props.active === true) {

            let localization = this.props.localization.interaction.appointment
            return (
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                        <span className="f-l font-weight-bold m-2">{localization.activeAppointments}</span>
                        <Active/>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeadAppointments);

