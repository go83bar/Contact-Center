import React, { Component } from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBInput,
    MDBSelect
} from "mdbreact"

import {connect} from "react-redux"
import {faTimes} from "@fortawesome/pro-solid-svg-icons"
import Draggable from 'react-draggable'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import MDBWysiwyg from 'mdb-react-wysiwyg'
import InteractionAPI from '../../../api/interactionAPI'
import moment from 'moment'

class EmailForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            hasTemplates: false,
            templateOptions: [],
            renderedTemplates: [],
            subjectValue: ""
        }

        // Load text templates for the lead
        InteractionAPI.fetchEmailTemplates({leadID: props.lead.id}).then( response => {
            if (response.success) {
                console.log(response)
                let hasTemplates = false
                let templateOptions = []
                let renderedTemplates = []
                // templates array from existing PHP api is treated as an object
                for (let [id, template] of Object.entries(response.templates)) {
                    hasTemplates = true
                    templateOptions.push({
                        value: id.toString(),
                        text: template.description
                    })
                    renderedTemplates.push(template)
                }

                this.setState({
                    hasTemplates: hasTemplates,
                    templateOptions: templateOptions,
                    renderedTemplates: renderedTemplates,
                    loaded: true
                })
            }
        }).catch( reason => {
            // TODO handle error
            console.log("Error fetching text templates: ", reason)
        })

        

    }

    updateSubject = (e) => {
        this.setState({ subjectValue: e.target.value})
    }

    chooseTemplate = (values) => {
        const chosenTemplate = this.state.renderedTemplates.find( template => template.id === parseInt(values[0]) ) 
        let editor = document.getElementsByClassName("mdb-wysiwyg-textarea")[0]
        if (editor !== undefined) {
            editor.innerHTML = chosenTemplate.content
        }
        this.setState({
            subjectValue: chosenTemplate.subject
        })
    }

    sendMessage = () => {
        const content = document.getElementsByClassName("mdb-wysiwyg-textarea")[0].innerHTML
        const params = {
            leadID: this.props.lead.id,
            interactionID: this.props.interaction.id,
            subject: this.state.subjectValue,
            body: content
        }

        console.log("PARAMS: ", params)

        InteractionAPI.sendEmailMessage(params).then( response => {
            if (response.success) {
                const sentAction = {
                    type: "LEAD.EMAIL_SENT",
                    data: {
                        id: response.log_email_id,
                        content: content,
                        direction: "outgoing",
                        interaction_id: this.props.interaction.id,
                        created_at: moment().utc().format("YYYY-MM-DD hh:mm:ss")
                    }
                }
                console.log("ACTION: ", sentAction)

                this.props.dispatch(sentAction)
                this.props.toggle()
            } else {
                // TODO handle error
                console.log("Error when sending email: ", response)
            }

        }).catch( reason => {
            // TODO handle error
            console.log("Error when sending email message: ", reason)
        })
    }

    render() {
        return(
            <Draggable handle={".card-header"}>
                <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"520px",right:8, top:70}}>
                    <MDBCardHeader className="skin-secondary-background-color skin-text">{this.props.localized.title}
                        <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.props.toggle}/>
                    </MDBCardHeader>
                    <MDBCardBody className="px-3 py-0">
                        {this.state.hasTemplates && <MDBSelect selected={this.props.localized.templatePlaceholder} options={this.state.templateOptions} getValue={this.chooseTemplate} label={this.props.localized.templateLabel}/>}
                        <MDBInput label={this.props.localized.subjectLabel} onChange={this.updateSubject} value={this.state.subjectValue} />
                        <MDBWysiwyg />
                    </MDBCardBody>
                    <MDBCardFooter className="d-flex justify-content-end">
                        <MDBBtn rounded outline onClick={this.props.toggle}>{this.props.localization.buttonLabels.cancel}</MDBBtn>
                        <MDBBtn rounded onClick={this.sendMessage}>{this.props.localization.buttonLabels.send}</MDBBtn>
                    </MDBCardFooter>
                </MDBCard>
            </Draggable>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        interaction: state.interaction,
        localization: state.localization,
        localized: state.localization.interaction.summary.emailForm,
        client: state.shift.clients[state.lead.client_index],
        lead : state.lead
    }
}

export default connect(mapStateToProps)(EmailForm);
