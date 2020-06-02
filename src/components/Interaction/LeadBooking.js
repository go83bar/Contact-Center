import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBCardBody, MDBCard, MDBSelect} from 'mdbreact'
import {connect} from "react-redux";
import Calendar from "../ui/Calendar";
import TimeSlots from "../ui/TimeSlots";
import moment from "moment";

class LeadBooking extends Component {

    constructor(props) {
        super(props);
        this.onCalendarChange = this.onCalendarChange.bind(this)
        this.toggleBooking = this.toggleBooking.bind(this)
        this.state = {
            apptType: [
                { text : "type", value:"1"}
            ],
            office: [
                { text : "type", value:"1"}
            ],
            booking : false,
            dateSelected: moment().format("YYYY-MM-DD")

        };
    }

    onCalendarChange(date) {
        this.setState({dateSelected : date})
    }
    toggleBooking() {
        this.setState({booking : !this.state.booking})
    }

    render() {
        if (this.props.active === true) {

            let localization = this.props.localization.interaction.booking
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
            return (
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className="d-flex w-100 justify-content-end gray-border rounded p-2">
                        <MDBBtn rounded onClick={this.toggleBooking}>{localization.bookButton}</MDBBtn>
                    </div>
                    <MDBCard className="d-flex flex-column w-100 mt-2 border">
                        <div className="bg-white p-3">{localization.title}</div>
                        <MDBCardBody className="d-flex w-100 flex-row flex-wrap justify-content-center">
                            <MDBBox className="d-flex w-50">
                                <MDBSelect className="w-100" options={this.state.apptType} selected={localization.selectAppointment}/>
                            </MDBBox>
                            <MDBBox className="d-flex w-50">
                                <MDBSelect className="w-100" options={this.state.office} selected={localization.selectOffice}/>
                            </MDBBox>
                            <MDBBox className="d-flex w-100 border-bottom">
                                <MDBBox className="d-flex flex-column w-50">
                                    {localization.qualifyingTitle}
                                    <MDBSelect className="d-flex w-50" options={this.state.apptType} selected={localization.selectAppointment}/>
                                    <MDBSelect className="d-flex w-50" options={this.state.office} selected={localization.selectOffice}/>
                                </MDBBox>
                                <MDBBox className="d-flex flex-column w-50">
                                    {localization.qualifyingTitle}
                                    <MDBSelect className="d-flex w-50" options={this.state.apptType} selected={localization.selectAppointment}/>
                                    <MDBSelect className="d-flex w-50" options={this.state.office} selected={localization.selectOffice}/>
                                </MDBBox>
                            </MDBBox>
                            <MDBBox className="d-flex w-100 f-m mt-3" style={{backgroundColor: "#fbfbfb"}}>
                                <Calendar className="w-50 bg-white" subtitle={"Mary Delany-Hudzik, MS, LCGC"} alternateValue={avs} disablePastDates={true} onChange={this.onCalendarChange} />
                                <TimeSlots className="w-50 ml-3" values={avs.appointments[this.state.dateSelected]}/>
                            </MDBBox>
                        </MDBCardBody>
                    </MDBCard>
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
        lead : state.lead,
        shift: state.shift
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadBooking);
