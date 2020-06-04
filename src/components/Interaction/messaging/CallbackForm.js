import React, {Component} from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBSelect
} from "mdbreact"
import {connect} from "react-redux"
import {faTimes} from "@fortawesome/pro-solid-svg-icons"
import Draggable from 'react-draggable'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import TimePicker from "rc-time-picker"
import moment from "moment"
import 'rc-time-picker/assets/index.css'
import {SingleDatePicker} from "react-dates"


class CallbackForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            time: moment().hour(0).minute(0)
        };

    }

    handleDateClick = (date) => {
        if (date > moment().hour(0).minute(0))
            this.setState({ date : date });
    }
    handleTimeClick = (value) => {
        this.setState({ time : value.format('h:mm a') });
    }

    render() {
        return(
            <Draggable handle={".card-header"}>
                <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"450px",minHeight:"570px",right:193, top:70}}>
                    <MDBCardHeader className="skin-secondary-background-color skin-text">Schedule Callback
                        <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.props.toggle}/>
                    </MDBCardHeader>
                    <MDBCardBody className="d-flex flex-column justify-content-center px-3 py-0">
                        <MDBSelect selected={"Select reason"} label={"Reason"}/>

                        <span>Date:
                        <SingleDatePicker
                            numberOfMonths={2}
                            hideKeyboardShortcutsPanel={true}
                            noBorder
                            date={this.state.date} // momentPropTypes.momentObj or null
                            onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                            focused={this.state.focused} // PropTypes.bool
                            onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                            id="sdp" // PropTypes.string.isRequired,
                        /></span>

                        <span>Time: <TimePicker onChange={this.handleTimeClick} defaultValue={moment().hour(0).minute(0)} use12Hours format={'h:mm a'} showSecond={false} /></span>

                        <div className="md-form w-100">
                            <textarea className="md-textarea form-control" rows="3" placeholder={"Add a note if needed."}></textarea>
                        </div>
                    </MDBCardBody>
                    <MDBCardFooter className="d-flex justify-content-end">
                        <MDBBtn outline rounded onClick={this.props.toggle}>Cancel</MDBBtn>
                        <MDBBtn rounded onClick={this.props.toggle}>Send</MDBBtn>
                    </MDBCardFooter>
                </MDBCard>
            </Draggable>        
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead : state.lead
    }
}

export default connect(mapStateToProps)(CallbackForm);
