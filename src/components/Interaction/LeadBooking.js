import React, {Component} from 'react'
import {MDBBox, MDBBtn} from 'mdbreact'
import {connect} from "react-redux";

class LeadBooking extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let localization = this.props.localization.interaction.booking
        return (
            <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                <div className="d-flex w-100 justify-content-end gray-border rounded p-2">
                    <MDBBtn>{localization.bookButton}</MDBBtn>
                </div>
                <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                    Booking stuff
                </div>
            </MDBBox>
        )
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
