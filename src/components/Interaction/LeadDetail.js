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
        const campaign = client.campaigns[this.props.lead.campaign_index]
        this.state = {
            clientName: client.name,
            campaignName: campaign.name,
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
                            <span>
                                {lead.details.preferred_phone === "home" && <FontAwesomeIcon icon={faStar} className="skin-primary-color"/>} <span className="font-weight-bold">{localization.homePhone}</span> {formatPhoneNumber(lead.details.home_phone)}
                            </span>
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
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.client}{this.state.clientName}</MDBChip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.campaign}{this.state.campaignName}</MDBChip>
                    </div>
                </MDBCardBody>
            </MDBCard>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead: state.lead,
        shift: state.shift
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetail);
