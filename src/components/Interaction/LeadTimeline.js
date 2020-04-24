import React, {Component} from 'react'
import {
    MDBBox,
    MDBCardHeader,
    MDBCardBody,
    MDBCard

} from "mdbreact";

import TimelineTouchpoints from "./timeline/TimelineTouchpoints";

class LeadTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <MDBBox className="d-flex flex-row overflow-auto flex-1 p-0 m-0 w-auto">
                        <TimelineTouchpoints/>
                        <MDBCard className="d-flex order-1 overflow-auto w-100 border-0">
                            <MDBCardHeader className="card-header-no-back-no-border bg-white">All</MDBCardHeader>
                            <MDBCardBody></MDBCardBody>
                        </MDBCard>
            </MDBBox>
        )
    }
}

export default LeadTimeline;
