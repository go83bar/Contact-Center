import React, { Component } from 'react'
import {MDBBox, MDBBtn, MDBCard, MDBCardFooter, MDBSelect, MDBStep, MDBStepper, MDBIcon } from 'mdbreact'
import {connect} from "react-redux";
import Calendar from "../../ui/Calendar";
import TimeSlots from "../../ui/TimeSlots";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle as faCircleSolid,
    faClipboardList,
    faCheck,
    faMapMarkerAlt,
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faCalendar} from "@fortawesome/pro-regular-svg-icons"
import AppointmentAPI from '../../../api/appointmentAPI';
import moment from "moment"
import {toast} from "react-toastify"
import Slack from "../../../utils/Slack"
import BookingQuestion from "./BookingQuestion"

class NewAppointmentBooking extends Component {

    constructor(props) {
        super(props)

        // set logo colors for easy maintenance
        this.colors = {
            primary: "skin-primary-color",
            secondary: "skin-secondary-color"
        }

        // build initial appointment type select options
        this.typeOptions = props.shift.clients[props.lead.client_index].appointment_types.map( apptType => {
            return {
                text: apptType.label,
                value: apptType.id.toString()
            }
        })

        const typeOptionsArray = JSON.parse(JSON.stringify(this.typeOptions))

        this.initialState = {
            isBooking: false,
            steps: ["type"],
            currentStep: "type",
            typeOptions: typeOptionsArray,
            officeOptions: undefined,
            loadingOffices: false,
            loadingOffice: false,
            appointmentTypeID: undefined,
            appointmentType: undefined,
            office: undefined,
            officeID: undefined,
            bookingQuestions: undefined,
            appointmentAVS: undefined,
            timeslots: undefined,
            dateSelected: undefined,
            startTime: undefined,
            previousVisible: false,
            nextVisible: true,
            nextDisabled: true,
            nextLabel: props.localized.nextLabel
        }

        this.state = { ...this.initialState }

    }

    startBookingFlow = () => {
        this.setState({ isBooking: true})
    }

    resetBookingFlow = () => {
        const typeOptionsArray = JSON.parse(JSON.stringify(this.typeOptions))
        this.setState({ ...this.initialState, typeOptions: typeOptionsArray})
    }

    nextBookingStep = () => {
        let newStepIndex = this.state.steps.indexOf(this.state.currentStep) + 1
        let newNextVisible = true
        if (newStepIndex + 1 === this.state.steps.length) {
            // next step is the last one
            newNextVisible = false
        }
        this.setState({
            currentStep: this.state.steps[newStepIndex],
            previousVisible: true,
            nextVisible: newNextVisible
        })
    }
    previousBookingStep = () => {
        let newStepIndex = this.state.steps.indexOf(this.state.currentStep) - 1
        let newPreviousVisible = true
        if (newStepIndex === 0) {
            // next step is the first one
            newPreviousVisible = false
        }

        this.setState({
            currentStep: this.state.steps[newStepIndex],
            nextDisabled: false,
            nextVisible: true,
            previousVisible: newPreviousVisible
        })
    }

    onTypeSelect = (values) => {
        const apptTypeID = parseInt(values[0])

        // find full appointment type data
        const apptType = this.props.shift.clients[this.props.lead.client_index].appointment_types.find( apptType => apptType.id === apptTypeID )

        // set it into state while clearing any existing office and resetting office select
        this.setState({
            appointmentType: apptType,
            appointmentTypeID: apptTypeID,
            loadingOffices: true,
            officeOptions: undefined,
            office: undefined
        })

        // load offices for the chosen type
        AppointmentAPI.getOfficeOptions({ apptTypeID: apptTypeID, regionID: this.props.lead.region_id }).then( response => {
            let officeOptions = []
            if (response.offices.length) {
                // this will change once we can return more than just name and id from the backend
                // at least we will want to know whether the office uses calendar or not
                officeOptions = response.offices.map( (office, index, offices) => {
                    return {
                        text: office.name,
                        value: office.id.toString(),
                        checked: offices.length === 1
                    }
                })
            } else {
                // sometimes not all appointment types are accepted by all offices
                toast.error("That appointment type has no offices in the region")
                this.setState({
                    loadingOffices: false
                })
                return
            }
            
            // set All Offices option if region has combined calendars setting
            if (response.combined_calendar) {
                officeOptions.push( { text: this.props.localized.allOfficesOption, value: "combined" })
            }

            // if there's only one office, we can assume that's the one and start loading it
            if (response.offices.length === 1) {
                const officeID = response.offices[0].id
                this.onOfficeSelect([officeID])
            }

            // set options into state to update the UI
            this.setState({
                loadingOffices: false,
                officeOptions: officeOptions
            })

        }).catch( reason => {
            toast.error("There was a problem loading the offices.")

            this.setState({
                loadingOffices: false
            })
        })
    }

