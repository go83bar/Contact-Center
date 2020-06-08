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
                        <span>
                            <span className="mr-3">
                                {lead.details.preferred_phone === "cell" && <FontAwesomeIcon icon={faStar} className="skin-primary-color"/>} {localization.cellPhone}: <span className={lead.details.preferred_phone === "cell" ? "font-weight-bold" : "font-weight-normal"}>{formatPhoneNumber(lead.details.cell_phone)}</span>
                            </span>
                            <span>
                                {lead.details.preferred_phone === "home" && <FontAwesomeIcon icon={faStar} className="skin-primary-color"/>} {localization.homePhone}: <span className={lead.details.preferred_phone === "home" ? "font-weight-bold" : "font-weight-normal"}>{formatPhoneNumber(lead.details.home_phone)}</span>
                            </span>
                        </span>
                        <span>{localization.address}: {lead.details.address_1 ? lead.details.address_1 + "," : ""} {lead.details.city ? lead.details.city + "," : ""} {lead.details.state ? lead.details.state + "," : ""} {lead.details.zip ? lead.details.zip : ""} {lead.details.timezone_short}</span>
                        <span><span>{localization.email}: {lead.details.email}</span>{lead.details.date_of_birth && <span> {localization.date_of_birth}: {lead.details.date_of_birth}</span>}</span>

                    </div>
                    <div className="d-flex flex-column justify-content-between">
                    <MDBChip className="outlineChip ml-4 mb-0">{localization.id} : {lead.id}</MDBChip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.client} : {this.state.clientName}</MDBChip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.campaign} : {this.state.campaign}</MDBChip>
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
