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
} from "mdbreact"
import {connect} from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar, faSquare,
    faCalendarCheck, faCalendarDay, faCheckDouble, faHeartbeat,
    faCircle as faCircleSolid

} from "@fortawesome/pro-solid-svg-icons";

import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from 'moment-timezone'
import Calendar from "../../../ui/Calendar";
import TimeSlots from "../../../ui/TimeSlots";
import {SingleDatePicker} from "react-dates";
import TimePicker from "rc-time-picker";
import Slack from '../../../../utils/Slack';
import AppointmentAPI from '../../../../api/appointmentAPI';
import {toast} from "react-toastify";
import LoadingScreen from "../../../LoadingScreen"
import LeadAPI from '../../../../api/leadAPI';

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
        const apptType = client.appointment_types.find(type => type.id === this.props.data.appointment_type_id)
        const availableStatuses = []
        let now = moment()
        let apptTime = this.props.data.start_time ? moment(this.props.data.start_time) : undefined
        if (apptTime === undefined) {
            client.appointment_statuses.forEach(status => {
                if ((status.cancel || status.reschedule_in_progress) && apptStatus.id !== status.id && apptType.statuses.includes(status.id)) availableStatuses.push({
                    value: status.id.toString(),
                    order: status.order,
                    text: status.label
                })
            })
        } else if (apptTime.isSameOrBefore(now) && apptStatus.cancel !== 1) { // Appointment in the past, and not cancelled
            client.appointment_statuses.forEach(status => {
                if (!status.pending && apptStatus.id !== status.id && apptType.statuses.includes(status.id)) availableStatuses.push({
                    value: status.id.toString(),
                    order: status.order,
                    text: status.label
                })
            })
        } else if (apptTime.isAfter(now)) { // Appointment in future, allow pending or cancelled statuses
            client.appointment_statuses.forEach(status => {
                if ((status.pending || status.cancel) && apptStatus.id !== status.id && apptType.statuses.includes(status.id)) availableStatuses.push({
                    value: status.id.toString(),
                    order: status.order,
                    text: status.label
                })
            })

        }
        availableStatuses.sort((a, b) => a.order - b.order)

        this.state = {
            controlsVisible: false,
            controlsButtonLabel: "<< More",
            verifyDate: moment(),
            verifyTime: "00:00:00",
            reschedule: false,
            status: false,
            verify: false,
            changeStatus: undefined,
            appointmentAVS: undefined,
            dateSelected: undefined,
            timeslots: undefined,
            availableStatuses
        }

    }
    toggleControls = () => {
        this.props.dispatch({type: "AUTH.ACTION_TAKEN"})
        let newState = {controlsVisible: true, controlsButtonLabel: "Less >>"}
        if (this.state.controlsVisible) {
            newState.controlsVisible = false
            newState.controlsButtonLabel = "<< More"
        }
        this.setState(newState)
    }

    toggleConfirm = () => {
        // persist change to API
        AppointmentAPI.confirm({ appointmentID: this.props.data.id, interactionID: this.props.interaction.id}).then( response => {
            if (response.success) {
                // success message
                const toastMessage = this.props.data.confirmed ? this.props.localization.toast.appointments.unconfirmed : this.props.localization.toast.appointments.confirmed
                toast.success(toastMessage, {autoClose: 3000})

                // push update to store
                const newLog = {
                    appointment_id: this.props.data.id,
                    appointment_index: this.props.data.index,
                    field: "confirmed",
                    old_value: this.props.data.confirmed ? "1" : "0",
                    new_value: this.props.data.confirmed ? "0" : "1",
                    interaction_id: this.props.interaction.id,
                    created_at: moment().utc().format("YYYY-MM-DD hh:mm:ss"),
                    created_by: this.props.user.label_name
                }
                this.props.dispatch({
                    type: "APPOINTMENT.CONFIRMED",
                    data: {
                        appointmentID: this.props.data.id,
                        confirmedState: !this.props.data.confirmed,
                        newLog
                    }
                })

            } else {
                toast.error(this.props.localization.toast.appointments.confirmFailed)
            }
        }).catch( reason => {
            // TODO send error to slack?
            toast.error(this.props.localization.toast.appointments.confirmFailed)
            console.log("Could not confirm: ", reason)
        })
    }

    toggleStatus() {
        this.setState({reschedule: false, status: !this.state.status, verify: false, changeStatus: undefined})
    }

    onStatusChange(values) {
        this.setState({changeStatus: parseInt(values[0])})
    }

    setUpdatedStatus = () => {
        // send update to API
        const updateStatusParams = {
            appointmentID: this.props.data.id,
            statusID: this.state.changeStatus,
            interactionID: this.props.interaction.id
        }

        AppointmentAPI.updateStatus(updateStatusParams).then( response => {
            if (response.success) {
                toast.success(this.props.localization.toast.appointments.statusUpdated)

                // push update to store
                const newLog = {
                    appointment_id: this.props.data.id,
                    appointment_index: this.props.data.index,
                    field: "appointment_status_id",
                    old_value: this.props.data.appointment_status_id,
                    new_value: updateStatusParams.statusID,
                    created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
                    created_by: this.props.user.label_name
                }
                this.props.dispatch({
                    type: "APPOINTMENT.STATUS_UPDATED",
                    data: {
                        appointmentID: this.props.data.id,
                        newStatusID: updateStatusParams.statusID,
                        newLog
                    }
                })

                this.toggleStatus()

            } else {
                toast.error(this.props.localization.toast.appointments.statusFailed)
            }
        }).catch( reason => {
            // TODO send error to slack?
            toast.error(this.props.localization.toast.appointments.statusFailed)
            console.log("Could not update status: ", reason)

        })
    }
    toggleVerify() {
        this.setState({reschedule: false, status: false, verify: !this.state.verify, changeStatus: undefined})
    }

    toggleReschedule() {
        // if we're opening the reschedule view without having loaded reschedule calendar yet, start that going 
        if (this.state.reschedule === false && this.state.appointmentAVS === undefined) {
            const now = moment()
            this.loadCalendarMonth(now)
        }

        // display reschedule controls, or a loading screen
        this.setState({reschedule: !this.state.reschedule, status: false, verify: false, changeStatus: undefined})
    }

    onCalendarChange = (date) => {
        console.log("Chosen Date: ", date)
        let newTimes = []
        if (this.state.appointmentAVS !== undefined && this.state.appointmentAVS.appointments !== undefined){
            newTimes = this.state.appointmentAVS.appointments[date]
        }

        this.setState({timeslots: newTimes, dateSelected: date})
    }

    loadCalendarMonth = (newDate) => {
        // called when the calendar month is changed, and we need to load a new month's worth of data
        const calendarListParams = {
            officeID: this.props.data.office_id,
            appointmentTypeID: this.props.data.appointment_type_id,
            leadID: this.props.lead.id,
            month: newDate.month() + 1,
            year: newDate.year()
        }

        AppointmentAPI.getCalendar(calendarListParams).then( response => {
            if (response.success !== true) {
                // usually ApiException error response
                toast.error("Calendar could not be loaded")
                Slack.sendMessage("Agent " + this.props.user.id + " - Reschedule Appointment calendar month retrieve error: " + response.error)
                return
            }

            // if this is the initial call with today's date, set dateSelected to today
            let dateSelected = this.state.dateSelected
            if (this.state.dateSelected === undefined && response.appointments !== undefined) {
                console.log("Setting today's slots")
                dateSelected = moment().format("YYYY-MM-DD")
               
            }
            
            // set results into state, 
            this.setState({
                appointmentAVS: response,
                dateSelected
            })

        }).catch( reason => {
            toast.error("Calendar month could not be loaded")
            console.log("Could not load calendar month: ", reason)
        })
    }

    onRescheduleSlotSelection = (slotTime) => {
        // send reschedule request
        const apptTime = this.state.dateSelected + " " + slotTime + ":00"
        const rescheduleParams = {
            appointmentTime: apptTime,
            appointmentID: this.props.data.id,
            interactionID: this.props.interaction.id
        }

        console.log("Reschedule params: ", rescheduleParams)

        AppointmentAPI.reschedule(rescheduleParams).then( response => {
            if (response.success) {
                toast.success("Appointment rescheduled!", {delay: 1000})

                // reload lead appointments from backend, easier than re-creating all the changes here
                // unset appointmentAVS which will cause loading screen to display while we do this
                this.setState({ appointmentAVS: undefined })
                LeadAPI.getLeadAppointments({ leadID: this.props.lead.id}).then( response => {
                    if (response.success) {
                        this.props.dispatch({type: "LEAD.APPOINTMENTS_LOADED", data: response.data})
                    }
                    this.toggleReschedule()
                }).catch( reason => {
                    toast.error("Could not reload appointment data.")
                    this.toggleReschedule()
                })
            } else {
                toast.error("Could not reschedule appointment")
                Slack.sendMessage("Agent " + this.props.user.id + " got success false on reschedule appointment " + this.props.data.id + ": " + JSON.stringify(response))
            }
        }).catch( reason => {
            toast.error("Could not reschedule appointment")
            Slack.sendMessage("Agent " + this.props.user.id + " could not reschedule appointment " + this.props.data.id + ": " + JSON.stringify(reason))
        })
        
    }


    handleVerifyTime = (time) => {
        if (time) {
            this.setState({ verifyTime: time.format("HH:mm:00")});
        }

    }

    handleVerifyDate = (date) => {
        this.setState({ verifyDate : date});
    }

    verify = () => {
        const params = {
            startTime: this.state.verifyDate.format("YYYY-MM-DD ") + this.state.verifyTime,
            interactionID: this.props.interaction.id,
            leadID: this.props.lead.id,
            appointmentID: this.props.data.id
        }

        AppointmentAPI.verify(params).then( response => {
            if (response.success) {
                toast.success(this.props.localization.toast.appointments.verified)
                this.toggleVerify()

                // push new time and status and changelog into store
                let newLogs = []
                let newStatusID = 0

                // first determine new status by grabbing the first status assigned to the current appointment type with "default" flag set to true
                const client = this.props.shift.clients.find(client => client.id === this.props.data.client_id)
                const apptType = client.appointment_types.find(type => type.id === this.props.data.appointment_type_id)
                const office = client.offices.find(office => office.id === this.props.data.office_id)
                const defaultStatus = client.appointment_statuses.find( status => status.default === 1 && apptType.statuses.includes(status.id))

                // if we find one make a log for it
                if (defaultStatus === undefined) {
                    toast.warning(this.props.localization.toast.appointments.statusFailed)
                    Slack.sendMessage("Agent " + this.props.user.id + " verified appointment " + this.props.data.id + " but type " + apptType.id + " does not have a default status")
                    newStatusID = this.props.data.appointment_status_id
                } else {
                    newStatusID = defaultStatus.id
                    newLogs.push({
                        appointment_id: this.props.data.id,
                        appointment_index: this.props.data.index,
                        field: "appointment_status_id",
                        old_value: this.props.data.appointment_status_id,
                        new_value: newStatusID,
                        created_at: moment().utc().format("YYYY-MM-DD hh:mm:ss"),
                        created_by: this.props.user.label_name
                    })
                }

                // make a log for the time change
                const utcTime = moment.tz(params.startTime, office.timezone).utc()
                newLogs.push({
                    appointment_id: this.props.data.id,
                    appointment_index: this.props.data.index,
                    field: "start_time",
                    old_value: this.props.data.start_time,
                    new_value: utcTime,
                    created_at: moment().utc().format("YYYY-MM-DD hh:mm:ss"),
                    created_by: this.props.user.label_name
                })

                // dispatch updates to store
                this.props.dispatch({
                    type: "APPOINTMENT.VERIFIED",
                    data: {
                        appointmentID: this.props.data.id,
                        newStatusID: newStatusID,
                        newStartTime: utcTime,
                        newLogs
                    }
                })
            } else {
                toast.error(this.props.localization.toast.appointments.verifyFailed)
                Slack.sendMessage("Agent " + this.props.user.id + " tried to verify an appointment but got response " + response)
            }
        }).catch( reason => {
            toast.error(this.props.localization.toast.appointments.verifyFailed)
            console.log("Failed verify: ", reason)
            Slack.sendMessage("Agent " + this.props.user.id + " tried to verify appointment " + this.props.data.id + " but there was an issue: " + reason)
        })

    }

    render() {
        const localization = this.props.localization.interaction.appointment
        const client = this.props.shift.clients.find(client => client.id === this.props.data.client_id)
        const apptType = client.appointment_types.find(type => type.id === this.props.data.appointment_type_id)
        const apptStatus = client.appointment_statuses.find(status => status.id === this.props.data.appointment_status_id)
        let office = this.props.lead.client.offices.find(office => office.id === this.props.data.office_id)
        if (!office) {
            // the office ID on this appointment isn't in the client data in any region somehow
            Slack.sendMessage("Appointment " + this.props.data.id + " has office ID " + this.props.data.office_id + " that is not in the shift data for agent " + this.props.user.id)
            return ""
        }

        // set controls container flex width
        let controlsStyle = {flex: "0 0 96px"}
        if (this.state.controlsVisible) controlsStyle = {flex: "0 0 380px"}
        // determine disabled/enabled status of the action buttons, starting with common-sense defaults
        let allowConfirm = this.props.data.start_time ? (moment().isBefore(this.props.data.start_time)) ? true : false : false
        let allowVerify = this.props.data.start_time ? false : true
        let allowStatusChange = true
        let allowReschedule = this.props.data.start_time ? (moment().isBefore(this.props.data.start_time)) ? true : false : false 

        if (apptStatus.reschedule || apptStatus.reschedule_in_progress || apptStatus.cancel) {
            allowConfirm = false
            allowVerify = false
            allowStatusChange = false
            allowReschedule = false
        }

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
                            <div className="d-flex p-2 flex-column text-left w-50">
                                <span className="f-l">#{this.props.data.index} {apptType.label}</span>
                                {office && <span>
                                    {office.name}
                                </span>}

                                <span>
                                    {this.props.data.start_time ? <span><span className="font-weight-bold">{moment.utc(this.props.data.start_time).tz(this.props.lead.details.timezone).format("MMM D")}</span>, {moment.utc(this.props.data.start_time).tz(this.props.lead.details.timezone).format("h:mm a z")}</span> : <span className="text-danger">{localization.noStartTime}</span>}
                                    {this.props.data.start_time && (office.timezone !== this.props.lead.details.timezone) &&
                                    <span className="ml-3">{localization.office}<span
                                        className="font-weight-bold">{moment.utc(this.props.data.start_time).tz(office.timezone).format("MMM D")}</span>, {moment.utc(this.props.data.start_time).tz(office.timezone).format("h:mm a z")}</span>}
                                </span>
                            </div>
                            <div className="d-flex flex-column f-s justify-content-start p-2 w-50 text-right">
                                <span
                                    className="d-flex font-weight-bold skin-primary-color f-l w-100 justify-content-end">{apptStatus.label}</span>
                                {this.props.data.created_by && <span
                                    className="d-flex w-100 justify-content-end">{this.props.localization.created_by}: {this.props.data.created_by}</span>}
                                <span className="ml-auto">
                                <MDBBtn color="primary"
                                        className="my-1 mr-0 py-1 px-2 z-depth-0"
                                        size="sm"
                                        rounded
                                        onClick={this.toggleControls}>
                                    {this.state.controlsButtonLabel}
                                </MDBBtn>
                            </span>

                            </div>
                        </div>
                        <MDBBox className="d-flex" style={controlsStyle}>
                            <MDBNavLink to="#"
                                        disabled={!allowStatusChange}
                                        className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                        onClick={this.toggleStatus}
                                        style={{flex: "0 0 96px"}}
                            >
                                <FontAwesomeIcon icon={faHeartbeat}
                                                 className={allowStatusChange ? this.state.status ? "skin-primary-color" : "skin-secondary-color" : "disabledColor"}
                                                 size="lg"/><span
                                className={allowStatusChange ? this.state.status ? "skin-primary-color" : "skin-secondary-color" : "disabledColor"}>{localization.status}</span>
                            </MDBNavLink>
                            { this.state.controlsVisible && <React.Fragment><MDBNavLink to="#"
                                        disabled={!allowReschedule}
                                        className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                        onClick={this.toggleReschedule}
                                        style={{flex: "0 0 96px"}}
                            >
                                <FontAwesomeIcon icon={faCalendarDay}
                                                 className={allowReschedule ? this.state.reschedule ? "skin-primary-color" : "skin-secondary-color" : "disabledColor"}
                                                 size="lg"/><span
                                className={allowReschedule ? this.state.reschedule ? "skin-primary-color" : "skin-secondary-color" : "disabledColor"}>{localization.reschedule}</span>
                            </MDBNavLink>
                            <MDBNavLink to="#"
                                        disabled={!allowConfirm}
                                        className={"d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"}
                                        onClick={this.toggleConfirm}
                                        style={{flex: "0 0 96px"}}
                            >
                                {this.props.data.confirmed ?
                                    <span className="fa-layers fa-fw mt-1" style={{marginBottom: "2px"}}>
                                        <FontAwesomeIcon icon={faSquare} transform={"shrink-4"}
                                                         className={"skin-primary-color mt-1"}/>
                                        <FontAwesomeIcon className={allowConfirm ? "skin-secondary-color" : "disabledColor"} icon={faCalendarCheck} size="lg"/>
                                    </span>
                                    :
                                    <FontAwesomeIcon className={allowConfirm ? "skin-secondary-color" : "disabledColor"} icon={faCalendar} size="lg"/>}
                                <span className={allowConfirm ? "skin-secondary-color" : "disabledColor"}>{this.props.data.confirmed ? localization.confirmed : localization.confirm}</span>
                            </MDBNavLink>
                            <MDBNavLink to="#"
                                        disabled={!allowVerify}
                                        className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                                        onClick={this.toggleVerify}
                                        style={{flex: "0 0 96px"}}
                            >
                                <FontAwesomeIcon icon={faCheckDouble}
                                                 className={allowVerify ? this.state.verify ? "skin-primary-color" : "skin-secondary-color" : "disabledColor"}
                                                 size="lg"/><span
                                className={allowVerify ? this.state.verify ? "skin-primary-color" : "skin-secondary-color" : "disabledColor"}>{localization.verify}</span>
                            </MDBNavLink></React.Fragment>}
                        </MDBBox>
                    </MDBBox>
                </MDBCard>
                {this.state.reschedule && (this.state.appointmentAVS === undefined) && <LoadingScreen /> }
                {this.state.reschedule && this.state.appointmentAVS && <MDBCollapse className="bg-white mx-2 my-1" isOpen={true}>
                    <MDBCard className="d-flex border-0 shadow-none">
                        <MDBCardBody className="d-flex justify-content-center">
                            <Calendar className="w-50 bg-white" subtitle={""}
                                      alternateValue={this.state.appointmentAVS} disablePastDates={true}
                                      loadCalendarMonth={this.loadCalendarMonth}
                                      onChange={this.onCalendarChange}/>
                            <TimeSlots className="w-25 ml-3"
                                        timeSelect={this.onRescheduleSlotSelection}
                                       officeID={this.props.data.office_id}
                                        values={this.state.appointmentAVS.appointments[this.state.dateSelected]}/>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBtn rounded outline onClick={this.toggleReschedule}>
                                {localization.cancel}
                            </MDBBtn>
                        </MDBCardFooter> </MDBCard>
                </MDBCollapse>}
                {this.state.status && <MDBCollapse className="bg-white mx-2 my-1" isOpen={true}>
                    <MDBCard className="d-flex border-0 shadow-none">
                        <MDBCardBody className="d-flex justify-content-center">
                            <MDBSelect className="w-50 p-1"
                                       options={this.state.availableStatuses}
                                       label={localization.appointmentStatus}
                                       labelClass="skin-secondary-color"
                                       getValue={this.onStatusChange}
                                       search={true}
                            />
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBtn rounded outline onClick={this.toggleStatus}>
                                {localization.cancel}
                            </MDBBtn>
                            <MDBBtn rounded onClick={this.setUpdatedStatus}>
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
                                isOutsideRange={ day => false}
                                date={this.state.verifyDate} // momentPropTypes.momentObj or null
                                onDateChange={this.handleVerifyDate} // PropTypes.func.isRequired
                                focused={this.state.focused} // PropTypes.bool
                                onFocusChange={({focused}) => this.setState({focused})} // PropTypes.func.isRequired
                                id="asdp" // PropTypes.string.isRequired,
                            /></span>

                            <span className="pt-2">{localization.time} <TimePicker onChange={this.handleVerifyTime}
                                                                                   defaultValue={moment().hour(0).minute(0)}
                                                                                   use12Hours format={'h:mm a'}
                                                                                   showSecond={false}/></span>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBtn rounded outline onClick={this.toggleVerify}>
                                {localization.cancel}
                            </MDBBtn>
                            <MDBBtn rounded onClick={this.verify}>
                                {localization.verify}
                            </MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCollapse>}
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        shift: state.shift,
        lead: state.lead,
        user: state.user,
        interaction: state.interaction
    }
}

export default connect(mapStateToProps)(Active);