    onOfficeSelect = (values) => {
        let officeID = 0
        // for combined calendars, we don't need to find the office data
        if (values[0] === "combined") {
            this.setState({
                loadingOffice: true
            })
        } else {
            // specific office was chosen, let's make sure we have all the data and set it into state
            officeID = parseInt(values[0])
            const offices = this.props.shift.clients[this.props.lead.client_index].regions[this.props.lead.region_index].offices
            if (offices !== undefined && offices.length) {
                const office = offices.find( office => office.id === officeID)
                if (office !== undefined) {
                    // set state to indicate we're loading data for the chosen office
                    this.setState({
                        loadingOffice: true,
                        office: office,
                        officeID: officeID
                    })
                } else {
                    // this will probably never happen, but we handle errors around here
                    toast.error("Data cound not be found for that office.")
                    Slack.sendMessage("Agent selected office " + values[0] + " but that office data was not present in the shift data")
                    return
                }
            } else {
                // data error, somehow an office was chosen despite the lead's region not having any offices
                toast.error("Could not load office data. Please notify dev.")
                Slack.sendMessage("Agent selected office " + values[0] + " but no office data was present in the shift data")
                return
            }
        }

        // load calendar slots
        const calendarListParams = {
            officeID: officeID,
            appointmentTypeID: this.state.appointmentTypeID,
            leadID: this.props.lead.id,
            month: moment().month() + 1,
            year: moment().year()
        }

        AppointmentAPI.getCalendar(calendarListParams).then( response => {
            if (response.success !== true) {
                // usually ApiException error response
                toast.error("Calendar could not be loaded")
                Slack.sendMessage("Agent " + this.props.user.id + " - Appointment calendar retrieve error: " + response.error)
                return
            }
            // start building actual set of steps for this combo
            let steps = ["type"]
            let bookingQuestions = []

            // if there's no slots, notify user and bounce
            if (response.appointments.length === 0) {
                toast.warn("Selected office has no appointment slots for that type")
                this.setState({loadingOffice: false})
                return
            }

            const officeSlots = response
            // load any booking questions
            const bookingQuestionParams = {
                appointmentTypeID: this.state.appointmentTypeID,
                officeID: officeID,
                leadID: this.props.lead.id
            }
            AppointmentAPI.getBookingQuestions(bookingQuestionParams).then( response => {
                if (response.success && response.questions.length > 0) {
                    steps.push("questions")
                    bookingQuestions = response.questions
                }
                // set calendar and booking questions into state, enabling next button
                steps.push("calendar")
                this.setState({
                    loadingOffice: false,
                    bookingQuestions: bookingQuestions,
                    appointmentAVS: officeSlots,
                    nextDisabled: false,
                    steps: steps
                })

            }).catch( reason => {
                // TODO handle error from API
                console.log("Booking questions fetch returned an error: ", reason)
            })
        }).catch( reason => {
            // something went wrong with the request
            toast.error("Calendar could not be loaded")
            Slack.sendMessage("Agent " + this.props.user.id + " - Appointment calendar retrieve error: " + reason)
            return

        })
    }

    generateBookingQuestions = () => {
        // build array of booking question components for the loaded data
        if (this.state.bookingQuestions === undefined) return ""

        const questions = this.state.bookingQuestions.map( question => {
            return <BookingQuestion question={question} changeHandler={this.onBookingResponse} key={question.id} />
        })

        return questions
    }

