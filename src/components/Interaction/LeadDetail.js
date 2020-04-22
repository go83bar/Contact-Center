import React, {Component} from 'react'
import {MDBCard} from "mdbreact";
import {connect} from "react-redux";


class LeadDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <MDBCard className={"w-100 p-2 mb-2 d-flex border rounded skin-border-primary"} style={{flex:"0 65px"}}>

                Lead Details
            </MDBCard>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead: state.lead
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetail);
