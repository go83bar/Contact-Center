import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBCard, MDBCardFooter, MDBSelect, MDBStep, MDBStepper} from 'mdbreact'
import {connect} from "react-redux";
import Active from "./appointments/cards/Active";
import Calendar from "../ui/Calendar";
import TimeSlots from "../ui/TimeSlots";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle as faCircleSolid
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faCalendar} from "@fortawesome/pro-regular-svg-icons"

class LeadAppointments extends Component {

    constructor(props) {
        super(props);
        this.renderAppointments = this.renderAppointments.bind(this)
        this.onCalendarChange = this.onCalendarChange.bind(this)
        this.toggleBooking = this.toggleBooking.bind(this)
        this.nextBookingStep = this.nextBookingStep.bind(this)
        this.previousBookingStep = this.previousBookingStep.bind(this)
        this.state = {
            apptType: [
                {text: "type", value: "1"}
            ],
            office: [
                {text: "type", value: "1"}
            ],
            dateSelected: moment().format("YYYY-MM-DD"),
            booking: false,
            currentBookingStep: "type",
            bookingSteps : ["type", "office", "qualify", "booking", "date"]
        };
    }

    toggleBooking() {
        this.setState({booking: !this.state.booking})
    }


    nextBookingStep() {
        let index = this.state.bookingSteps.indexOf(this.state.currentBookingStep)
        this.setState({currentBookingStep : this.state.bookingSteps[index + 1]})
    }
    previousBookingStep() {
        let index = this.state.bookingSteps.indexOf(this.state.currentBookingStep)
        this.setState({currentBookingStep : this.state.bookingSteps[index - 1]})
    }

    onCalendarChange(date) {
        this.setState({dateSelected: date})
    }

    renderAppointments() {
        const appts = this.props.lead.appointments.map((appt, index) => {
            return <Active key={"appointment-" + index} data={appt}/>
        })
        return appts
    }

    render() {
        if (this.props.active === true) {
            let avs = {
                "timezone": "CDT",
                "timezone_long": "America/Chicago",
                "appointments": {
                    "2020-05-19": [
                        "10:00",
                        "10:30",
                        "12:30",
                        "17:00"
                    ],
                    "2020-05-20": [
                        "15:30",
                        "15:45"
                    ]
                }
            }
            let localization = this.props.localization.interaction.appointment
            return (
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className="d-flex w-100 justify-content-end gray-border rounded">
                        {!this.state.booking ?
                            <MDBBtn rounded onClick={this.toggleBooking}>
                                {localization.bookButton}
                            </MDBBtn>
                            :
                            <MDBCard className="d-flex flex-column w-100 mt-2 shadow-none">
                                <MDBStepper className="d-flex m-0 p-0 bookingStepper p-2 ">
                                    <MDBStep stepName="Appointment Type">
                                    <span className="fa-layers fa-3x mt-2 p-0">
                                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                        <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}
                                                         className={"skin-secondary-color"}/>
                                    </span>
                                    </MDBStep>
                                    <MDBStep stepName="Office">
                                    <span className="fa-layers fa-3x mt-2 p-0">
                                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                        <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}
                                                         className={"skin-secondary-color"}/>
                                    </span>

                                    </MDBStep>
                                    <MDBStep stepName="Qualifying Questions">
                                    <span className="fa-layers fa-3x mt-2 p-0">
                                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                        <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}
                                                         className={"skin-secondary-color"}/>
                                    </span>

                                    </MDBStep>
                                    <MDBStep stepName="Booking Questions">
                                    <span className="fa-layers fa-3x mt-2 p-0">
                                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                        <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}
                                                         className={"skin-secondary-color"}/>
                                    </span>

                                    </MDBStep>
                                    <MDBStep stepName="Appointment Date">
                                    <span className="fa-layers fa-3x mt-2 p-0">
                                        <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                        <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                        <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"}
                                                         className={"skin-secondary-color"}/>
                                    </span>

                                    </MDBStep>
                                </MDBStepper>

                                {this.state.currentBookingStep === "type" && <MDBBox className="d-flex w-50 p-2">
                                    <MDBSelect className="w-100" options={this.state.apptType}
                                               selected={localization.selectAppointment}/>
                                </MDBBox>}
                                {this.state.currentBookingStep === "office" && <MDBBox className="d-flex w-50 p-2">
                                    <MDBSelect className="w-100" options={this.state.office}
                                               selected={localization.selectOffice}/>
                                </MDBBox>}
                                {this.state.currentBookingStep === "qualify" && <MDBBox className="d-flex flex-column w-50 p-2">
                                    {localization.qualifyingTitle}
                                    <MDBSelect className="d-flex w-50" options={this.state.apptType}
                                               selected={localization.selectAppointment}/>
                                    <MDBSelect className="d-flex w-50" options={this.state.office}
                                               selected={localization.selectOffice}/>
                                </MDBBox>}
                                {this.state.currentBookingStep === "booking" && <MDBBox className="d-flex flex-column w-50 p-2">
                                    {localization.bookingTitle}
                                    <MDBSelect className="d-flex w-50" options={this.state.apptType}
                                               selected={localization.selectAppointment}/>
                                    <MDBSelect className="d-flex w-50" options={this.state.office}
                                               selected={localization.selectOffice}/>
                                </MDBBox>}
                                {this.state.currentBookingStep === "date" &&
                                <MDBBox className="d-flex w-100 f-m mt-3 p-2" style={{backgroundColor: "#fbfbfb"}}>
                                    <Calendar className="w-50 bg-white" subtitle={"Mary Delany-Hudzik, MS, LCGC"}
                                              alternateValue={avs} disablePastDates={true}
                                              onChange={this.onCalendarChange}/>
                                    <TimeSlots className="w-50 ml-3"
                                               values={avs.appointments[this.state.dateSelected]}/>
                                </MDBBox>}
                                <MDBCardFooter className="d-flex justify-content-between p-2">
                                <MDBBtn outline rounded onClick={this.toggleBooking}>
                                    Cancel
                                </MDBBtn>
                                    <MDBBox className="d-flex justify-content-end">
                                        <MDBBtn rounded onClick={this.previousBookingStep}>
                                            Previous
                                        </MDBBtn>
                                        <MDBBtn rounded onClick={this.nextBookingStep}>
                                            Next
                                        </MDBBtn>
                                    </MDBBox>
                                </MDBCardFooter>
                            </MDBCard>}
                    </div>
                    <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                        <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                            <span className="f-l font-weight-bold m-2">{localization.appointments}</span>
                            {this.props.lead.appointments && this.renderAppointments()}

                        </div>
                    </MDBBox>
                </MDBBox>
            )
        } else {
            return null
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(LeadAppointments);

