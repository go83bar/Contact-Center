import React, {Component} from 'react'
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";

class CallBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MDBContainer>
                Call Bar
                <MDBRow>
                    <MDBCol size={"4"}>
                        Lead
                    </MDBCol>
                    <MDBCol size={"4"}>
                        Me
                    </MDBCol>
                    <MDBCol size={"4"}>
                        Provider
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}
export default CallBar;
