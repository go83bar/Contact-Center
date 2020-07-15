import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCollapse} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faStickyNote, faEdit, faTrashAlt} from '@fortawesome/pro-solid-svg-icons'
import {faCircle} from '@fortawesome/pro-light-svg-icons'
import * as moment from 'moment'
import LeadAPI from "../../../api/leadAPI";

class LeadNote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            noteContent: this.props.note.content,
            disableSave : false
        };
    }

    editClick = () => {
        // this.props.onEdit(this.props.note.id)
        this.setState({edit: true})
    }

    deleteClick = () => {
        this.props.deleteNote(this.props.note.id)
    }

    // user has changed the content of the note edit textarea
    updateNoteContent = (event) => {
        this.setState({
            noteContent: event.target.value,
            disableSave: false
        })
    }
    editCancelClick = () => {
        this.setState({edit: false, noteContent: this.props.note.content})
    }

    // user has clicked button to save contents of note edit textarea
    saveNote = () => {
        // make sure there's actually content to save
        if (this.state.noteContent === "") {
            return;
        }

        const payload = {
            noteID: this.props.note.id,
            noteContent: this.state.noteContent
        }

        this.setState({
            disableSave: true
        })

        LeadAPI.updateNote(payload)
            .then(response => {
                // dispatch update to store
                if (response.success) {
                    this.props.dispatch({
                        type: "LEAD.NOTE_UPDATED",
                        data: payload
                    })
                }

                // update local state to clear editing box
                this.setState({
                    edit: false,
                    disableSave: false
                })
            }).catch((reason) => {
            // TODO handle error
            console.log("Error saving note: ", reason)
        })
    }

    render() {
        const localization = this.props.localization
        return (
            <MDBBox className="d-flex flex-column mb-3 w-100">
                <MDBCard className="d-flex w-100 shadow-sm border-0">
                    <MDBBox className="d-flex backgroundColorInherit timelineCardHeader skin-border-primary f-m w-100">
                        <div className='d-flex w-100'>

                    <span className={"fa-layers fa-fw fa-3x mt-3 ml-2"}>
                        <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                        <FontAwesomeIcon icon={faStickyNote} transform={"shrink-8"}/>
                    </span>
                            <MDBBox className="d-flex p-2 flex-column justify-content-start text-left w-75">
                                <strong>{this.props.note.created_by}</strong> <br/>
                                {this.props.note.content}
                            </MDBBox>
                            <MDBBox className="d-flex f-s justify-content-end p-2 w-25 text-right">
                                <strong>{moment(this.props.note.created_at).format("MMM D, YYYY")}</strong>
                                &nbsp;{moment(this.props.note.created_at).format("h:mm a")}
                            </MDBBox>
                            {this.props.note.interaction_id === this.props.interaction.id && (
                                <MDBBox className="noteButtons">
                                    <MDBBox
                                        className="noteButtonEdit"
                                        onClick={this.editClick}
                                        style={{flex: "0 0 48px"}}
                                    >
                                        <FontAwesomeIcon icon={faEdit} transform={"shrink-2"}/>
                                    </MDBBox>
                                    <MDBBox
                                        className="noteButtonDelete w-100 h-100 rounded-right"
                                        onClick={this.deleteClick}
                                        style={{flex: "0 0 48px"}}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} transform={"shrink-2"}/>
                                    </MDBBox>

                                </MDBBox>
                            )}
                        </div>
                    </MDBBox>
                </MDBCard>
                {this.state.edit && <MDBCollapse className="bg-white mx-2 my-1" isOpen={true}>
                    <MDBCard className="d-flex border-0 shadow-none">
                        <MDBCardBody className="d-flex justify-content-center p-2">
                            <textarea className="form-control"
                                      style={{borderColor: "#dee2e6"}}
                                      rows="5"
                                      onChange={this.updateNoteContent}
                                      onBlur={this.stoppedEditingContent}
                                      value={this.state.noteContent}
                            />
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between p-1">
                            <MDBBtn rounded outline onClick={this.editCancelClick}>
                                {localization.buttonLabels.cancel}
                            </MDBBtn>
                            <MDBBtn rounded
                                    onClick={this.saveNote}
                                    disabled={this.state.disableSave}
                            >
                                {localization.buttonLabels.save}
                            </MDBBtn>
                        </MDBCardFooter> </MDBCard>
                </MDBCollapse>}
            </MDBBox>
        )
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization,
        interaction: store.interaction
    }
}


export default connect(mapStateToProps)(LeadNote);
