import React, {Component} from 'react'
import {
    MDBBox,
} from 'mdbreact';
import {connect} from "react-redux";
import ScrollLink from '../../ui/ScrollLink'
import SurveyIcon from './SurveyIcon'
import * as moment from 'moment'

class SurveyThumb extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const parsedTime = moment(this.props.submission.submission_date)
        const thisYear = moment()
        let dateDisplay = parsedTime.format("MMM D").toUpperCase();
        if (parsedTime.isBefore(thisYear, 'year')) {
            dateDisplay = dateDisplay + ", " + parsedTime.format("YYYY")
        }
        return (<MDBBox className="d-flex justify-content-center">
        <MDBBox className="text-right pr-2 pt-2" style={{ width: "25%"}}>
            <MDBBox className="survey-thumb-date">
                <strong>{dateDisplay}</strong><br />
                {parsedTime.format("h:mm a")} CDT
            </MDBBox>
        </MDBBox>
        <MDBBox style={{width: "15%"}}>
            <ScrollLink target={"survey-" + this.props.submission.id}>
                <SurveyIcon />
            </ScrollLink>
        </MDBBox>
        <MDBBox className="pl-3 pt-2" style={{ width: "50%"}}>
            <p>
                <strong>{this.props.submission.name}</strong><br />
                <small>
                    <strong>Qualified:</strong> {this.props.submission.disqualified ? "No" : "Yes"}<br />
                    <strong>Score:</strong> {this.props.submission.score}
                </small>
            </p>
        </MDBBox>
    </MDBBox>)
}
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
    }
}

export default connect(mapStateToProps)(SurveyThumb);
