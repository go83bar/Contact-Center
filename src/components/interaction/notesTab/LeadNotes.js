import React, {Component} from 'react'
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
import {connect} from "react-redux"
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
            disableSave: true,
            createNote: false
        }

    }

    // user has changed the content of the note edit textarea
    updateNoteContent = (event) => {
        this.setState({
            noteContent: event.target.value,
            disableSave: false
        })
    }

    // called when user clicks away from note content field after editing
    // used to trip alert when ending interaction if there is unsaved note content
    stoppedEditingContent = (event) => {
        if (event.target.value === "" && this.props.interaction.hasUnsavedNote) {
            this.props.dispatch({type: "INTERACTION.CLEAR_UNSAVED_NOTE"})
            return
        }

        if (event.target.value !== "" && !this.props.interaction.hasUnsavedNote) {
            this.props.dispatch({type: "INTERACTION.FLAG_UNSAVED_NOTE"})
            return
        }
    }

    // user has add note button
    createNote = () => {
        this.setState({createNote: !this.state.createNote})
    }


    // user has delete button with a note
    deleteNote = () => {

        this.setState({
            disableSave: true
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
        }).catch( error => {
            console.log("Note could not be deleted: ", error)
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
                        noteContent: "",
                        noteID: undefined,
                        noteBtnLabel: this.props.localization.buttonLabels.save,
                        isEditing: false,
                        createNote: false
                    })
                }).catch((reason) => {
                // TODO handle error
                console.log("Error saving note: ", reason)
            })
        } else {
            // this a new note to save
            const payload = {
                noteContent: this.state.noteContent,
                interactionID: this.props.interaction.id
            }

            this.setState({
                disableSave: true
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
                            created_at: moment.utc().format()
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
                        isEditing: false,
                        createNote: false
                    })
                }).catch((reason) => {
                // TODO handle error
                console.log("Error saving note: ", reason)
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
    cancelAdd = () => {
        if (!this.state.isSaving) {
            if (this.props.interaction.hasUnsavedNote) {
                this.props.dispatch({type: "INTERACTION.CLEAR_UNSAVED_NOTE"})
            }

            this.setState({
                noteContent: "",
                noteID: undefined,
                createNote : false,
                isEditing: false
            })
        }
    }

    // users has clicked button to cancel editing a selected note
    cancelUpdate = () => {
        if (!this.state.isSaving) {
            if (this.props.interaction.hasUnsavedNote) {
                this.props.dispatch({type: "INTERACTION.CLEAR_UNSAVED_NOTE"})
            }
            
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
                        className="mb-2 rounded gray-border"
                        style={{backgroundColor: "transparent"}}
                    >
                        {!this.state.createNote && <MDBBtn
                            rounded
                            color="primary"
                            className="float-left shadow-sm"
                            onClick={this.createNote}
                        >
                            {this.props.localization.interaction.notes.createNote}

                        </MDBBtn>}
                        {this.state.createNote && <MDBBox className="d-flex flex-column p-2">
                            <MDBBox
                                className="font-weight-bold">{this.props.localization.interaction.notes.createNote}</MDBBox>
                            <textarea className="form-control"
                                      style={{borderColor: "#dee2e6"}}
                                      rows="5"
                                      onChange={this.updateNoteContent}
                                      onBlur={this.stoppedEditingContent}
                                      value={this.state.noteContent}
                            />
                            <MDBBox>
                                <MDBBtn
                                    color="primary"
                                    rounded
                                    outline
                                    className="float-left"
                                    onClick={this.cancelAdd}
                                >
                                    {this.props.localization.buttonLabels.cancel}
                                </MDBBtn>
                                <MDBBtn
                                    rounded
                                    color="primary"
                                    className="float-right"
                                    disabled={this.state.disableSave}
                                    onClick={this.saveNote}
                                >
                                    {this.state.noteBtnLabel} {this.state.isSaving && (
                                    <MDBIcon icon="cog" spin className="ml-1"/>
                                )}
                                </MDBBtn>
                            </MDBBox>
                        </MDBBox>
                        }
                    </MDBBox>

                    <MDBBox className="d-flex flex-column p-1 px-3 rounded gray-border gray-background overflow-auto">
                        <span className="f-l font-weight-bold m-2">{this.props.localization.interaction.notes.tabTitle}</span>
                        {this.props.lead.notes && this.props.lead.notes.sort((a, b) => {
                            return (a.created_at > b.created_at ? -1 : 1)
                        }).map(note => {
                            return (<LeadNote key={note.id} note={note} onBlur={this.stoppedEditingContent}
                                              deleteNote={this.openDeleteModal}/>)
                        })}
                    </MDBBox>

                    <MDBModal size="lg" isOpen={this.state.showDeleteModal} toggle={this.closeModal}>
                        <MDBModalHeader>{this.props.localization.interaction.notes.deleteNoteModalHeader}</MDBModalHeader>
                        <MDBModalBody>
                            <MDBRow className="p-2">
                                {this.props.localization.interaction.notes.deleteNoteModalBody}
                            </MDBRow>
                            <MDBModalFooter className="p-1"/>
                            <MDBRow>
                                <MDBCol size={"12"}>
                                    <MDBBtn
                                        color="primary"
                                        rounded
                                        outline
                                        className="float-left"
                                        disabled={this.state.isSaving}
                                        onClick={this.closeModal}
                                    >
                                        {this.props.localization.buttonLabels.cancel}
                                    </MDBBtn>
                                    <MDBBtn
                                        color="primary"
                                        rounded
                                        className="float-right"
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

