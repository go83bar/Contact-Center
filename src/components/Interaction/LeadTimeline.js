import React, {Component} from 'react'
import {MDBContainer, MDBIcon, MDBStepper, MDBStep, MDBBtn} from "mdbreact";

class LeadTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MDBContainer>
                <MDBStepper vertical>
                    <MDBStep>
                        <MDBBtn floating outline><MDBIcon icon={"calendar-check"} className={"timelineIcon"}/></MDBBtn>
                    </MDBStep>
                    <MDBStep>
                        <MDBBtn floating outline><MDBIcon icon={"comment"} className={"timelineIcon"}/></MDBBtn>
                    </MDBStep>
                    <MDBStep>
                        <MDBBtn floating outline><MDBIcon icon={"envelope"} className={"timelineIcon"}/></MDBBtn>
                    </MDBStep>
                    <MDBStep>
                        <MDBBtn floating outline><MDBIcon icon={"phone"} className={"timelineIcon"}/></MDBBtn>
                    </MDBStep>
                    <MDBStep>
                        <MDBBtn floating outline><MDBIcon icon={"poll"} className={"timelineIcon"} rotate={"90"}/></MDBBtn>
                    </MDBStep>
                </MDBStepper>
            </MDBContainer>
        )
    }
}
export default LeadTimeline;
