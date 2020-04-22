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

        console.log(props.previewData)
        let leadID = 0

        // if this is a queued lead, we will already have preview data
        if (props.previewData.lead_name !== undefined) {
            this.state.leadData = props.previewData
            leadID = props.previewData.lead_id
        } else {
            // otherwise we should have lead ID in the store, fetch preview
            // response from the API and set it into state when we get it
            const previewPayload = {
                leadID: props.previewData.leadID,
                callQueueID: props.previewData.callQueueID
            }
            leadID = props.previewData.leadID
            LeadAPI.getLeadPreview(props.auth.auth, previewPayload)
                .then((response) => {
                    this.setState({
                        leadData: response.data
                    })
                })

        }

        // no need to wait for interaction to start, we can start loading
        // lead data right here and put it into store ahead of time
        LeadAPI.getLeadDTO(this.props.auth.auth, {leadID: leadID})
            .then((responseJson) => {
                console.log(responseJson);
                const clientIndex = this.props.shift.clients.findIndex(client => client.id === responseJson.client_id)
                responseJson["client_index"] = clientIndex
                if (clientIndex === -1) {
                    // serious problem, lead's client doesn't exist in agent's shift data
                    // TODO handle error
                    return
                }

                const campaignIndex = this.props.shift.clients[clientIndex].campaigns.findIndex(campaign => campaign.id === responseJson.campaign_id);
                responseJson["campaign_index"] = campaignIndex
                if (campaignIndex === -1) {
                    // lead's campaign doesn't exist in agent's shift data
                    // TODO handle error
                    return
                }

                const regionIndex = this.props.shift.clients[clientIndex].regions.findIndex(region => region.id === responseJson.region_id);
                responseJson["region_index"] = regionIndex
                if (regionIndex === -1) {
                    // lead's region doesn't exist in agent's shift data
                    // TODO handle error
                    return
                }
                this.props.dispatch({type: 'LEAD.LOAD',payload: responseJson})
            })
    }

    startInteraction() {
        // TODO make API call to startInteraction here

        this.props.history.push("/interaction")
    }

    render() {
        // Display loading image until lead preview data is loaded
        if (this.state.leadData === undefined) {
            return <LoadingScreen />
        }

        // Build list of preview data items
        const data = this.state.leadData.meta.map((item, i) => {
            return (
                <li key={i}>{item.name}: {item.value}</li>
            )
        })
        return (
            <MDBRow className="w-100" center style={{ marginTop: "10%" }}>
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
    return {
        auth: state.auth,
        localization : state.localization,
        previewData: state.preview,
        shift: state.shift
    }
}

const mapDispatchToProps = dispatch => { return { dispatch }}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
