import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBSelect,} from 'mdbreact'
import {connect} from 'react-redux'
import DocumentAPI from "../../../api/documentAPI";
import moment from "moment-timezone";
import {toast} from "react-toastify";
import Envelope from "./Envelope";

class LeadDocusign extends Component {

    constructor(props) {
        super(props);

        // set up template select dropdown options
        // TODO replace the busted MDBSelect with a proper dropdown
        let sendOptions = []
        if (this.props.shift.docusign_templates !== undefined) {
            // filter array of templates available to the agent
            this.props.shift.docusign_templates.filter(template => {
                // remove templates that the lead already has an existing non-voided, non-declined envelope for
                for (var i = 0; i < this.props.lead.docusign.length; i++) {
                    const envelope = this.props.lead.docusign[i]
                    if (envelope.template_id === template.id && envelope.voided_at === null && envelope.declined_at === null) {
                        return false;
                    }
                }

                // only keep templates for the lead's client
                return template.client_id === this.props.lead.client_id

            }).forEach(template => {
                // add each filtered template to the dropdown options
                sendOptions.push({
                    text: template.name,
                    value: "" + template.id
                })
            })
        }

        this.state = {
            sendDisabled: true,
            selectedTemplateID: undefined,
            sendOptions
        };
    }

    handleTemplateSelect = (values) => {
        const templateID = parseInt(values[0])

        this.setState({ selectedTemplateID: templateID, sendDisabled: false })
    }

    sendDocusign = () => {
        this.setState({sendDisabled: true})
        const templateID = this.state.selectedTemplateID
        const docusignParams = {
            templateID,
            leadID: this.props.lead.id
        }
        DocumentAPI.sendDocusign(docusignParams).then((response) => {
            if (response.success) {
                // build new envelope to put into store
                const selectedTemplate = this.props.shift.docusign_templates.find( template => template.id === templateID)
                const newEnvelope = {
                    id: response.envelope_id,
                    template_id: templateID,
                    name: selectedTemplate.name,
                    sent_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
                    resent_at: null,
                    opened_at: null,
                    completed_at: null,
                    declined_at: null,
                    voided_at: null
                }

                // notify user
                toast.success(this.props.localization.toast.docusign.sendSuccess)

                // set new envelope into lead store data
                this.props.dispatch({
                    type: "LEAD.DOCUSIGN.SENT",
                    data: newEnvelope
                })

                // enable send button
                this.setState({selectedTemplateID: undefined, sendDisabled: false})
            } else {
                toast.error(this.props.localization.toast.docusign.sendError)
                console.log("Send Template error: ", response)
            }
        }).catch(error => {
            toast.error(this.props.localization.toast.docusign.sendError)
            console.log("Could not send template: ", error)
        })
    }

    render() {
        return (
            <MDBBox className={this.props.active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}>
                <div className="d-flex w-100 justify-content-end align-items-center gray-border rounded">
                    <MDBSelect options={this.state.sendOptions}
                               getValue={this.handleTemplateSelect}
                               label={this.props.localization.interaction.docusign.templateOptionsLabel}
                               className="w-50 mr-2"
                    />
                    <MDBBtn rounded
                            onClick={this.sendDocusign}
                            disabled={this.state.sendDisabled}
                            style={{maxHeight: "50px"}}
                    >
                        {this.state.disabled ? this.props.localization.interaction.docusign.sendingButtonLabel : this.props.localization.interaction.docusign.sendButtonLabel}
                    </MDBBtn>
                </div>
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                        <span
                            className="f-l font-weight-bold m-2">{this.props.localization.interaction.docusign.listTitle}</span>
                        {this.props.lead.docusign.map(envelope => {
                            return <Envelope key={envelope.id} envelope={envelope} />
                        })}
                    </div>
                </MDBBox>
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        shift: state.shift,
        user: state.user
    }
}

export default connect(mapStateToProps)(LeadDocusign)