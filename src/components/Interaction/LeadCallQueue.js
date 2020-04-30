import React, {Component} from 'react'
import {MDBBox} from 'mdbreact'

class LeadCallQueue extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        if (this.props.active === true) {
            return (
                <MDBBox className="w-100 p-0 m-0">
                    Call Queue
                </MDBBox>
            )
        } else {
            return null
        }
    }
}
export default LeadCallQueue;
