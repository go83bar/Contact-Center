import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
 faCalendar,
    faCircle as faCircleSolid,
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";

class Appointment extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse=this.toggleCollapse.bind(this)

        this.state = {
            collapsed : true
        }

    }
    toggleCollapse() {
        this.setState({collapsed : !this.state.collapsed})
    }

    render() {
        const localization = this.props.localization.interaction.timeline
        const client = this.props.shift.clients.find(client => client.id === this.props.data.client_id)
        const apptType = client.appointment_types.find(type => type.id === this.props.data.appointment_type_id)
        const office = client.regions[this.props.lead.region_index].offices.find(office => office.id === this.props.data.office_id)

        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm"
                                   onClick={this.toggleCollapse}
                >
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l font-weight-bold">
                                {apptType.label}
                            </span>
                            { office && <span>
                                {office.name}
                            </span>}
                            <span>
                                <span className="font-weight-bold">{moment.utc(this.props.data.start_time).tz(this.props.lead.details.timezone).format("MMM D")}</span>, {moment.utc(this.props.data.start_time).tz(this.props.lead.details.timezone).format("hh:mm a z")}
                                {office.timezone !== this.props.lead.details.timezone &&
                                <span className="ml-3">{localization.office}<span
                                    className="font-weight-bold">{moment.utc(this.props.data.start_time).tz(office.timezone).format("MMM D")}</span>, {moment.utc(this.props.data.start_time).tz(office.timezone).format("hh:mm a z")}</span>}
</span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                            <span>{this.props.localization.created_by}: {this.props.data.created_by}</span>
                        </div>
                    </div>
                </MDBBox>
            </MDBCard>

        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization,
        shift : store.shift,
        lead: store.lead
    }
}

export default connect(mapStateToProps)(Appointment);
