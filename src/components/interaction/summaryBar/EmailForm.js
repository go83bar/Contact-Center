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
import {toast} from "react-toastify";
import Slack from '../../../utils/Slack';
import {Editor} from "@tinymce/tinymce-react";

class EmailForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            disableSave: true,
            hasTemplates: false,
            templateOptions: [],
            renderedTemplates: [],
            subjectValue: "",
            contentValue: ""
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

    componentDidMount() {
        // we need to manually add an EventListener function onto the WYSIWYG component textarea
        // because it doesn't come with any built-in methods
        const emailContentEditor = document.getElementsByClassName("mdb-wysiwyg-textarea")[0]
        if (emailContentEditor !== undefined) {
            emailContentEditor.addEventListener("input", (evt) => {
                let disableSave = true
                if (evt.target.textContent.length > 0 && this.state.subjectValue.length > 0) {
                    disableSave = false
                }
                this.setState( {
                    contentValue: evt.target.textContent,
                    disableSave
                })
            })
        }
    }

    updateSubject = (e) => {
        let disableSave = true;
        if (this.state.contentValue.length > 0 && e.target.value.length > 0) disableSave = false;
        this.setState({ subjectValue: e.target.value, disableSave})
    }

    chooseTemplate = (values) => {
        const chosenTemplate = this.state.renderedTemplates.find( template => template.id === parseInt(values[0]) )
        let editor = document.getElementsByClassName("mdb-wysiwyg-textarea")[0]
        if (editor !== undefined) {
            editor.innerHTML = chosenTemplate.content
        }
        this.setState({
            subjectValue: chosenTemplate.subject,
            disableSave: false
        })
    }

    sendMessage = () => {
        if (this.state.subjectValue === "" || this.state.contentValue === "") {
            toast.error("Subject and Content must be filled to send email")
            this.setState({
                disableSave: true
            })
        }

        const params = {
            leadID: this.props.lead.id,
            interactionID: this.props.interaction.id,
            subject: this.state.subjectValue,
            body: this.state.contentValue
        }

        console.log("PARAMS: ", params)

        InteractionAPI.sendEmailMessage(params).then( response => {
            if (response.success) {
                const sentAction = {
                    type: "LEAD.EMAIL_SENT",
                    data: {
                        id: response.log_email_id,
                        content: this.state.contentValue,
                        direction: "outgoing",
                        interaction_id: this.props.interaction.id,
                        created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss")
                    }
                }

                this.props.dispatch(sentAction)
                this.props.toggle()
            } else {
                toast.error("There was an error. Email not sent.")
                Slack.sendMessage("Agent " + this.props.user.id + " got success=false when sending manual email to lead " + this.props.lead.id)
            }

        }).catch( reason => {
            toast.error("There was an error. Email not sent.")
            Slack.sendMessage("Agent " + this.props.user.id + " got a 500 when sending manual email to lead " + this.props.lead.id + ": " + reason)
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
                        <MDBSelect selected={this.props.localized.templatePlaceholder} options={this.state.templateOptions} getValue={this.chooseTemplate} label={this.props.localized.templateLabel}/>
                        <MDBInput label={this.props.localized.subjectLabel} onChange={this.updateSubject} value={this.state.subjectValue} />

                    </MDBCardBody>
                    <MDBCardFooter className="d-flex justify-content-between">
                        <MDBBtn rounded outline onClick={this.props.toggle}>{this.props.localization.buttonLabels.cancel}</MDBBtn>
                        <MDBBtn rounded disabled={this.state.disableSave} onClick={this.sendMessage}>{this.props.localization.buttonLabels.send}</MDBBtn>
                    </MDBCardFooter>
                </MDBCard>
            </Draggable>
        )
    }
}

const mapStateToProps = state => {
    return {
        interaction: state.interaction,
        localization: state.localization,
        localized: state.localization.interaction.summary.emailForm,
        lead : state.lead,
        user: state.user
    }
}

export default connect(mapStateToProps)(EmailForm);
