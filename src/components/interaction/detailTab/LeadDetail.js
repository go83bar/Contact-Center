import React, {Component} from 'react'
import {MDBBox, MDBCard, MDBCardBody, MDBSelect, MDBTooltip} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faStar,
} from "@fortawesome/pro-solid-svg-icons";
import Slack from "../../../utils/Slack";
import String from "../../../utils/String";
import LeadAPI from "../../../api/leadAPI";
import {toast} from "react-toastify";
import moment from "moment";


class LeadDetail extends Component {

    constructor(props) {
        super(props)

        // region options
        const regionOptions = this.props.lead.client.regions.filter(region => region.active).map(region => {
            return {
                value: region.id.toString(),
                text: region.name,
                checked: region.id === this.props.lead.region_id
            }
        })
        this.state = {
            regionOptions,
            leadIDCopyTooltip: props.localization.interaction.details.copyLeadIDTooltip
        }
    }

    copyToClipboard = (copyVal) => {
        let dummyInput = document.createElement("input")
        document.body.appendChild(dummyInput)
        dummyInput.value = copyVal
        dummyInput.select()
        document.execCommand("copy")
        document.body.removeChild(dummyInput)
    }

    copyOfficeDataToClipboard = (office) => () => {
        const officeData = `${office.name} ${office.office_phone} ${office.address} ${office.city}, ${office.state} ${office.zip}`
        this.copyToClipboard(officeData)
    }

    copyLeadIDToClipboard = () => {
        const leadID = this.props.lead.id
        this.copyToClipboard(leadID)

        this.setState({leadIDCopyTooltip: this.props.localization.interaction.details.copiedTooltip})
    }

    clearCopyMessage = () => {
        this.setState({leadIDCopyTooltip: this.props.localization.interaction.details.copyLeadIDTooltip})
    }

    onRegionSelect = (values) => {
        const regionID = parseInt(values[0])

        const newRegion = this.props.lead.client.regions.find(region => region.id === regionID)
        if (newRegion === undefined) {
            toast.error(this.props.localization.toast.details.selectedRegionMissing)
            return
        }

        // call API method and dispatch new data to the store when it's complete
        const data = {
            lead_id: this.props.lead.id,
            interaction_id: this.props.interaction.id,
            updates: {
                region_id: regionID
            }
        }
        LeadAPI.updateDetails(data)
            .then(response => {
                if (response.success !== true) {
                    toast.error(this.props.localization.toast.details.updateFailed)
                } else {
                    toast.success(this.props.localization.toast.details.updateSucceeded)
                    this.props.dispatch({
                        type: "LEAD.REGION_UPDATED",
                        data: {
                            regionID,
                            interactionID: this.props.interaction.id,
                            time: moment.utc().format('YYYY-MM-DD hh:mm:ss'),
                            createdBy: this.props.user.label_name,
                            newRegion
                        }
                    })
                }
            })

    }

    generatePreferredOfficeChip = () => {
        const preferredOfficeMeta = this.props.lead.meta.find(meta => {
            return meta.key === "preferred_office"
        })
        if (preferredOfficeMeta !== undefined) {
            const office = this.props.lead.client.offices.find(office => office.id === parseInt(preferredOfficeMeta.value))
            if (office) {
                return (
                    <MDBTooltip placement="left" domElement tag="span" material>
                            <span>
                                <MDBBox onClick={this.copyOfficeDataToClipboard(office)}  className="mb-0">{this.props.localization.interaction.details.preferredOfficeLabel}<span className="font-weight-bold skin-secondary-color">{String.truncate(office.name, 25)}</span></MDBBox>
                            </span>
                        <span>{office.name}<br />{office.office_phone}<br />{office.address}<br />{office.city}, {office.state} {office.zip}</span>
                    </MDBTooltip>
                )
            } else {
                Slack.sendMessage(`Lead ${this.props.lead.id} has preferred office that is not in client data`)
            }
        }
        return null
    }

