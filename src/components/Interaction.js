import React, {Component} from 'react'
import {MDBContainer} from "mdbreact";
import LeadSummary from "./Interaction/LeadSummary";
import LeadDetail from "./Interaction/LeadDetail";
import CallBar from "./Interaction/CallBar";

class Interaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MDBContainer fluid>
                <LeadSummary/>
                <CallBar/>
                <LeadDetail/>
            </MDBContainer>
        )
    }
}
export default Interaction;
