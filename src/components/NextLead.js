import React, {Component} from 'react'
import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardText, 
    MDBCardHeader, 
    MDBBox
} from "mdbreact";
import { connect } from 'react-redux'
import LoadingScreen from './LoadingScreen'
import LeadAPI from '../api/leadAPI'

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
        if (this.state.nextLeadMessage === undefined) {
            return <LoadingScreen />
        }

        return (
            <MDBBox>
                <MDBCard className="card-body">
                    <MDBCardHeader><h3>
                        <strong>No Leads For You</strong>
                        </h3></MDBCardHeader>
                    <MDBCardBody>
                        <MDBCardText className="ml-3">
                            {this.state.nextLeadMessage}
                        </MDBCardText>
                    </MDBCardBody>
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
