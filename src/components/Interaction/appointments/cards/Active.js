import React, {Component} from 'react'
import {
    MDBBox,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCollapse,
    MDBNavLink,
    MDBSelect,
    MDBTooltip
} from "mdbreact"
import {connect} from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCalendarCheck, faCalendarDay, faCheckDouble, faHeartbeat,
    faCircle as faCircleSolid

} from "@fortawesome/pro-solid-svg-icons";

import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from 'moment-timezone'
import Calendar from "../../../ui/Calendar";
import TimeSlots from "../../../ui/TimeSlots";
import {SingleDatePicker} from "react-dates";
import TimePicker from "rc-time-picker";

class Active extends Component {

    constructor(props) {
        super(props)
        this.toggleReschedule = this.toggleReschedule.bind(this)
        this.toggleStatus = this.toggleStatus.bind(this)
        this.toggleVerify = this.toggleVerify.bind(this)
        this.onCalendarChange = this.onCalendarChange.bind(this)
        this.onStatusChange = this.onStatusChange.bind(this)

        const client = this.props.shift.clients.find(client => client.id === this.props.data.client_id)
        const apptStatus = client.appointment_statuses.find(status => status.id === this.props.data.appointment_status_id)
        const availableStatuses = []
            let now = moment()
            let apptTime = this.props.data.start_time ? moment(this.props.data.start_time) : undefined
            if (apptTime === undefined) {
                client.appointment_statuses.forEach(status => {
                    if ((status.cancel || status.reschedule_in_progress) && apptStatus.id !== status.id) availableStatuses.push({
                        value: status.id.toString(),
                        text: status.label
                    })
                })
            } else if (apptTime.isSameOrBefore(now) && apptStatus.cancel !== 1) { // Appointment in the past, and not cancelled
                client.appointment_statuses.forEach(status => {
                    if (!status.pending && apptStatus.id !== status.id) availableStatuses.push({
                        value: status.id.toString(),
                        text: status.label
                    })
                })
            } else if (apptTime.isAfter(now)) { // Appointment in future, allow pending or cancelled statuses
                client.appointment_statuses.forEach(status => {
                    if ((status.pending || status.cancel) && apptStatus.id !== status.id) availableStatuses.push({
                        value: status.id.toString(),
                        text: status.label
                    })
                })

            }

        this.state = {
            dateSelected: moment().format("YYYY-MM-DD"),
            reschedule: false,
            status: false,
            verify: false,
            changeStatus: undefined,
            availableStatuses
        }

    }

    toggleReschedule() {
        this.setState({reschedule: !this.state.reschedule, status: false, verify: false, changeStatus: undefined})
    }

    toggleConfirm() {
        // TODO
        // Push !this.props.data.confirmed to store and api
    }

    toggleStatus() {
        this.setState({reschedule: false, status: !this.state.status, verify: false, changeStatus: undefined})
    }

    onStatusChange(values) {
        this.setState({changeStatus : parseInt(values[0])})
    }

    toggleVerify() {
        this.setState({reschedule: false, status: false, verify: !this.state.verify, changeStatus: undefined})
    }

    onCalendarChange(date) {
        this.setState({dateSelected: date})
    }

