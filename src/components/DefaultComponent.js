import React, {Component} from 'react'
import { MDBBox } from "mdbreact";
import {connect} from "react-redux";

class DefaultComponent extends Component {

    constructor(props) {
        super(props);


        this.state = {
        };

    }

    render() {
        return (
            <MDBBox className="d-flex">
                Subcomponents go here
            </MDBBox>
        )
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultComponent);