    render() {
        const lead = this.props.lead
        const phase = this.props.shift.phases.find(phase => phase.id === lead.phase_id)
        let localization = this.props.localization.interaction.details
        const campaignNumbers = lead.campaign.twilioNumbers
        let outboundPhone = "Error";
        if (campaignNumbers !== undefined && campaignNumbers[lead.region_id] !== undefined) {
            outboundPhone = campaignNumbers[lead.region_id]
        }

        let formatPhoneNumber = (str) => {
            //Filter only numbers from the input
            let cleaned = ('' + str).replace(/\D/g, '')

            //Check if the input is of correct length
            let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

            if (match) {
                return '(' + match[1] + ') ' + match[2] + '-' + match[3]
            }

            return null
        }

        return (
            <MDBCard className="w-100 p-2 mb-2 d-flex border rounded skin-border-primary">
                <MDBCardBody className="d-flex flex-wrap w-100 p-2">
                    <div className="d-flex flex-column justify-content-between pr-3 mb-3 mr-3 border-right flex-grow-1">
                        <span className="d-flex justify-content-between border-bottom pb-2">
                            <span className="mr-3">
                                {lead.details.preferred_phone === "cell" && <FontAwesomeIcon icon={faStar} className="skin-primary-color"/>} {localization.cellPhoneLabel} <span className="font-weight-bold skin-secondary-color">{formatPhoneNumber(lead.details.cell_phone)}</span>
                            </span>
                            {lead.details.home_phone &&
                            <span>
                                {lead.details.preferred_phone === "home" && <FontAwesomeIcon icon={faStar} className="skin-primary-color"/>} {localization.homePhoneLabel} <span className="font-weight-bold skin-secondary-color">{formatPhoneNumber(lead.details.home_phone)}</span>
                            </span>}
                        </span>
                        <span className="border-bottom py-2">
                            <span>{localization.addressLabel}
                                <span className="font-weight-bold skin-secondary-color">{lead.details.address_1}</span>
                            </span>
                            {lead.details.address_2 && <span> , {lead.details.address_2}</span>}
                        </span>
                        <span className="d-flex justify-content-between border-bottom py-2">
                            <span>{localization.cityLabel}
                                <span className="font-weight-bold skin-secondary-color">{lead.details.city}</span>
                            </span>
                            <span className="pl-2 border-left mw-25">{localization.stateLabel}
                                <span className="font-weight-bold skin-secondary-color">{lead.details.state}</span>
                            </span>
                            <span className="pl-2 border-left mw-25">{localization.zipLabel}
                                <span className="font-weight-bold skin-secondary-color">{lead.details.zip}</span>
                            </span>
                        </span>
                        <span className="d-flex justify-content-between pt-2">
                            <span>{localization.emailLabel}<span className="font-weight-bold skin-secondary-color">{lead.details.email}</span></span>
                            <span className="pl-2 border-left mw-25">{localization.DOBLabel}<span className="font-weight-bold skin-secondary-color">{lead.details.date_of_birth}</span></span>
                        </span>

                    </div>
                    <div className="d-flex flex-column align-items-start pr-3 mr-3 mb-3 flex-grow-1 border-right">
                        <MDBTooltip placement="right" domElement tag="span" material sm>
                            <span>
                                <MDBBox className="mb-0" onClick={this.copyLeadIDToClipboard} onMouseOut={this.clearCopyMessage}>{localization.leadIDLabel}<span className="font-weight-bold skin-secondary-color">{lead.id}</span></MDBBox>
                            </span>
                            <span>{this.state.leadIDCopyTooltip}</span>
                        </MDBTooltip>
                        <MDBBox className="mb-2">{localization.phaseLabel}<span className="font-weight-bold skin-secondary-color">{phase.label}</span></MDBBox>
                        <MDBBox className="mb-0 w-100">
                            <MDBSelect className="mb-0"
                             options={this.state.regionOptions}
                             search={this.state.regionOptions.length > 8}
                             getValue={this.onRegionSelect}
                             label={localization.regionLabel}
                            />
                        </MDBBox>
                        <MDBBox className="mb-0">{localization.regionPhoneLabel}<span className="font-weight-bold skin-secondary-color">{formatPhoneNumber(outboundPhone)}</span></MDBBox>
                    </div>
                    <div className="d-flex flex-column justify-content-between align-items-end">
                        {this.generatePreferredOfficeChip()}
                    </div>
                </MDBCardBody>
            </MDBCard>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        interaction: state.interaction,
        user: state.user,
        shift: state.shift
    }
}

export default connect(mapStateToProps)(LeadDetail);