    onBookingResponse = (questionID, questionableID, selectedAnswer) => {
        // persist chosen response(s) back to db
        const saveResponseParams = {
            leadID: this.props.lead.id,
            interactionID: this.props.interaction.id,
            questionID,
            questionableID,
            response: selectedAnswer
        }

        console.log("Got a booking response: ", saveResponseParams)
        AppointmentAPI.saveResponse(saveResponseParams).then( response => {
            if (response.success) {
                // insert them into the state
                const bookingQuestions = this.state.bookingQuestions.map( question => {
                    // this map must return a copy of the question unless it is the question that's been answered
                    // in which case it must return a copy of that question with selected answers indicated
                    if (question.id === questionID) {
                        switch(question.type) {
                            // how we indicate selected answers depends on the question type
                            case "text":
                                return { ...question, response: selectedAnswer}
                            case "radio":
                            case "checkbox":
                                const newAnswers = question.answers.map( answer => {
                                    if (selectedAnswer.indexOf(answer.answerable_id.toString()) !== -1) {
                                        return { ...answer, selected: true}
                                    }
                                    return { ...answer, selected: false}
                                })

                                return { ...question, response: selectedAnswer, answers: newAnswers }

                        }
                    } else return { ...question}
                })

                this.setState({ bookingQuestions })

                // push generated responses to the store
                // TODO waiting for responses to be part of the lead store from LeadDTO
            
            } else {
                //TODO handle this error
                console.log("Got abnormal response from saveResponse: ", response)
            }

        }).catch( reason => {
            //TODO handle this error
            console.log("SAVE RESPONSE FAILED: ", reason)
        })

    }

    onCalendarChange = (date) => {
        console.log("Chosen Date: ", date)
        let newTimes = []
        if (this.state.appointmentAVS !== undefined && this.state.appointmentAVS.appointments !== undefined){
            newTimes = this.state.appointmentAVS.appointments[date]
        }

        this.setState({timeslots: newTimes, dateSelected: date})
    }

    onSlotSelection = (slotTime) => {

        // validate known data
        const detailsRequired = [
            "first_name",
            "last_name",
            "cell_phone",
            "zip",
            "email"
        ]
        let validated = true

        detailsRequired.forEach( field => {
            if (this.props.lead.details[field] === null || this.props.lead.details[field] === null || this.props.lead.details[field] === "") {
                const niceName = field.replace("_", " ")
                toast.error("Lead must have valid " + niceName + " value to book this appointment.")
                validated = false
            }
        })

        // check booking response if necessary


        // bounce if validation checks had a problem
        if (!validated) {
            return
        }

        // send booking request
        const apptTime = this.state.dateSelected + " " + slotTime + ":00"
        const bookingParams = {
            appointmentTime: apptTime,
            officeID: this.state.officeID,
            leadID: this.props.lead.id,
            interactionID: this.props.interaction.id,
            appointmentTypeID: this.state.appointmentTypeID

        }

        console.log("Booking params: ", bookingParams)

        AppointmentAPI.book(bookingParams).then( response => {
            if (response.success) {
                toast.success("Appointment booked!", {delay: 1000})

                // add new appointment to the store
                const newAppointment = {
                    id: response.appointment_id,
                    appointment_type_id: this.state.appointmentTypeID,
                    appointment_status_id: response.appointment.appointment_status_id,
                    start_time: response.appointment.start_time,
                    created_at: response.appointment.created_at,
                    updated_at: response.appointment.updated_at,
                    created_by: this.props.user.label_name,
                    interaction_id: response.appointment.interaction_id,
                    office_id: response.appointment.office_id,
                    client_id: response.appointment.client_id,
                    confirmed: response.appointment.confirmed
                }
                this.props.dispatch({type: "LEAD.APPOINTMENT_BOOKED", data: newAppointment})
                this.resetBookingFlow()
            } else {
                toast.error("Could not book appointment")
                console.log("Booking not success: ", response)
            }
        }).catch( reason => {
            toast.error("Could not book appointment")
            console.log("REASON: ", reason)
        })
    }

    generateLoadingIcon = () => {
        if (this.state.loadingOffices || this.state.loadingOffice) {
            return <MDBIcon icon="cog" spin fixed />
        }

        return ""
    }

    render() {
        if (!this.state.isBooking) {
            return (
                <MDBBtn rounded onClick={this.startBookingFlow}>
                    {this.props.localized.bookButtonLabel}
                </MDBBtn>
            )
        }
        return (
            <MDBCard className="d-flex flex-column w-100 mt-2 shadow-none">
                <MDBStepper className="d-flex m-0 p-0 bookingStepper p-2">
                    <MDBStep stepName="Appointment Type">
                    <span className="fa-layers fa-3x mt-2 p-0">
                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                        <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === "type" ? this.colors.primary : this.colors.secondary}/>
                        <FontAwesomeIcon icon={faMapMarkerAlt} transform={"shrink-8"}
                                            className={"skin-secondary-color"}/>
                        {this.state.currentStep !== "type" && <span className={"fa-layers-counter fa-layers-top-right skin-primary-background-color"}>
                            <FontAwesomeIcon icon={faCheck} className="skin-text"/>
                        </span>}
                    </span>
                    </MDBStep>
                    {this.state.steps.includes("questions") &&
                        <MDBStep stepName="Booking Questions">
                        <span className="fa-layers fa-3x mt-2 p-0">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === "questions" ? this.colors.primary : this.colors.secondary}/>
                            <FontAwesomeIcon icon={faClipboardList} transform={"shrink-8"}
                                                className={"skin-secondary-color"}/>
                            {this.state.steps.indexOf(this.state.currentStep) > this.state.steps.indexOf("questions") && <span className={"fa-layers-counter fa-layers-top-right skin-primary-background-color"}>
                                <FontAwesomeIcon icon={faCheck} className="skin-text"/>
                            </span>}
                        </span>

                        </MDBStep>}

