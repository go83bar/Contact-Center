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
import InteractionAPI from '../../../api/interactionAPI'
import moment from 'moment'

class TextForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            hasTemplates: false,
            templateOptions: [],
            renderedTemplates: [],
            contentValue: "",
            counterClass: "text-muted"
        }

        // Load text templates for the lead
        InteractionAPI.fetchTextTemplates({leadID: props.lead.id}).then( response => {
            if (response.success) {
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

    updateContent = (e) => {
        let newCounterClass = "text-muted"
        const intValue = parseInt(e.target.value.length)

        if (intValue > 150) {
            newCounterClass = "text-warning"
        }

        if (intValue > 160) {
            newCounterClass = "text-danger"
        }

        this.setState({
            contentValue: e.target.value,
            counterClass: newCounterClass
        })

    }
    chooseTemplate = (values) => {
        const chosenTemplate = this.state.renderedTemplates.find( template => template.id === parseInt(values[0]) )
        this.setState({
            contentValue: chosenTemplate.content
        })
    }

    sendMessage = () => {
        const params = {
            leadID: this.props.lead.id,
            interactionID: this.props.interaction.id,
            body: this.state.contentValue
        }

        InteractionAPI.sendTextMessage(params).then( response => {
            const sentAction = {
                type: "LEAD.TEXT_SENT",
                data: {
                    id: response.log_text_id,
                    content: this.state.contentValue,
                    direction: "outgoing",
                    interaction_id: this.props.interaction.id,
                    automated: false,
                    created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss")
                }
            }
            this.props.dispatch(sentAction)
            this.props.toggle()

        }).catch( reason => {
            // TODO handle error
            console.log("Error when sending text message: ", reason)
        })
    }

    render() {
        if (this.state.loaded) {
            return(
                <Draggable handle={".card-header"}>

                    <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"370px",right:8, top:370}}>
                        <MDBCardHeader className="skin-secondary-background-color skin-text">{this.props.localized.title}
                            <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.props.toggle}/>
                        </MDBCardHeader>
                        <MDBCardBody className="px-3 py-0">
                            { this.state.hasTemplates && <MDBSelect selected={this.props.localized.templatePlaceholder} options={this.state.templateOptions} getValue={this.chooseTemplate} label={this.props.localized.templateLabel}/> }
                            <div className="md-form">
                                <textarea className="md-textarea form-control" rows="3" onChange={this.updateContent} placeholder={this.props.localized.contentPlaceholder} value={this.state.contentValue}></textarea>
                            </div>
                            <div className="float-right">
                                <span className={this.state.counterClass} style={ {fontSize: "small"}}>{this.props.localized.charCountLabel}: {this.state.contentValue.length}</span>
                            </div>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-between">
                            <MDBBtn outline rounded onClick={this.props.toggle}>{this.props.localization.buttonLabels.cancel}</MDBBtn>
                            <MDBBtn rounded onClick={this.sendMessage}>{this.props.localization.buttonLabels.send}</MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
                </Draggable>
            )
        } else return null
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        interaction: state.interaction,
        localization: state.localization,
        localized: state.localization.interaction.summary.textForm,
        lead : state.lead,
        client: state.shift.clients[state.lead.client_index]
    }
}

export default connect(mapStateToProps)(TextForm);
