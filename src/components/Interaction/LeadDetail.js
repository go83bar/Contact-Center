import React, {Component} from 'react'
import {MDBCard, MDBCardBody, MDBChip} from "mdbreact";
import {connect} from "react-redux";


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
        return (
            <MDBCard className="w-100 p-2 mb-2 d-flex border rounded skin-border-primary" style={{flex:"0 65px"}}>
                <MDBCardBody>
                    {localization.cellPhone}: {lead.cell_phone}
                    {localization.homePhone}: {lead.home_phone}
                    {localization.address}: {lead.address_1}
                    {localization.email}: {lead.email}
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.client} : {this.state.clientName}</MDBChip>
                    <MDBChip className={"outlineChip ml-4 mb-0"}>{localization.campaign} : {this.state.campaign}</MDBChip>
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
