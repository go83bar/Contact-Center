import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {

    faCircle as faCircleSolid, faHistory
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import String from '../../../../utils/String'
import moment from "moment";

class SimpleLog extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse=this.toggleCollapse.bind(this)
        this.renderLog = this.renderLog.bind(this)

        this.state = {
            collapsed : true
        }

    }
    toggleCollapse() {
        this.setState({collapsed : !this.state.collapsed})
    }

    renderLog() {
        const localization = this.props.localization.interaction.timeline.log
        const client = this.props.shift.clients[this.props.lead.client_index]

        let result = undefined
        switch(this.props.data.field) {
            case "appointment_status_id":
                let apptStatusFrom = client.appointment_statuses.find(as => as.id === parseInt(this.props.data.old_value))
                let apptStatusTo = client.appointment_statuses.find(as => as.id === parseInt(this.props.data.new_value))
                apptStatusFrom = apptStatusFrom ? apptStatusFrom.label : localization.blank
                apptStatusTo = apptStatusTo ? apptStatusTo.label : localization.blank
                result =
                    <div>{String.humanize(this.props.data.field) + localization.from + apptStatusFrom + localization.to + apptStatusTo}</div>
                break
            case "confirmed":
                result =
                    <div>{String.humanize(this.props.data.field) + localization.from + (this.props.data.old_value === "0" ? "False" : "True") + localization.to + (this.props.data.new_value === "0" ? "False" : "True")}</div>
                break
            case "start_time":
                const ov =  this.props.data.old_value ? <span><span className="font-weight-bold">{moment(this.props.data.old_value).format("MMM D")}</span>, {moment(this.props.data.old_value).format("hh:mm a")}</span> : localization.noTime
                const nv =  this.props.data.new_value ? <span><span className="font-weight-bold">{moment(this.props.data.new_value).format("MMM D")}</span>, {moment(this.props.data.new_value).format("hh:mm a")}</span> : localization.noTime
                result =
                    <div>{String.humanize(this.props.data.field)} {localization.from} {ov} {localization.to} {nv}</div>
                break
            default:
                result =
                    <div>{String.humanize(this.props.data.field) + localization.from + (this.props.data.old_value ? this.props.data.old_value : localization.blank) + localization.to + (this.props.data.new_value ? this.props.data.new_value : localization.blank)}</div>
                break
        }
        return result
    }


    render() {
        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm"
                                   onClick={this.toggleCollapse}
                >
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faHistory} transform={"shrink-8"} className="skin-secondary-color"/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l font-weight-bold">
                                {this.props.localization.interaction.timeline.log[this.props.data.type]}
                            </span>
                            <span>{this.renderLog()}</span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                            {this.props.data.created_by && <span>{this.props.localization.created_by}: {this.props.data.created_by}</span>}
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
        shift: store.shift,
        lead: store.lead
    }
}

export default connect(mapStateToProps)(SimpleLog);
