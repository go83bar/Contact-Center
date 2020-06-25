import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {

    faCircle as faCircleSolid, faUserEdit
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import String from '../../../../utils/String'

class Lead extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse=this.toggleCollapse.bind(this)
        this.renderLogs = this.renderLogs.bind(this)

        this.state = {
            collapsed : true
        }

    }
    toggleCollapse() {
        this.setState({collapsed : !this.state.collapsed})
    }

    renderLogs() {
        const localization = this.props.localization.interaction.timeline.leadUpdate
        const timezones = this.props.localization.interaction.timezoneChoices
        const client = this.props.shift.clients[this.props.lead.client_index]
        let result = []
        this.props.data.log.forEach((item,index) => {
            switch (item.field) {
                case "tag" :
                    break
                case "phase_id":
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {localization.phase + this.props.shift.phases.find(i => i.id === parseInt(item.old_value)).label + localization.to +  this.props.shift.phases.find(i => i.id === parseInt(item.new_value)).label}
                    </div>)
                    break
                case "region_id":
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {localization.region + client.regions.find(i => i.id === parseInt(item.old_value)).name + localization.to +  client.regions.find(i => i.id === parseInt(item.new_value)).name}
                    </div>)
                    break
                case "lead_status_id":
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {localization.leadStatus + this.props.shift.lead_statuses.find(i => i.id === parseInt(item.old_value)).label + localization.to +  this.props.shift.lead_statuses.find(i => i.id === parseInt(item.new_value)).label}
                    </div>)
                    break
                case "cell_phone":
                case "home_phone":
                case "work_phone":
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {String.humanize(item.field) + localization.from + String.formatPhoneNumber(item.old_value) + localization.to +  String.formatPhoneNumber(item.new_value)}
                    </div>)
                    break
                case "first_name":
                case "last_name":
                case "email":
                case "address_1":
                case "address_2":
                case "city":
                case "gender":
                case "state":
                case "zip":
                case "wealth_score":
                case "date_of_birth":
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {String.humanize(item.field) + localization.from + item.old_value + localization.to +  item.new_value}
                    </div>)
                    break
                case "timezone":
                    let oldV = timezones.find(tz => tz.value === item.old_value)
                    let newV = timezones.find(tz => tz.value === item.new_value)
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {String.humanize(item.field) + localization.from + oldV.label + localization.to +  newV.label}
                    </div>)
                    break
                case "preferred_phone":
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {String.humanize(item.field) + localization.from + String.humanize(item.old_value) + localization.to +  String.humanize(item.new_value)}
                    </div>)
                    break
                case "emails":
                case "phone_calls":
                case "texts":
                    result.push(<div key={"log-" + item.created_at.format()+ "-" + index}>
                        {String.humanize(item.field) + localization.from + (item.old_value === "1" ? localization.allowed : localization.notAllowed) + localization.to +  (item.new_value === "1" ? localization.allowed : localization.notAllowed)}
                    </div>)
                    break
                default: break
            }
        })
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
                            <FontAwesomeIcon icon={faUserEdit} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l font-weight-bold">
                                Lead Information Updated
                            </span>
                            <span>{this.renderLogs()}</span>
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

export default connect(mapStateToProps)(Lead);
