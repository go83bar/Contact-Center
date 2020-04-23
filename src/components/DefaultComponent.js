import React, { Component } from 'react'
import { MDBBox } from "mdbreact"
import { connect } from "react-redux"

class DefaultComponent extends Component {

    constructor(props) {
        super(props)


        this.state = {
        }

    }

    render() {
        return (
            <MDBBox className="d-flex">
                Subcomponents go here
            </MDBBox>
        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(DefaultComponent);
