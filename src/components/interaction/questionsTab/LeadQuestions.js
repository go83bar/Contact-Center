import React, {Component} from 'react'
import {connect} from "react-redux";
import {MDBBox, MDBBtn} from "mdbreact";
import {toast} from "react-toastify";
import ClientQuestion from "./ClientQuestion";
import LeadAPI from "../../../api/leadAPI";
import Slack from "../../../utils/Slack";


class LeadQuestions extends Component {

    constructor(props) {
        super(props)

        this.state = {
            saveDisabled: true,
            changedResponses: [],
            formattedQuestions: [],
            answerIDMap: []
        }
    }

    // combines client questions and lead responses into a nicely formatted data array
    // for the individual question components.  Also builds a convenience map of answer IDs
    buildDataArrays = () => {
        let answerIDMap = []
        const formattedQuestions = this.props.lead.client.questions.map(question => {
            // start with the basics
            let thisQuestion = {
                label: question.text,
                type: question.type,
                id: question.id
            }

            // the lead should have an entry for each question, whether there are responses or not
            const leadData = this.props.lead.client_responses.find(response => response.questionable_id === question.id)
            if (leadData !== undefined) {
                // if the question has answers, we can build them now and determine whether the lead has chosen each one
                if (question.answers !== undefined) {
                    let thisQuestionAnswers = []
                    question.answers.forEach(answer => {
                        answerIDMap.push({
                            answerable_id: answer.id,
                            answer_id: answer.answer_id,
                        })

                        thisQuestionAnswers.push({
                            answerable_id: answer.id,
                            answer_id: answer.answer_id,
                            text: answer.text,
                            selected: leadData.answer_id.includes(answer.answer_id)
                        })
                    })
                    thisQuestion.answers = thisQuestionAnswers
                } else {
                    // otherwise we look for a text response in the lead data
                    thisQuestion.answer = leadData.answer
                }
            }

            return thisQuestion
        })

        this.setState({formattedQuestions, answerIDMap})

    }

    componentDidMount() {
        // when component is first loaded, we build the data arrays of initial lead data
        this.buildDataArrays()
    }

    // this function handles the updates from the individual question components
    // we only want to send updated fields to the backend, and NOT send fields that the user changed but then changed back
    handleFieldUpdate = (questionableID, newValue) => {
        // find this questionable in redux lead data
        const existingQuestionableResponse = this.props.lead.client_responses.find(question => question.questionable_id === questionableID)
        if (existingQuestionableResponse === undefined) {
            toast.error(this.props.localization.toast.questions.missingQuestionError)
            return
        }

        // we need to either set the response into changedResponses, or remove it if the newValue is the original lead data value
        // what we compare and what we set into the array depends on whether the question uses answerables or not
        let newResponses = []
        if (Array.isArray(newValue)) {
            // this question uses answerables, newValue should contain an array of answer_ids
            const newChangedResponse = {
                questionable_id: questionableID,
                answers: this.state.answerIDMap.filter(answerMap => newValue.includes(answerMap.answerable_id.toString()))
            }
            // if this questionable is not already in changedResponses, just add it
            if (this.state.changedResponses.find(response => response.questionable_id === questionableID) === undefined) {
                newResponses = [...this.state.changedResponses, newChangedResponse]
            } else {
                // it's already in there, we need to either update or remove it
                // first we need to convert the answer_ids in the lead data to answerable_ids using convenience map from earlier
                const existingAnswerableIDs = existingQuestionableResponse.answer_id.map(answerID => this.state.answerIDMap.find(answer => answer.answer_id === answerID).answerable_id)

                // then check to see if every item from existing answer is in new answer, and vice versa (could be in different order)
                const containsAll = (arr1, arr2) =>
                    arr2.every(arr2Item => arr1.includes(arr2Item))
                if (containsAll(newValue, existingAnswerableIDs) && containsAll(existingAnswerableIDs, newValue)) {
                    // the new value matches the original lead data value, remove this questionable from changedResponses
                    newResponses = this.state.changedResponses.filter(response => response.questionable_id !== questionableID)
                } else {
                    // the new value is an update of the existing value
                    newResponses = this.state.changedResponses.map(existingChangedResponse => {
                        return existingChangedResponse.questionable_id === questionableID ? newChangedResponse : existingChangedResponse
                    })
                }
            }

        } else {
            // this is a text field, newValue should contain the string of the new answer
            const newChangedResponse = {
                questionable_id: questionableID,
                answer: newValue
            }
            // if this questionable is not already in changedResponses, just add it
            if (this.state.changedResponses.find(response => response.questionable_id === questionableID) === undefined) {
                newResponses = [...this.state.changedResponses, newChangedResponse]
            } else {
                // it's already in there, we need to either update or remove it
                if (newValue === existingQuestionableResponse.answer) {
                    newResponses = this.state.changedResponses.filter(response => response.questionable_id !== questionableID)
                } else {
                    newResponses = this.state.changedResponses.map(response => {
                        return response.questionable_id === questionableID ? newChangedResponse : response
                    })
                }
            }
        }

        // should save be enabled?
        const saveDisabled = newResponses.length === 0

        // set new values into state
        this.setState( {changedResponses: newResponses, saveDisabled})
    }

