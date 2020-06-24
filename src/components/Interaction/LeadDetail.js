import React, {Component} from 'react'
import {MDBCard, MDBCardBody, MDBChip} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faStar,
} from "@fortawesome/pro-solid-svg-icons";


class LeadDetail extends Component {

    constructor(props) {
        super(props);
        const client = this.props.shift.clients[this.props.lead.client_index]
        const phase = this.props.shift.phases.find(phase => phase.id === this.props.lead.phase_id)
        const region = client.regions[this.props.lead.region_index]
        this.state = {
            phase : phase.label,
            region : region
        };
    }

    render() {
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
            <MDBCard className="w-100 p-2 mb-2 d-flex border rounded skin-border-primary" style={{flex:"0 65px"}}>
                <MDBCardBody className="d-flex w-100 p-2" style={{height:"120px"}}>
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
                    <MDBChip className="outlineChip ml-4 mb-0">{localization.id}{lead.id}</MDBChip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.region}{this.state.region.name} - {formatPhoneNumber(this.state.region.default_number)}</MDBChip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.phase}{this.state.phase}</MDBChip>
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
