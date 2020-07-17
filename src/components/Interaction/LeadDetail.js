import React, {Component} from 'react'
import {MDBCard, MDBCardBody, MDBChip, MDBTooltip, MDBBox} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faStar,
} from "@fortawesome/pro-solid-svg-icons";
import { toast } from 'react-toastify';


class LeadDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            leadIDCopyTooltip: props.localization.interaction.details.copyLeadIDTooltip
        }
    }

    copyLeadIDToClipboard = () => {
        const leadID = this.props.lead.id
        let dummyInput = document.createElement("input")
        document.body.appendChild(dummyInput)
        dummyInput.value = leadID
        dummyInput.select()
        document.execCommand("copy")
        document.body.removeChild(dummyInput)
    
        this.setState({leadIDCopyTooltip: this.props.localization.interaction.details.copiedLeadIDTooltip})
    }
    
    clearCopyMessage = () => {
        this.setState({leadIDCopyTooltip: this.props.localization.interaction.details.copyLeadIDTooltip})
    }

    render() {
        const client = this.props.shift.clients[this.props.lead.client_index]
        const phase = this.props.shift.phases.find(phase => phase.id === this.props.lead.phase_id)
        const region = client.regions[this.props.lead.region_index]
        let localization = this.props.localization.interaction.details
        let lead = this.props.lead
        let formatPhoneNumber = (str) => {
            //Filter only numbers from the input
            let cleaned = ('' + str).replace(/\D/g, '');

            //Check if the input is of correct length
            let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

            if (match) {
                return '(' + match[1] + ') ' + match[2] + '-' + match[3]
            };

            return null
        };
        return (
            <MDBCard className="w-100 p-2 mb-2 d-flex border rounded skin-border-primary">
                <MDBCardBody className="d-flex w-100 p-2">
                    <div className="d-flex flex-column w-50 justify-content-between">
                        <span className="d-flex justify-content-between">
                            <span className="mr-3">
                                {lead.details.preferred_phone === "cell" && <FontAwesomeIcon icon={faStar} className="skin-primary-color"/>} <span className="font-weight-bold">{localization.cellPhone}</span> {formatPhoneNumber(lead.details.cell_phone)}
                            </span>
                            {lead.details.home_phone &&
                            <span>
                                {lead.details.preferred_phone === "home" && <FontAwesomeIcon icon={faStar} className="skin-primary-color"/>} <span className="font-weight-bold">{localization.homePhone}</span> {formatPhoneNumber(lead.details.home_phone)}
                            </span>}
                        </span>
                        <span>
                            {lead.details.address_1 && <span><span className="font-weight-bold">{localization.address}</span>{lead.details.address_1}</span>}
                            {lead.details.address_2 && <span> , {lead.details.address_2}</span>}
                        </span>
                        <span className="d-flex justify-content-between">{lead.details.city && <span><span className="font-weight-bold">{localization.city}</span>{lead.details.city}</span>} {lead.details.state && <span><span className="font-weight-bold">{localization.state}</span>{lead.details.state}</span>} {lead.details.zip && <span><span className="font-weight-bold">{localization.zip}</span>{lead.details.zip}</span>}</span>
                        <span className="d-flex justify-content-between">
                            <span><span className="font-weight-bold">{localization.email}</span>{lead.details.email}</span>
                            {lead.details.date_of_birth && <span><span className="font-weight-bold">{localization.date_of_birth}</span>{lead.details.date_of_birth}</span>}
                        </span>

                    </div>
                    <div className="d-flex flex-column justify-content-between align-items-start w-50">
                        <MDBTooltip placement="right" domElement tag="span" material sm>
                            <span>
                                <MDBChip className="outlineChip ml-4 mb-0" onClick={this.copyLeadIDToClipboard} onMouseOut={this.clearCopyMessage}>{localization.id}{lead.id}</MDBChip>
                            </span>
                            <span>{this.state.leadIDCopyTooltip}</span>
                        </MDBTooltip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.region}{region.name} - {formatPhoneNumber(region.default_number)}</MDBChip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.phase}{phase.label}</MDBChip>
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
        shift: state.shift
    }
}

export default connect(mapStateToProps)(LeadDetail);
