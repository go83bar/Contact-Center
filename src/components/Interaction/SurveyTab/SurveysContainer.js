import React, {Component} from 'react'
import { MDBBox} from "mdbreact";
import {connect} from "react-redux";
import SurveySubmission from "./SurveySubmission"

class SurveysContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            surveys: props.surveys.map( (submission) => {
                return <SurveySubmission
                    key={submission.id}
                    survey={submission}
                    />
            })
        };
    }

    componentDidUpdate() {
        console.log("Updating SurveysContainer");
        this.setState({
            surveys: this.props.surveys.map( (submission) => {
            return <SurveySubmission
                key={submission.id}
                survey={submission}
                />
            })
        })
    }

    render() {
        return (
            <MDBBox border="light" className="rounded d-flex overflow-auto flex-1 order-1">
                <div className="smooth-scroll flex-1 order-1 d-flex overflow-auto flex-column">
                    {this.state.surveys}
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SurveysContainer);
