import React, {Component} from 'react'
import {
    MDBBox,
    MDBCardHeader,
    MDBCardBody,
    MDBCard, MDBChip, MDBStepper, MDBStep

} from "mdbreact";

import TimelineTouchpoints from "./timeline/TimelineTouchpoints";
import Interaction from "./timeline/cards/Interaction";

class LeadTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MDBBox className="d-flex flex-row overflow-auto flex-1 p-0 m-0 w-auto">
                        <TimelineTouchpoints/>
                        <MDBCard className="d-flex order-1 overflow-auto w-100 border-0 backgroundColorInherit">
                            <MDBCardHeader className="d-flex card-header-no-back-no-border bg-white mb-3 f-s py-2 px-3 justify-content-end">
                                <span className="px-2">All Interactions</span><span className="px-2">Call</span>
                                <span className="px-2">Emails</span><span className="px-2">Messages</span><span className="px-2">Appointments</span>
                            </MDBCardHeader>
                            <MDBCardBody className="py-0 flex-column">
                                <MDBStepper vertical className="m-0 p-0 timelineStepperRight" >
                                    <MDBStep className="mb-4">
                                        <div className="" style={{width:"80px", zIndex:2}}>
                                          <MDBChip className="m-0 timelineChip font-weight-bold">FEB 22</MDBChip>
                                        </div>
                                    </MDBStep>
                                    <MDBStep className="mb-4">
                                        <Interaction/>
                                    </MDBStep>
                                    <MDBStep className="mb-4">
                                        <div className="" style={{width:"80px", zIndex:2}}>
                                            <MDBChip className="m-0 timelineChip font-weight-bold">FEB 21</MDBChip>
                                        </div>
                                    </MDBStep>
                                    <MDBStep className="mb-4">
                                        <Interaction/>
                                    </MDBStep>
                                    <MDBStep className="mb-4">
                                        <Interaction/>
                                    </MDBStep>
                                    <MDBStep>
                                        <div className="" style={{width:"80px", zIndex:2}}>
                                            <MDBChip className="m-0 timelineChip font-weight-bold">FEB 20</MDBChip>
                                        </div>
                                    </MDBStep>
                                </MDBStepper>
                            </MDBCardBody>
                        </MDBCard>
            </MDBBox>
        )
    }
}

export default LeadTimeline;
