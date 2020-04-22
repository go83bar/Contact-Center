import React, {Component} from 'react'
import { MDBBox, MDBCard} from "mdbreact";
import {connect} from "react-redux";
import SurveyThumb from "./SurveyThumb"

class ThumbsContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            thumbs: props.surveys.map( (submission) => {
                return <SurveyThumb
                    key={submission.id}
                    submission={submission}
                    />
            })
        };
    }

    render() {
        return (
            <MDBBox className="mr-2" style={{width: "30%"}}>
            <MDBCard border="light" className="p-2 rounded">
                    <strong className="black-text">{this.props.localization.interaction.survey.tabTitle.toUpperCase()}</strong>
                    <MDBBox className="loopContainerPlaceholder">
                        {this.state.thumbs}
                    </MDBBox>
            </MDBCard>
        </MDBBox>
)
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThumbsContainer);
