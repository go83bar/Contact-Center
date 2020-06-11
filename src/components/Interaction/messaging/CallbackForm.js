import React, {Component} from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader

} from "mdbreact"
import {connect} from "react-redux"
import {faTimes} from "@fortawesome/pro-solid-svg-icons"
import Draggable from 'react-draggable'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import TimePicker from "rc-time-picker"
import moment from "moment"
import 'rc-time-picker/assets/index.css'
import {SingleDatePicker} from "react-dates"
import InteractionAPI from '../../../api/interactionAPI'
import LeadAPI from '../../../api/leadAPI'


class CallbackForm extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            date: moment(),
            time: "00:00:00",
            note: "",
            saveButtonLabel: this.props.localization.saveButtonLabel,
            saving: false
        };

    }

    handleDateClick = (date) => {
        if (date > moment().hour(0).minute(0))
            this.setState({ date : date });
    }
    handleTimeClick = (value) => {
        if (value) {
            this.setState({ time: value.format("HH:mm:ss") });
        }
    }

    handleNoteContent = (evt) => {
        this.setState( {note: evt.target.value})
    }

    saveCallback = () => {
        this.setState({saveButtonLabel: this.props.localization.savingButtonLabel, saving: true })
        const params = {
            callbackTime: this.state.date.format("YYYY-MM-DD ") + this.state.time,
            interactionID: this.props.interaction.id
        }
        InteractionAPI.saveCallback(params).then( response => {
            console.log("callback response:", response )
            console.log("Note content: ", this.state.note)
            this.setState({saveButtonLabel: this.props.localization.savedButtonLabel})
            if (this.state.note !== "") {
                LeadAPI.saveNote({
                    noteContent: this.state.note,
                    interactionID: this.props.interaction.id
                }).then( response => {
                    const newNote = {
                        id: response.data.id,
                        interaction_id: this.props.interaction.id,
                        content: this.state.note,
                        created_by: this.props.user.label_name,
                        created_at: moment().format()
                    }
                    this.props.dispatch({
                        type: "LEAD.NOTE_SAVED",
                        data: newNote
                    })

                    this.props.toggle()
                }).catch( reason => {
                    console.log("Error saving callback note: ", reason)
                })
            } else {
                this.props.toggle()
            }
        }).catch( reason => {
            console.log("Error saving callback: ", reason)
        })
    }

    render() {
        return(
            <Draggable handle={".card-header"}>
                <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"450px",minHeight:"570px",right:193, top:70}}>
                    <MDBCardHeader className="skin-secondary-background-color skin-text">{this.props.localization.title}
                        <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.props.toggle}/>
                    </MDBCardHeader>
                    <MDBCardBody className="px-3 py-0">
                        <span>{this.props.localization.dateLabel}:
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

                        <span>{this.props.localization.timeLabel}: <TimePicker onChange={this.handleTimeClick} defaultValue={moment().hour(0).minute(0)} use12Hours format={'h:mm a'} showSecond={false} /></span>

                        <div className="md-form w-100">
                            <textarea className="md-textarea form-control" onChange={this.handleNoteContent} rows="3" placeholder={this.props.localization.notePlaceholder}></textarea>
                        </div>
                    </MDBCardBody>
                    <MDBCardFooter className="d-flex justify-content-between">
                        <MDBBtn outline rounded onClick={this.props.toggle}>{this.props.localization.cancelButton}</MDBBtn>
                        <MDBBtn rounded onClick={this.saveCallback} disabled={this.state.saving}>{ this.state.saveButtonLabel}</MDBBtn>
                    </MDBCardFooter>
                </MDBCard>
            </Draggable>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        user: state.user,
        localization: state.localization.interaction.summary.callbackForm,
        interaction : state.interaction
    }
}

export default connect(mapStateToProps)(CallbackForm);
