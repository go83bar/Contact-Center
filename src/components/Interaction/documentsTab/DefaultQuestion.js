import React, {Component} from 'react'
import {MDBBox} from 'mdbreact'
import {connect} from "react-redux";

class DefaultQuestion extends Component {

    render() {
        return (
            <MDBBox className="d-flex flex-column w-100 mb-4">
                <span>{this.props.data.questionLabel}</span>
                <span className="f-s grey-text">{this.props.localization.interaction.documents.defaultQuestionNotice}</span>

            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
    }
}

export default connect(mapStateToProps)(DefaultQuestion)