    handleSubmit = () => {
        this.setState({saveDisabled: true})

        // validate that we have changed responses to save
        if (this.state.changedResponses.length === 0) {
            toast.error(this.props.localization.toast.questions.noChangesError)
            return
        }

        // build payload
        const params = {
            lead_id: this.props.lead.id,
            interaction_id: this.props.interaction.id,
            questions: this.state.changedResponses
        }

        // persist to backend
        LeadAPI.saveClientResponses(params).then(response => {
            if (response.success) {
                toast.success(this.props.localization.toast.questions.responsesUpdated)

                // set changed responses into redux lead data
                const savedAction = {
                    type: "LEAD.CLIENT_RESPONSES.UPDATED",
                    data: {
                        changedResponses: this.state.changedResponses
                    }
                }
                this.props.dispatch(savedAction)

                // reset data arrays
                this.buildDataArrays()

                // reset state
                this.setState({changedResponses: [], saveDisabled: true})

            } else {
                toast.error(this.props.localization.toast.questions.genericSaveError)
                Slack.sendMessage(`Agent ${this.props.user.id} got an error response saving client responses for lead ${this.props.lead.id}: ${JSON.stringify(response)}`)
                console.log("Error response when trying to save responses: ", response)
            }
        }).catch(error => {
            toast.error(this.props.localization.toast.questions.genericSaveError)
            Slack.sendMessage(`Agent ${this.props.user.id} got an exception saving client responses for lead ${this.props.lead.id}: ${JSON.stringify(error)}`)
            console.log("Could not save responses: ", error)
        })

    }

    renderQuestionsList = () => {
        return this.state.formattedQuestions.map(question => {
            return (
                <ClientQuestion key={question.id} question={question} changeHandler={this.handleFieldUpdate} />
            )
        })
    }

    render() {
        return (
            <MDBBox className={this.props.active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}>
                <div className="f-l font-weight-bold m-2">{this.props.localization.interaction.questions.listTitle}</div>
                <div className='d-flex w-100 flex-wrap m-2'>
                    {this.props.lead.client_responses && this.renderQuestionsList()}
                </div>
                {this.props.lead.client_responses && <div className="d-flex flex-row justify-content-end">
                    <MDBBtn rounded disabled={this.state.saveDisabled} onClick={this.handleSubmit}>{this.props.localization.buttonLabels.save}</MDBBtn>
                </div>}

            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        interaction: state.interaction,
        user: state.user
    }
}

export default connect(mapStateToProps)(LeadQuestions);
