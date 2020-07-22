import React, {Component} from 'react'
import {MDBCard, MDBCardBody, MDBCardHeader, MDBBtn, MDBBox, MDBCardFooter, MDBChip} from "mdbreact";
import { connect } from 'react-redux'
import LoadingScreen from './LoadingScreen'
import LeadAPI from '../api/leadAPI'
import * as moment from 'moment'
import Lead from "../utils/Lead";
//import {preview} from "../reducers/preview";

class Preview extends Component {

    constructor(props) {
        super(props)

        this.startInteraction = this.startInteraction.bind(this)

        this.state = {
            previewStartTime: moment().utc().format('YYYY-MM-DD HH:mm:ss')
        }

        //console.log(props.previewData)
        let leadID = 0

        // if this is a queued lead, we will already have preview data
        if (props.previewData.lead_id !== undefined) {
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
                    this.props.dispatch({type: "PREVIEW.LOADED", payload: response.data})
                }).catch( error => {
                    console.log("Could not load preview: ", error)
                })
        }

        // no need to wait for interaction to start, we can start loading
        // lead data right here and put it into store ahead of time
        Lead.loadLead(leadID).then( result => { console.log("Lead loaded")});
    }

    startInteraction() {
        // Make API call to start interaction
        const payload = {
            callQueueID: this.props.previewData.queue_id === undefined ? null : this.props.previewData.queue_id,
            leadID: this.props.previewData.lead_id,
            previewStartTime: this.state.previewStartTime
        }
        LeadAPI.startInteraction(payload)
            .then( response => {
                if (response.success) {
                    // set received interaction ID into store
                    this.props.dispatch({
                        type: "INTERACTION.LOAD",
                        payload: {
                            id: response.data.id,
                            outcome_id: 27,
                            outcome_reason_id: null,
                            reason_id: null,
                            created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
                            created_by: this.props.user.label_name
                        }
                    })
                }
                // Redirect to interaction view
                this.props.history.push("/interaction")
            }).catch( error => {
                console.log("Could not start interaction: ", error)
            })

    }

    render() {
        let localization = this.props.localization.preview
        // Display loading image until lead preview data is loaded
        if (this.props.previewData.lead_id === undefined) {
            return <LoadingScreen />
        }

        // Build list of preview data items
        const data = this.props.previewData.meta.map((item, i) => {
            return (
                <div key={i}>{item.name}: {item.value}</div>
            )
        })
        return (
            <MDBBox className="d-flex justify-content-center" style={{margin: "10% auto"}} >
                    <MDBCard className="d-flex card-body" style={{width:"585px", height:"480px"}}>
                        <MDBCardHeader className="d-flex justify-content-start backgroundColorInherit">
                            <h3>
                            <strong>{this.props.previewData.lead_name}</strong> / {this.props.previewData.reason}
                            </h3>
                        </MDBCardHeader>
                        <MDBCardBody className='justify-content-start border skin-border-primary'>
                                <div>
                                    <MDBChip className={"outlineChip mb-2"}>{localization.id}: {this.props.previewData.lead_id}</MDBChip>

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
        shift: store.shift,
        user: store.user
    }
}

export default connect(mapStateToProps)(Preview);