    render() {
        const localization = this.props.localization.interaction.appointment
        const client = this.props.shift.clients.find(client => client.id === this.props.data.client_id)
        const apptType = client.appointment_types.find(type => type.id === this.props.data.appointment_type_id)
        const apptStatus = client.appointment_statuses.find(status => status.id === this.props.data.appointment_status_id)
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
                        <MDBBox className="d-flex" style={{flex: "0 0 380px"}}>
                            <MDBTooltip material placement="top">
                                <MDBNavLink to="#"
                                            className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                            onClick={this.toggleStatus}
                                            style={{flex: "0 0 96px"}}
                                >
                                    <FontAwesomeIcon icon={faHeartbeat}
                                                     className={this.state.status ? "skin-primary-color" : "skin-secondary-color"}
                                                     size="lg"/><span
                                    className={this.state.status ? "skin-primary-color" : "skin-secondary-color"}>{localization.status}</span>
                                </MDBNavLink>
                                <div>{localization.status}</div>
                            </MDBTooltip>
                            <MDBTooltip material placement="top">
                                <MDBNavLink to="#"
                                            className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                            onClick={this.toggleReschedule}
                                            style={{flex: "0 0 96px"}}
                                >
                                    <FontAwesomeIcon icon={faCalendarDay}
                                                     className={this.state.reschedule ? "skin-primary-color" : "skin-secondary-color"}
                                                     size="lg"/><span
                                    className={this.state.reschedule ? "skin-primary-color" : "skin-secondary-color"}>{localization.reschedule}</span>
                                </MDBNavLink>
                                <div>{localization.reschedule}</div>
                            </MDBTooltip>
                            <MDBTooltip material placement="top">
                                <MDBNavLink to="#"
                                            className={"d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"}
                                            onClick={this.toggleConfirm}
                                            style={{flex: "0 0 96px"}}
                                >
                                    {this.props.data.confirmed ? <FontAwesomeIcon icon={faCalendarCheck} size="lg"/> :
                                        <FontAwesomeIcon icon={faCalendar} size="lg"/>}
                                    <span>{this.props.data.confirmed ? localization.confirmed : localization.confirm}</span>
                                </MDBNavLink>
                                <span>{this.props.data.confirmed ? localization.confirmed : localization.confirm}</span>
                            </MDBTooltip>
                            <MDBTooltip material placement="top">
                                <MDBNavLink to="#"
                                            className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                            onClick={this.toggleVerify}
                                            style={{flex: "0 0 96px"}}
                                >
                                    <FontAwesomeIcon icon={faCheckDouble}
                                                     className={this.state.verify ? "skin-primary-color" : "skin-secondary-color"}
                                                     size="lg"/><span
                                    className={this.state.verify ? "skin-primary-color" : "skin-secondary-color"}>{localization.verify}</span>
                                </MDBNavLink>
                                <span>{localization.verify}</span>
                            </MDBTooltip>
                        </MDBBox>
                    </MDBBox>
                </MDBCard>
                {this.state.reschedule && <MDBCollapse className="bg-white mx-2 my-1" isOpen={true}>
                    <MDBCard className="d-flex border-0 shadow-none">
                        <MDBCardBody className="d-flex justify-content-center">
                        <Calendar className="w-50 bg-white" subtitle={""}
                                  alternateValue={avs} disablePastDates={true}
                                  onChange={this.onCalendarChange}/>
                        <TimeSlots className="w-25 ml-3"
                                   values={avs.appointments[this.state.dateSelected]}/>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBtn rounded outline onClick={this.toggleReschedule}>
                                {localization.cancel}
                            </MDBBtn>
                            <MDBBtn rounded onClick={this.toggleReschedule}>
                                {localization.reschedule}
                            </MDBBtn>
                        </MDBCardFooter>                    </MDBCard>
                </MDBCollapse>}
                {this.state.status && <MDBCollapse className="bg-white mx-2 my-1" isOpen={true}>
                    <MDBCard className="d-flex border-0 shadow-none">
                        <MDBCardBody className="d-flex justify-content-center">
                            <MDBSelect className="w-50 p-1"
                                       options={this.state.availableStatuses}
                                       label={localization.appointmentStatus}
                                       labelClass="skin-secondary-color"
                                       getValue={this.onStatusChange}
                            />
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBtn rounded outline onClick={this.toggleStatus}>
                                {localization.cancel}
                            </MDBBtn>
                            <MDBBtn rounded onClick={this.toggleStatus}>
                                {localization.updateStatus}
                            </MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCollapse>}
                {this.state.verify && <MDBCollapse className="bg-white mx-2 my-1" isOpen={true}>
                    <MDBCard className="d-flex border-0 shadow-none">
                        <MDBCardBody className="d-flex justify-content-center">
                        <span>{localization.date}
                            <SingleDatePicker
                                numberOfMonths={2}
                                hideKeyboardShortcutsPanel={true}
                                noBorder
                                date={this.state.date} // momentPropTypes.momentObj or null
                                onDateChange={date => this.setState({date})} // PropTypes.func.isRequired
                                focused={this.state.focused} // PropTypes.bool
                                onFocusChange={({focused}) => this.setState({focused})} // PropTypes.func.isRequired
                                id="sdp" // PropTypes.string.isRequired,
                            /></span>

                        <span className="pt-2">{localization.time} <TimePicker onChange={this.handleTimeClick}
                                                              defaultValue={moment().hour(0).minute(0)}
                                                              use12Hours format={'h:mm a'}
                                                              showSecond={false}/></span>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBtn rounded outline onClick={this.toggleVerify}>
                                {localization.cancel}
                            </MDBBtn>
                            <MDBBtn rounded onClick={this.toggleVerify}>
                                {localization.verify}
                            </MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
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
