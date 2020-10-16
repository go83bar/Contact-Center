import React, {Component} from 'react'
import {MDBBox, MDBBtn} from 'mdbreact'
import {connect} from 'react-redux'
import DocumentAPI from "../../../api/documentAPI";
import {toast} from "react-toastify";
import TextQuestion from "./TextQuestion";
import RadioQuestion from "./RadioQuestion";
import DefaultQuestion from "./DefaultQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import Lead from "../../../utils/Lead";

class DocumentEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            responses: [],
            saveButtonDisabled: false
        };
    }

    updateAnswer = (questionableID, responseValue) => {
        let updatedExistingResponse = false

        // create mutable copy of existing state responses array
        let newResponses = this.state.responses.map( response => {
            if (response.id === questionableID) {
                // updating an existing response
                updatedExistingResponse = true
                response.value = responseValue
            }

            return response
        })
        // if we didn't update an existing response in the array, add a new one
        if (!updatedExistingResponse) {
            newResponses.push({
                id: questionableID,
                value: responseValue
            })
        }

        // set new array into state
        this.setState( {responses: newResponses})
    }

    saveDocument = () => {
        this.setState({saveButtonDisabled: true})

        // NOTE that the PHP save endpoint is expecting the entire form every time, so we pre-fill existing props responses into proper format
        let existingResponses = []
        for(const section of Object.values(this.props.document.sections)) {// this Object.values() technique is necessary due to PHP DTO format and should be refactored when we deprecate v3.0
            section.questions.forEach( question => {
                switch (question.type) {
                    case "text":
                        existingResponses.push({
                            id: question.questionableId,
                            value: question.value
                        })
                        break;
                    case "radio":
                        let setAnswer = ""
                        question.answers.forEach( answer => {
                            if (answer.selected) {
                                setAnswer = answer.answerableId
                            }
                        })
                        existingResponses.push({
                            id: question.questionableId,
                            value: setAnswer
                        })
                        break;
                    case "checkbox":
                        let answerIds = []
                        question.answers.forEach( answer => {
                            if (answer.selected) {
                                answerIds.push(answer.answerableId)
                            }
                        })

                        existingResponses.push({
                            id: question.questionableId,
                            value: answerIds
                        })
                        break;
                    default:
                        break
                }
            })
        }

        // and then merge in the changes present in the state responses
        const saveResponses = existingResponses.map( response => {
            const updatedResponse = this.state.responses.find( stateResponse => {
                return stateResponse.id === response.id
            })
            if (updatedResponse) {
                response.value = updatedResponse.value
            }

            return response
        })

        // build save payload
        const saveParams = {
            agentID: this.props.user.id,
            leadID: this.props.lead.id,
            documentID: this.props.document.documentID,
            responses: JSON.stringify(saveResponses),
            uses_json: "true"
        }

        // add instance ID if it's present
        if (this.props.document.documentInstanceID !== undefined) {
            saveParams.documentInstanceID = this.props.document.documentInstanceID
        }

        // persist new responses to backend
        DocumentAPI.saveDocument(saveParams).then( response => {
            // reload lead data, this is easier than manually adding changes to lead redux store
            Lead.loadLead(this.props.lead.id).then( response => {
                toast.success(this.props.localization.toast.documents.documentEdited)
                this.props.closeDocument()
            })
        }).catch( error => {
            toast.error(this.props.localization.toast.documents.editFailed)
            console.log("Save error: ", error)
        })
    }

    renderSections = () => {
        let sectionItems = []
        for(const [sectionID, section] of Object.entries(this.props.document.sections)) {// this Object.entries() technique is necessary due to PHP DTO format and should be refactored when we deprecate v3.0
            sectionItems.push(
                <MDBBox key={sectionID} className="d-flex flex-column w-100 mb-5">
                    <span className="f-l font-weight-bold">{section.title}</span>
                    {section.questions.map( question => {
                        switch(question.type) {
                            case "text":
                                return <TextQuestion key={question.questionableId} data={question} updateAnswer={this.updateAnswer} />
                            case "radio":
                                return <RadioQuestion key={question.questionableId} data={question} updateAnswer={this.updateAnswer} />
                            case "checkbox":
                                return <CheckboxQuestion key={question.questionableId} data={question} updateAnswer={this.updateAnswer} />
                            default:
                                return <DefaultQuestion key={question.questionableId} data={question} />
                        }
                    })}
                </MDBBox>
            )
        }

        return sectionItems
    }

    render() {
        return (
            <MDBBox className="w-100 p-3 m-0">
                <h3>{this.props.document.documentName}</h3>
                {this.renderSections()}
                <MDBBox className="d-flex justify-content-between">
                    <MDBBtn outline onClick={this.props.closeDocument}>Cancel</MDBBtn>
                    <MDBBtn onClick={this.saveDocument}>Save</MDBBtn>
                </MDBBox>
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        user: state.user
    }
}

export default connect(mapStateToProps)(DocumentEdit)





