import React, {Component} from 'react'
import {MDBBox, MDBCard, MDBCollapse, MDBNavLink, MDBTooltip} from "mdbreact"
import {connect} from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCalendarCheck, faCalendarDay, faCheckDouble,
    faCircle as faCircleSolid

} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from 'moment-timezone'
import Calendar from "../../../ui/Calendar";
import TimeSlots from "../../../ui/TimeSlots";

class Active extends Component {

    constructor(props) {
        super(props)
        this.toggleReschedule = this.toggleReschedule.bind(this)
        this.onCalendarChange = this.onCalendarChange.bind(this)

        this.state = {
            dateSelected: moment().format("YYYY-MM-DD"),
            reschedule: false
        }

    }

    toggleReschedule() {
        this.setState({reschedule: !this.state.reschedule})
    }
    toggleConfirm() {

    }

    onCalendarChange(date) {
        this.setState({dateSelected: date})
    }
    render() {
        const localization = this.props.localization.interaction.appointment
        const client = this.props.shift.clients.find( client => client.id === this.props.data.client_id)
        const apptType = client.appointment_types.find( type => type.id === this.props.data.appointment_type_id)
        const apptStatus = client.appointment_statuses.find( status => status.id === this.props.data.appointment_status_id)
        let avs = {
            "timezone": "CDT",
            "timezone_long": "America/Chicago",
            "appointments": {
                "2020-06-19": [
                    "10:00",
                    "10:30",
                    "12:30",
                    "17:00"
                ],
                "2020-06-20": [
                    "15:30",
                    "15:45"
                ]
            }
        }
        /*                        <MDBTooltip material placement="top">
                            <MDBNavLink to="#"
                                        className="d-flex flex-column h-100 align-items-center justify-content-center border-left rounded-right p-2 skin-secondary-color"
                                        onClick={this.deleteClick}
                                        style={{flex: "0 0 76px"}}
                            >
                                <FontAwesomeIcon icon={faCalendarTimes} size="lg"/><span>Cancel</span>
                            </MDBNavLink>
                            <span>Cancel</span>
                        </MDBTooltip>*/
        return (
            <MDBBox className='d-flex flex-column w-100 mb-3'>
                <MDBCard className="d-flex w-100 shadow-sm border-0">
                    <MDBBox className="d-flex backgroundColorInherit timelineCardHeader skin-border-primary f-m w-100"
                            onClick={this.toggleCollapse}
                    >
                        <div className='d-flex p-1 px-3 w-100'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                            <div className="d-flex w-75 p-2 flex-column text-left">
                                <span className="f-l">{apptType.label}</span>
                                <span><span
                                    className="font-weight-bold">{moment(this.props.data.start_time).format("MMM D")}</span>, {moment(this.props.data.start_time).format("hh:mm a z")}</span>
                            </div>
                            <div className="d-flex flex-column w-25 f-s justify-content-start">
                                <span className="font-weight-bold skin-primary-color f-l">{apptStatus.label}</span>
                                {this.props.data.created_by &&
                                <span>{this.props.localization.created_by}: {this.props.data.created_by}</span>}
                            </div>
                        </div>
                    <MDBBox className="d-flex" style={{flex: "0 0 250px"}}>
                        <MDBTooltip material placement="top">
                            <MDBNavLink to="#"
                                        className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                        onClick={this.toggleReschedule}
                                        style={{flex: "0 0 96px"}}
                            >
                                <FontAwesomeIcon icon={faCalendarDay} className={this.state.reschedule ? "skin-primary-color" : "skin-secondary-color"} size="lg"/><span className={this.state.reschedule ? "skin-primary-color" : "skin-secondary-color"}>{localization.reschedule}</span>
                            </MDBNavLink>
                            <div>{localization.reschedule}</div>
                        </MDBTooltip>
                        <MDBTooltip material placement="top">
                            <MDBNavLink to="#"
                                        className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                        onClick={this.editClick}
                                        style={{flex: "0 0 76px"}}
                            >
                                <FontAwesomeIcon icon={faCalendarCheck} size="lg"/><span>{localization.confirm}</span>
                            </MDBNavLink>
                            <span>{localization.confirm}</span>
                        </MDBTooltip>
                        <MDBTooltip material placement="top">
                            <MDBNavLink to="#"
                                        className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                        onClick={this.editClick}
                                        style={{flex: "0 0 76px"}}
                            >
                                <FontAwesomeIcon icon={faCheckDouble} size="lg"/><span>{localization.verify}</span>
                            </MDBNavLink>
                            <span>{localization.verify}</span>
                        </MDBTooltip>
                    </MDBBox>
                    </MDBBox>
                </MDBCard>
                {this.state.reschedule && <MDBCollapse className="bg-white mx-2 my-1" isOpen={true}>
                    <MDBBox className="d-flex m-2">
                    <Calendar className="w-50 bg-white" subtitle={"Mary Delany-Hudzik, MS, LCGC"}
                              alternateValue={avs} disablePastDates={true}
                              onChange={this.onCalendarChange}/>
                    <TimeSlots className="w-50 ml-3"
                               values={avs.appointments[this.state.dateSelected]}/>
                    </MDBBox>
                </MDBCollapse>}
            </MDBBox>
        )
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization,
        shift: store.shift
    }
}

export default connect(mapStateToProps)(Active);
