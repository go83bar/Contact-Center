import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBCard, MDBSelect,} from 'mdbreact'
import DocumentEdit from './DocumentEdit'
import {connect} from 'react-redux'
import DocumentAPI from "../../../api/documentAPI";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faFile,} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";
import {toast} from "react-toastify";

class LeadDocuments extends Component {

    constructor(props) {
        super(props);

        let newDocumentOptions = []

        if (this.props.shift.documents !== undefined) {
            this.props.shift.documents.filter(document => document.client_id === this.props.lead.client_id).forEach(document => {
                newDocumentOptions.push({
                    text: document.name,
                    value: "" + document.id
                })
            })
        }

        this.state = {
            createDisabled: true,
            selectedDocumentID: undefined,
            activeDocument: undefined,
            newDocumentOptions
        };
    }

    handleDocumentSelect = (values) => {
        const documentID = parseInt(values[0])

        this.setState({ selectedDocumentID: documentID, createDisabled: false })
    }

    onNewDocumentSelect = () => {
        this.setState({createDisabled: true})
        const documentID = this.state.selectedDocumentID
        const createParams = {
            documentID,
            leadID: this.props.lead.id,
            agentID: this.props.user.id
        }
        DocumentAPI.createInstance(createParams).then((response) => {
            if (response.success === "true") {
                let loadedDocument = response.data
                loadedDocument.documentID = documentID
                this.setState({activeDocument: loadedDocument})
            } else {
                toast.error(this.props.localization.toast.documents.createError)
                console.log("Create document load error: ", response)
            }
        }).catch(error => {
            toast.error(this.props.localization.toast.documents.createError)
            console.log("Could not create document: ", error)
        })
    }

    loadDocument = (documentInstanceID) => () => {
        this.setState({createDisabled: true})
        const loadParams = {
            documentInstanceID: documentInstanceID,
        }
        DocumentAPI.loadInstance(loadParams).then((response) => {
            console.log("Create response: ", response)
            if (response.success === "true") {
                // add instance ID to document data for later use
                let loadedDocument = response.data
                loadedDocument.documentInstanceID = documentInstanceID
                this.setState({activeDocument: loadedDocument})
            } else {
                toast.error(this.props.localization.toast.documents.loadError)
                console.log("Load document error: ", response)
            }
        }).catch(error => {
            toast.error(this.props.localization.toast.documents.loadError)
            console.log("Could not load document: ", error)
        })
    }

    closeDocument = () => {
        this.setState({activeDocument: undefined})
    }

    renderDocumentsList = () => {
        const items = this.props.lead.documents.map(document => {
            return (
                <MDBCard key={document.id} className="d-flex w-100 shadow-sm border-0 mb-2">
                    <MDBBox className="d-flex backgroundColorInherit skin-border-primary f-m w-100 pointer"
                            onClick={this.loadDocument(document.id)}
                    >
                        <div className='d-flex p-1 px-3 w-100'>
                            <span className="fa-layers fa-fw fa-3x mt-2">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                <FontAwesomeIcon icon={faFile} transform={"shrink-8"} className={"darkIcon"}/>
                            </span>
                            <div className="d-flex p-2 flex-column text-left w-75">
                                <span className="f-l">{document.name}</span>
                                <span className="font-weight-light">{document.created_by}</span>
                            </div>
                            <div className="d-flex flex-column f-s justify-content-start p-2 w-25 text-right">
                                {document.updated_at !== document.created_at && <span>
                                    {this.props.localization.interaction.documents.updatedAtLabel}
                                    <span className="font-weight-bold">
                                        {moment.utc(document.updated_at).tz(this.props.lead.details.timezone).format("MMM D")}
                                    </span>, {moment.utc(document.updated_at).tz(this.props.lead.details.timezone).format("h:mm a z")}
                                </span>}
                                <span>
                                    {this.props.localization.interaction.documents.createdAtLabel}
                                    <span className="font-weight-bold">
                                        {moment.utc(document.created_at).tz(this.props.lead.details.timezone).format("MMM D")}
                                    </span>, {moment.utc(document.created_at).tz(this.props.lead.details.timezone).format("h:mm a z")}
                                </span>
                            </div>
                        </div>
                    </MDBBox>
                </MDBCard>
            )
        })

        return (
            <MDBBox className='d-flex flex-column w-100 mb-3'>
                {items}
            </MDBBox>
        )
    }

    render() {
        return (
            <MDBBox className={this.props.active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}>
                {this.state.activeDocument &&
                <DocumentEdit document={this.state.activeDocument} closeDocument={this.closeDocument}/>}
                <div className="d-flex w-100 justify-content-end gray-border rounded">
                    <MDBSelect options={this.state.newDocumentOptions}
                               getValue={this.handleDocumentSelect}
                               label={this.props.localization.interaction.documents.documentsOptionsLabel}
                               className="w-75 mr-2"
                    />
                    <MDBBtn rounded
                            onClick={this.onNewDocumentSelect}
                            disabled={this.state.createDisabled}
                            style={{maxHeight: "50px"}}
                    >
                        {this.props.localization.interaction.documents.createNewButton}
                    </MDBBtn>
                </div>
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                        <span
                            className="f-l font-weight-bold m-2">{this.props.localization.interaction.documents.listTitle}</span>
                        {this.props.lead.documents && this.renderDocumentsList()}
                    </div>
                </MDBBox>
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        shift: state.shift,
        user: state.user
    }
}

export default connect(mapStateToProps)(LeadDocuments)