                    <MDBStep stepName="Calendar">
                    <span className="fa-layers fa-3x mt-2 p-0">
                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                        <FontAwesomeIcon icon={faCircle} className={this.state.currentStep === "calendar" ? this.colors.primary : this.colors.secondary}/>
                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}
                                            className={"skin-secondary-color"}/>
                    </span>
                    {this.state.currentStep === "saving" && <span className={"fa-layers-counter fa-layers-top-right skin-primary-background-color"}>
                            <FontAwesomeIcon icon={faCheck} className="skin-text"/>
                        </span>}

                    </MDBStep>
                </MDBStepper>


                <MDBBox className="pl-5 pr-5 pb-3">
                    <MDBBox className={this.state.currentStep === "type" ? "w-100" : "hidden"}>
                        {this.props.localized.typeTitle}<br />
                        <MDBBox className="d-flex w-100">
                            { this.state.typeOptions && <MDBSelect className="w-50"
                                options={this.state.typeOptions}
                                getValue={this.onTypeSelect}
                                label={this.props.localized.typeOptionsLabel}
                                />}

                            { this.state.officeOptions && <MDBSelect className="w-50 ml-3"
                                    options={this.state.officeOptions}
                                    search={this.state.officeOptions.length > 8}
                                    getValue={this.onOfficeSelect}
                                    label={this.props.localized.officeOptionsLabel}
                                />
                            }
                        </MDBBox>
                    </MDBBox>

                    <MDBBox className={this.state.currentStep === "questions" ? "w-100" : "hidden"}>
                        {this.props.localized.bookingTitle}<br />
                        <MDBBox className="d-flex flex-wrap w-100">
                            {this.generateBookingQuestions()}
                        </MDBBox>
                    </MDBBox>

                    { this.state.appointmentAVS !== undefined && <MDBBox className={this.state.currentStep === "calendar" ? "w-100":"hidden"} style={{backgroundColor: "#fbfbfb"}}>
                        {this.props.localized.calendarTitle}<br />
                        <MDBBox className="d-flex w-100 f-m mt-3 p-2">
                            <Calendar className="w-50 bg-white" subtitle={"Mary Delany-Hudzik, MS, LCGC"}
                                        alternateValue={this.state.appointmentAVS} disablePastDates={true}
                                        onChange={this.onCalendarChange}/>
                            <TimeSlots className="w-50 ml-3"
                                        timeSelect={this.onSlotSelection}
                                        values={this.state.timeslots}/>
                        </MDBBox>
                    </MDBBox>}
                </MDBBox>


                <MDBCardFooter className="d-flex justify-content-between p-2">
                    <MDBBtn outline rounded onClick={this.resetBookingFlow}>
                        { this.props.localization.buttonLabels.cancel }
                    </MDBBtn>
                        <MDBBox className="d-flex justify-content-end">
                            {this.state.previousVisible && <MDBBtn rounded onClick={this.previousBookingStep}>
                                { this.props.localization.buttonLabels.previous }
                            </MDBBtn>}
                            {this.state.nextVisible && <MDBBtn disabled={this.state.nextDisabled} rounded onClick={this.nextBookingStep}>
                                { this.props.localization.buttonLabels.next } { this.generateLoadingIcon() }
                            </MDBBtn>}
                        </MDBBox>
                </MDBCardFooter>
            </MDBCard>

        )
    }
}


const mapStateToProps = state => {
    return {
        localization: state.localization,
        localized: state.localization.interaction.booking,
        lead: state.lead,
        shift: state.shift,
        interaction: state.interaction,
        user: state.user
    }
}

export default connect(mapStateToProps)(NewAppointmentBooking);

