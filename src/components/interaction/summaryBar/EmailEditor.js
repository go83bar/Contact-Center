import React, {useEffect, useRef, useState} from 'react'
import {Editor} from "@tinymce/tinymce-react"
import Draggable from 'react-draggable'
import {MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBInput, MDBSelect, MDBSpinner} from "mdbreact"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTimes} from "@fortawesome/pro-solid-svg-icons"
import {useDispatch, useSelector} from "react-redux"
import InteractionAPI from "../../../api/interactionAPI";
import LoadingScreen from "../../LoadingScreen";
import {toast} from "react-toastify";
import moment from "moment";
import Slack from "../../../utils/Slack";

const localization = (state) => {
    const lang = state.localization
    return {
        title: lang.interaction.summary.emailForm.title,
        saveButton: lang.buttonLabels.send,
        cancelButton: lang.buttonLabels.cancel,
        templateLabel: lang.interaction.summary.emailForm.templateLabel,
        subjectLabel: lang.interaction.summary.emailForm.subjectLabel,
        templatePlaceholder: lang.interaction.summary.emailForm.templatePlaceholder,
        loadError: lang.toast.leadSummary.templateLoadError,
        emptyError: lang.toast.leadSummary.templateValidationError,
        notSentError: lang.toast.leadSummary.notSentError,
        optedOutError: lang.toast.leadSummary.optedOutError,
        invalidRecipientError: lang.toast.leadSummary.invalidRecipientError
    }
}

const EmailEditor = ({toggle}) => {
    const editorRef = useRef(null)
    const [saveDisabled, setSaveDisabled] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [renderedTemplates, setRenderedTemplates] = useState({})
    const [templateOptions, setTemplateOptions] = useState({})
    const lang = useSelector(localization)
    const [subject, setSubject] = useState("")
    const leadID = useSelector(state => state.lead.id)
    const interactionID = useSelector(state => state.interaction.id)
    const userID = useSelector(state => state.user.id)
    const dispatch = useDispatch()

    useEffect(() => {
        // Load any rendered agent templates for the lead
        InteractionAPI.fetchEmailTemplates({leadID}).then( response => {
            if (response.success) {
                let templateOptions = []
                let renderedTemplates = []
                for (let [id, template] of Object.entries(response.templates)) {
                    templateOptions.push({
                        value: id.toString(),
                        text: template.description
                    })
                    renderedTemplates.push(template)
                }
                setIsLoaded(true)
                setRenderedTemplates(renderedTemplates)
                setTemplateOptions(templateOptions)

            }
        }).catch( reason => {
            toast.error(lang.loadError)
            console.log("Error fetching email templates: ", reason)
        })

    }, [leadID, lang.loadError])

    const updateSubject = (evt) => {
        setSubject(evt.target.value)
    }

    const chooseTemplate = (values) => {
        // sanity check
        if (isNaN(parseInt(values[0]))) {
            console.log("Received unparsable template ID: ", values[0])
            toast.error("Template could not be used.")
            return
        }

        const chosenTemplate = renderedTemplates.find( template => template.id === parseInt(values[0]) )
        editorRef.current.setContent(chosenTemplate.content)

        setSubject(chosenTemplate.subject)
    }

    const sendMessage = () => {
        // first check for empty values as we aren't disabling on page load here
        let currentContent = editorRef.current.getContent()
        if (subject === "" || currentContent === "") {
            toast.error(lang.emptyError)
            return
        }

        // build payload and send to API to trigger email send
        setSaveDisabled(true)
        const params = {
            leadID,
            interactionID,
            subject,
            body: currentContent
        }

        InteractionAPI.sendEmailMessage(params).then( response => {
            if (response.success) {
                // email was sent, add to lead data for timeline
                const sentAction = {
                    type: "LEAD.EMAIL_SENT",
                    data: {
                        id: response.log_email_id,
                        content: currentContent,
                        subject,
                        direction: "outgoing",
                        interaction_id: interactionID,
                        created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss")
                    }
                }

                dispatch(sentAction)
                toggle()
            } else {
                // there's a few possible errors to handle
                switch (response.message) {
                    case "optout":
                        toast.error(lang.optedOutError)
                        break;

                    case "invalidemail":
                        toast.error(lang.invalidRecipientError)
                        break;

                    default:
                        toast.error(lang.notSentError)
                        Slack.sendMessage("Agent " + userID + " got error message " + response.message + " when sending manual email to lead " + leadID)
                }
                setSaveDisabled(false)

            }
        }).catch( reason => {
            // http error or the backend is down
            toast.error(lang.notSentError)
            Slack.sendMessage("Agent " + userID + " got a 500 when sending manual email to lead " + leadID + ": " + reason)
            setSaveDisabled(false)
        })
    }

    if (!isLoaded) {
        return (
            <Draggable handle={".card-header"}>
                <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"520px",right:8, top:70}}>
                    <LoadingScreen />
                </MDBCard>
            </Draggable>
        )
    }


    return (
        <Draggable handle={".card-header"}>
            <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"520px",right:8, top:70}}>

                <MDBCardHeader className="skin-secondary-background-color skin-text">{lang.title}
                    <FontAwesomeIcon icon={faTimes} className="float-right" onClick={toggle}/>
                </MDBCardHeader>

                <MDBCardBody className="px-3 py-0">
                    {templateOptions.length > 0 && <MDBSelect selected={lang.templatePlaceholder} options={templateOptions} getValue={chooseTemplate} label={lang.templateLabel}/>}
                    <MDBInput label={lang.subjectLabel} onChange={updateSubject} value={subject} />

                    <Editor onInit={(evt, editor) => {editorRef.current = editor}}
                            className={"mt-2"}
                            initialValue=""
                            init={{
                                height: 500,
                                menubar: false,
                                toolbar: 'bold italic underline',
                                branding: false
                            }}
                    />
                </MDBCardBody>

                <MDBCardFooter className="d-flex justify-content-between">
                    <MDBBtn rounded onClick={toggle}>{lang.cancelButton}</MDBBtn>
                    <MDBBtn rounded disabled={saveDisabled} onClick={sendMessage}>{lang.saveButton} {saveDisabled && <MDBSpinner />}</MDBBtn>
                </MDBCardFooter>
            </MDBCard>
        </Draggable>
    )
}

export default EmailEditor