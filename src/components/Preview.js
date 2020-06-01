import React, {Component} from 'react'
import {MDBCard, MDBCardBody, MDBCardHeader, MDBBtn, MDBBox, MDBCardFooter, MDBChip} from "mdbreact";
import { connect } from 'react-redux'
import LoadingScreen from './LoadingScreen'
import LeadAPI from '../api/leadAPI'
import * as moment from 'moment'
//import {preview} from "../reducers/preview";

class Preview extends Component {

    constructor(props) {
        super(props)

        this.startInteraction = this.startInteraction.bind(this)

        this.state = {
        }

        //console.log(props.previewData)
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
            LeadAPI.getLeadPreview(previewPayload)
                .then((response) => {
                    this.setState({
                        leadData: response.data
                    })
                })

        }

        // no need to wait for interaction to start, we can start loading
        // lead data right here and put it into store ahead of time
        LeadAPI.getLeadDTO({leadID: leadID})
            .then((responseJson) => {
                //console.log(responseJson);
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
        // Make API call to start interaction
        const payload = {
            callQueueID: null,
            leadID: this.props.previewData.leadID,
            previewStartTime: moment().format()

        }
        LeadAPI.startInteraction(payload)
            .then( response => {
                if (response.success) {
                    // set received interaction ID into store
                    this.props.dispatch({
                        type: "INTERACTION.LOAD",
                        payload: {
                            id: response.data.id
                        }
                    })
                }
            })

        // Redirect to interaction view
        this.props.history.push("/interaction")
    }

    render() {
        /*let formatPhoneNumber = (str) => {
            //Filter only numbers from the input
            let cleaned = ('' + str).replace(/\D/g, '');

            //Check if the input is of correct length
            let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

            if (match) {
                return '(' + match[1] + ') ' + match[2] + '-' + match[3]
            };

            return null
        };*/

        let localization = this.props.localization.preview
        // Display loading image until lead preview data is loaded
        if (this.props.previewData === undefined) {
            return <LoadingScreen />
        }
        let lead = this.props.previewData

        // Build list of preview data items
        const data = this.state.leadData.meta.map((item, i) => {
            return (
                <div key={i}>{item.name}: {item.value}</div>
            )
        })
        return (
            <MDBBox className="d-flex justify-content-center" style={{margin: "10% auto"}} >
                    <MDBCard className="d-flex card-body" style={{width:"585px", height:"450px"}}>
                        <MDBCardHeader className="d-flex justify-content-start backgroundColorInherit">
                            <h3>
                            <strong>{this.state.leadData.lead_name}</strong> / {this.state.leadData.reason}
                            </h3>
                        </MDBCardHeader>
                        <MDBCardBody className='justify-content-start border skin-border-primary'>
                                <div>
                                    <MDBChip className={"outlineChip mb-2"}>{localization.id}: {lead.lead_id}</MDBChip>

                                    {data}
                                </div>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-end">
                            <MDBBtn rounded className="skin-primary-background-color f-l" onClick={this.startInteraction}>{localization.nextButton}</MDBBtn>
                        </MDBCardFooter>

                    </MDBCard>
            </MDBBox>
        )
    }
}

const mapStateToProps = store => {
    return {
        localization : store.localization,
        previewData: store.preview,
        shift: store.shift
    }
}

export default connect(mapStateToProps)(Preview);
