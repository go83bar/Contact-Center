import React, {Component} from 'react'
import {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardHeader,
    MDBBox, MDBCardFooter, MDBBtn
} from "mdbreact";
import { connect } from 'react-redux'
import LoadingScreen from './LoadingScreen'
import LeadAPI from '../api/leadAPI'
import {Link} from "react-router-dom";

class NextLead extends Component {

    constructor(props) {
        super(props)


        this.state = {}

        // fetch nextlead API response, and set it into state
        LeadAPI.getNextLead()
            .then((response) => {
                // the existing PHP endpoint has some irregular output for errors
                // first check for APIException output
                if (response.success !== true) {
                    const errorObj = JSON.parse(response.error)
                    let errorMessage = "Critical Error, please notify Dev"
                    if (errorObj && errorObj.body !== undefined) {
                        errorMessage = errorObj.body
                    }
                    // Display error to user
                    this.setState({
                        nextLeadMessage: errorMessage
                    })
                } else {
                    // now check for empty queue situation
                    if (response.data === undefined) {
                        this.setState({
                            nextLeadMessage: "There seems to be a lack of leads!"
                        })
                    } else {
                        // push next lead preview data into store and redirect to preview screen
                        this.props.dispatch({type: 'PREVIEW.LOAD',payload: response.data})
                        this.props.history.push('/preview')
                    }
                }
            }).catch((reason) => {
                // TODO Handle error with fetch
                this.setState({
                    nextLeadMessage: "Fetch Error: " + reason
                })
            })

    }

    render() {
        const localization = this.props.localization.fetch
        if (this.state.nextLeadMessage === undefined) {
            return <LoadingScreen />
        }

        return (
            <MDBBox className="d-flex justify-content-center w-100">
                <MDBCard className="d-flex justify-content-center w-50 h-50 mt-5">
                    <MDBCardHeader className="skin-primary-background-color"><h3 className={"skin-text"}>
                        <strong>{localization.noLeads}</strong>
                        </h3></MDBCardHeader>
                    <MDBCardBody>
                        <MDBCardText className="ml-3">
                            {this.state.nextLeadMessage}
                        </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter className="d-flex justify-content-center">
                        <Link to="/" className="d-flex skin-secondary-color align-items-center justify-content-between">
                            <MDBBtn>{localization.back}</MDBBtn>
                        </Link>
                    </MDBCardFooter>
                </MDBCard>
            </MDBBox>
        )
    }
}

const mapStateToProps = store => {
    return {
        localization : store.localization,
        shift: store.shift
    }
}

export default connect(mapStateToProps)(NextLead);
