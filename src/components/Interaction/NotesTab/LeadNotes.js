import React, { Component } from 'react'
import {
    MDBBox,
    MDBBtn,
    MDBIcon,
    MDBRow,
    MDBCol,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader
} from "mdbreact"
import { connect } from "react-redux"
import LeadNote from './LeadNote'
import LeadAPI from '../../../api/leadAPI'
import * as moment from 'moment'

class LeadNotes extends Component {

    constructor(props) {
        super(props)


        this.state = {
            noteContent: "",
            noteID: undefined,
            noteBtnLabel: props.localization.buttonLabels.save,
            isEditing: false,
            isSaving: false
        }

    }

    // user has changed the content of the note edit textarea
    updateNoteContent = (event) => {
        this.setState({
            noteContent: event.target.value
        })
    }

    // called when user clicks away from note content field after editing
    // used to trip alert when ending interaction if there is unsaved note content
    stoppedEditingContent = (event) => {
        if (event.target.value === "" && this.props.interaction.hasUnsavedNote) {
            this.props.dispatch({ type: "INTERACTION.CLEAR_UNSAVED_NOTE"})
            return
        }

        if (event.target.value !== "" && !this.props.interaction.hasUnsavedNote) {
            this.props.dispatch({ type: "INTERACTION.FLAG_UNSAVED_NOTE"})
            return
        }
    }

    // user has delete button with a note
    deleteNote = () => {

        this.setState({
            isSaving: true
        })

        const payload = {
            noteID: this.state.noteID,
            leadID: this.props.lead.id
        }
        LeadAPI.deleteNote(payload).then(response => {
            if (response.success) {
                this.props.dispatch({
                    type: "LEAD.NOTE_DELETED",
                    data: {
                        noteID: payload.noteID
                    }
                })
            }
            this.closeModal()
        })
    }

    // user has clicked button to save contents of note edit textarea
    saveNote = () => {
        // make sure there's actually content to save
        if (this.state.noteContent === "") {
            return;
        }
        
        // might be an update or saving a new note
        if (this.state.isEditing) {
            const payload = {
                noteID: this.state.noteID,
                noteContent: this.state.noteContent
            }

            this.setState({
                isSaving: true
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
                        noteContent: "",
                        noteID: undefined,
                        noteBtnLabel: this.props.localization.buttonLabels.save,
                        isSaving: false,
                        isEditing: false
                    })
                })
        } else {
            // this a new note to save
            const payload = {
                noteContent: this.state.noteContent,
                interactionID: this.props.interaction.id
            }

            this.setState({
                isSaving: true
            })
            LeadAPI.saveNote(payload)
                .then(response => {
                    // dispatch new note into store
                    if (response.success) {
                        const newNote = {
                            id: response.data.id,
                            interaction_id: payload.interactionID,
                            content: payload.noteContent,
                            created_by: this.props.user.title + " " + this.props.user.label_name,
                            created_at: moment().format()
                        }
                        this.props.dispatch({
                            type: "LEAD.NOTE_SAVED",
                            data: newNote
                        })
                    }

                    // update local state to clear editing box
                    this.setState({
                        noteContent: "",
                        noteID: undefined,
                        noteBtnLabel: this.props.localization.buttonLabels.save,
                        isSaving: false,
                        isEditing: false
                    })
                })
        }
    }

    // user has clicked the edit button on a listed note
    onEdit = (noteID) => {
        console.log("editing? note: ", noteID)
        const selectedNote = this.props.lead.notes.find(note => note.id === noteID)
        if (selectedNote !== undefined) {
            this.setState({
                noteContent: selectedNote.content,
                noteID: selectedNote.id,
                noteBtnLabel: this.props.localization.buttonLabels.update,
                isEditing: true
            })
        }
    }

    // users has clicked button to cancel editing a selected note
    cancelUpdate = () => {
        if (!this.state.isSaving) {
            this.setState({
                noteContent: "",
                noteID: undefined,
                noteBtnLabel: this.props.localization.buttonLabels.save,
                isEditing: false
            })
        }
    }

    openDeleteModal = (noteID) => {
        this.setState({
            noteID: noteID,
            showDeleteModal: true
        })
    }

    closeModal = () => {
        this.setState({
            showDeleteModal: false,
            isSaving: false
        })
    }
    render() {
        if (this.props.active === true) {
            return (
                <MDBBox className="d-flex flex-1 flex-column overflow-auto">
                    <MDBBox
                        className="py-2 px-3 mb-3 rounded gray-border"
                        style={{backgroundColor: "transparent"}}
                    >
                    <textarea className="form-control"
                              style={{borderColor: "#dee2e6"}}
                              rows="5"
                              onChange={this.updateNoteContent}
                              onBlur={this.stoppedEditingContent}
                              value={this.state.noteContent}
                    />
                        <MDBBox>
                            {this.state.isEditing && (
                                <MDBBtn
                                    color="warning"
                                    className="float-left"
                                    disabled={this.state.isSaving}
                                    onClick={this.cancelUpdate}
                                >
                                    {this.props.localization.buttonLabels.cancel}
                                </MDBBtn>
                            )}
                            <MDBBtn
                                rounded
                                color="primary"
                                className="float-right"
                                disabled={this.state.isSaving}
                                onClick={this.saveNote}
                            >
                                {this.state.noteBtnLabel} {this.state.isSaving && (
                                <MDBIcon icon="cog" spin className="ml-1"/>
                            )}
                            </MDBBtn>
                        </MDBBox>
                    </MDBBox>

                    <MDBBox className="d-flex flex-column p-4 rounded grey lighten-2 overflow-auto"
                            style={{border: "1px solid #C2C2C2"}}>
                        {this.props.lead.notes && this.props.lead.notes.sort((a, b) => {
                            return (a.created_at > b.created_at ? -1 : 1)
                        }).map(note => {
                            return (<LeadNote key={note.id} note={note} onEdit={this.onEdit}
                                              deleteNote={this.openDeleteModal}/>)
                        })}
                    </MDBBox>

                    <MDBModal size="lg" isOpen={this.state.showDeleteModal} toggle={this.closeModal}>
                        <MDBModalHeader>{this.props.localization.notes.deleteNoteModalHeader}</MDBModalHeader>
                        <MDBModalBody>
                            <MDBRow className="p-2">
                                {this.props.localization.notes.deleteNoteModalBody}
                            </MDBRow>
                            <MDBModalFooter className="p-1"/>
                            <MDBRow>
                                <MDBCol size={"12"}>
                                    <MDBBtn
                                        color="warning"
                                        className="float-left"
                                        disabled={this.state.isSaving}
                                        onClick={this.closeModal}
                                    >
                                        {this.props.localization.buttonLabels.cancel}
                                    </MDBBtn>
                                    <MDBBtn
                                        color="danger"
                                        className="float-right"
                                        disabled={this.state.isSaving}
                                        onClick={this.deleteNote}
                                    >
                                        {this.props.localization.buttonLabels.delete}
                                    </MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </MDBModalBody>
                    </MDBModal>

                </MDBBox>
            )
        } else {
            return null
        }
    }
}
const mapStateToProps = store => {
    return {
        user: store.user,
        localization: store.localization,
        lead: store.lead,
        interaction: store.interaction
    }
}

export default connect(mapStateToProps)(LeadNotes);

