import React, {Component} from 'react'
import { MDBCard, MDBCardBody, MDBCardText, MDBCardHeader, MDBBtn, MDBRow, MDBCol } from "mdbreact";
import { connect } from 'react-redux'
import LoadingScreen from './LoadingScreen'
import LeadAPI from '../api/leadAPI'

class Preview extends Component {

    constructor(props) {
        super(props)

        this.startInteraction = this.startInteraction.bind(this)

        this.state = {}

        // grab store data, fetch preview response, and set it into state
        const previewPayload = {
            leadID: this.props.previewData.leadID,
            callQueueID: this.props.previewData.callQueueID
        }
        LeadAPI.getLeadPreview(this.props.auth.auth, previewPayload)
            .then((response) => {
                console.log(response)
                this.setState({
                    leadData: response.data
                })
            })
    }

    startInteraction() {

    }

    render() {
        if (this.state.leadData === undefined) {
            return <LoadingScreen />
        }

        const data = this.state.leadData.meta.map((item, i) => {
            return (
                <li key={i}>{item.name}: {item.value}</li>
            )
        })
        return (
            <MDBRow center>
                <MDBCol size="6">
                    <MDBCard className="card-body">
                        <MDBCardHeader><h3>
                            <strong>{this.state.leadData.lead_name}</strong> / {this.state.leadData.reason}
                            </h3></MDBCardHeader>
                        <MDBCardBody>
                            <MDBCardText className="ml-3">
                                Broham we got some text for this!
                            </MDBCardText>
                                <div><ul>
                                    {data}
                                </ul></div>
                        <MDBBtn color="primary-color" onClick={this.startInteraction}>Start Interaction</MDBBtn>
                        </MDBCardBody>

                    </MDBCard>
                </MDBCol>
            </MDBRow>
        )
    }
}

const mapStateToProps = state => {
    return { auth: state.auth, localization : state.localization, previewData: state.preview }
}

const mapDispatchToProps = dispatch => { return { dispatch }}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
