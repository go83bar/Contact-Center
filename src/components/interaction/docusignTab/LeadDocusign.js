import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBCard, MDBSelect,} from 'mdbreact'
import {connect} from 'react-redux'
import DocumentAPI from "../../../api/documentAPI";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faFile,} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";
import {toast} from "react-toastify";

class LeadDocusign extends Component {

    constructor(props) {
        super(props);

        let sendOptions = []

        if (this.props.shift.docusign_templates !== undefined) {
            this.props.shift.docusign_templates.filter(template => template.client_id === this.props.lead.client_id).forEach(template => {
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
            if (response.success === "true") {
                // build new envelope to put into store
                const selectedTemplate = this.props.shift.docusign_templates.find( template => template.id === templateID)
                const newEnvelope = {
                    id: 1,
                    name: selectedTemplate.name,
                    sent_at: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
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

    renderDocusignList = () => {
        const timezone = this.props.lead.details.timezone
        const localization = this.props.localization.interaction.docusign
        const items = this.props.lead.docusign.map(envelope => {
            return (
                <MDBCard key={envelope.id} className="d-flex w-100 shadow-sm border-0 mb-2">
                    <MDBBox className="d-flex backgroundColorInherit skin-border-primary f-m w-100">
                        <div className='d-flex p-1 px-3 w-100'>
                            <span className="fa-layers fa-fw fa-3x mt-2">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                <FontAwesomeIcon icon={faFile} transform={"shrink-8"} className={"darkIcon"}/>
                            </span>
                            <div className="d-flex p-2 flex-column text-left w-75">
                                <span className="f-l">{envelope.name}</span>
                            </div>
                            <div className="d-flex flex-column f-s justify-content-start p-2 w-25 text-right">
                                <span>
                                    {localization.sentAtLabel}
                                       <span className="font-weight-bold">
                                        {moment.utc(envelope.sent_at).tz(timezone).format("MMM D")}
                                    </span>, {moment.utc(envelope.sent_at).tz(timezone).format("h:mm a z")}
                                </span>
                                {envelope.opened_at !== null && <span>
                                    {localization.openedAtLabel}
                                    <span className="font-weight-bold">
                                        {moment.utc(envelope.opened_at).tz(timezone).format("MMM D")}
                                    </span>, {moment.utc(envelope.opened_at).tz(timezone).format("h:mm a z")}
                                </span>}
                                {envelope.completed_at !== null && <span>
                                    {localization.completedAtLabel}
                                    <span className="font-weight-bold">
                                        {moment.utc(envelope.completed_at).tz(timezone).format("MMM D")}
                                    </span>, {moment.utc(envelope.completed_at).tz(timezone).format("h:mm a z")}
                                </span>}
                                {envelope.declined_at !== null && <span>
                                    {localization.declinedAtLabel}
                                    <span className="font-weight-bold">
                                        {moment.utc(envelope.declined_at).tz(timezone).format("MMM D")}
                                    </span>, {moment.utc(envelope.declined_at).tz(timezone).format("h:mm a z")}
                                </span>}
                                {envelope.voided_at !== null && <span>
                                    {localization.voidedAtLabel}
                                    <span className="font-weight-bold">
                                        {moment.utc(envelope.voided_at).tz(timezone).format("MMM D")}
                                    </span>, {moment.utc(envelope.voided_at).tz(timezone).format("h:mm a z")}
                                </span>}
                            </div>
                        </div>
                    </MDBBox>
                </MDBCard>
            )
        })

        return (
            <MDBBox className='d-flex flex-column w-100 mb-3'>
                {items}
            </MDBBox>
        )
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
                        {this.props.localization.interaction.docusign.sendButton}
                    </MDBBtn>
                </div>
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                        <span
                            className="f-l font-weight-bold m-2">{this.props.localization.interaction.docusign.listTitle}</span>
                        {this.props.lead.docusign && this.renderDocusignList()}
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