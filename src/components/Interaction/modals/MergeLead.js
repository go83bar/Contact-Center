import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader} from 'mdbreact'
import {connect} from "react-redux"
import LeadAPI from "../../../api/leadAPI"
import leadAPI from "../../../api/leadAPI"
import String from "../../../utils/String"
import {toast} from "react-toastify";
import twilioAPI from "../../../api/twilioAPI";
import Lead from "../../../utils/Lead";
import Slack from "../../../utils/Slack";

class MergeLead extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchDisabled: false,
            noResultsError: false,
            search: {
                firstNameValue: "",
                lastNameValue: "",
                emailValue: "",
                phoneValue: "",
                leadIDValue: ""
            },
            searchResults: [],
            cellPhoneOptions: [],
            homePhoneOptions: [],
            targetLead: undefined,
            mergeWriteFields: {
                first_name: "",
                last_name: "",
                email: "",
                cell_phone: "",
                home_phone: "",
                address_1: "",
                city: "",
                state: "",
                zip: ""
            }
        };
    }

    updateSearchForm = (evt) => {
        let newSearch = this.state.search
        newSearch[evt.target.name] = evt.target.value
        this.setState({search: newSearch})
    }

    search = () => {
        this.setState({searchDisabled: true, noResultsError: false})

        // setup search params object
        const payload = {
            id: this.state.search.leadIDValue,
            first_name: this.state.search.firstNameValue,
            last_name: this.state.search.lastNameValue,
            phone: this.state.search.phoneValue,
            email: this.state.search.emailValue,
            client_id: this.props.lead.client_id
        }

        // perform search
        LeadAPI.moduleSearch(payload)
            .then((response) => {
                let newStateOptions = {
                    searchDisabled: false
                }

                // put any results into new state object, or set noResultsError flag
                if (response.data.length === 0) {
                    newStateOptions.noResultsError = true
                    newStateOptions.searchResults = []
                } else {
                    newStateOptions.searchResults = response.data
                }

                this.setState(newStateOptions)

            }).catch((reason) => {
            console.log(reason)
        })
    }

    selectTarget = (leadID) => {
        const selectedResult = this.state.searchResults.find(result => result.id === leadID)
        if (selectedResult !== undefined) {
            const phoneNumbers = [
                selectedResult.cell_phone,
                selectedResult.home_phone,
                this.props.lead.details.cell_phone,
                this.props.lead.details.home_phone,
            ]

            const cellPhoneOptions = phoneNumbers.filter(number => number !== null)
                .map(number => {
                    return {
                        text: String.formatPhoneNumber(number),
                        value: number,
                        checked: number === selectedResult.cell_phone
                    }
                })

            const homePhoneOptions = phoneNumbers.filter(number => number !== null)
                .map(number => {
                    return {
                        text: String.formatPhoneNumber(number),
                        value: number,
                        checked: number === selectedResult.home_phone
                    }
                })

            const fieldData = {
                first_name: selectedResult.first_name,
                last_name: selectedResult.last_name,
                email: selectedResult.email,
                cell_phone: selectedResult.cell_phone,
                home_phone: selectedResult.home_phone,
                address_1: selectedResult.address_1,
                city: selectedResult.city,
                state: selectedResult.state,
                zip: selectedResult.zip
            }
            this.setState({
                targetLead: {...fieldData, id: selectedResult.id},
                mergeWriteFields: {...fieldData},
                cellPhoneOptions,
                homePhoneOptions
            })
        } else {
            toast.error(this.props.localization.toast.mergeLead.leadLoadError)
        }
    }

    setMergeUpdateField = (field, newValue) => () => {
        if (this.state.mergeWriteFields[field] !== newValue) {
            let newMergeFields = {...this.state.mergeWriteFields}
            newMergeFields[field] = newValue
            this.setState({mergeWriteFields: newMergeFields})
        }
    }

    merge = () => {
        this.setState({mergeDisabled: true})
        // first we call the PHP backend to merge all the lead data
        const leadMergeParams = {
            targetLeadID: this.state.targetLead.id,
            sourceLeadID: this.props.lead.id,
            interactionID: this.props.interaction.id,
            mergeFields: this.state.mergeWriteFields
        }

        leadAPI.mergeLead(leadMergeParams).then(response => {
            if (response.success === true) {
                // now we must also swap out the lead ID on the mongo conference if there is an ongoing call
                if (this.props.twilio.conferenceOID !== "") {
                    twilioAPI.replaceMergedLead(leadMergeParams.targetLeadID, this.props.twilio.conferenceOID)
                        .then(response => {
                            console.log("Mongo conference record updated: ", response)
                        })
                }

                // in any case we can trigger a lead refresh and close this modal when it's loaded
                Lead.loadLead(leadMergeParams.targetLeadID).then(response => {
                    this.props.closeModal()
                })

            }
        }).catch(error => {
            // backend error
            Slack.sendMessage(`Agent ${this.props.user.id} tried to merge lead ${this.props.lead.id} into lead ${this.state.targetLead.id} but got error: ${error.toString()}`)
            toast.error(this.props.localization.toast.mergeLead.leadMergeError)
            this.props.closeModal()
        })

    }

    renderResults = () => {
        const localization = this.props.localization.interaction.summary.mergeLead
        return this.state.searchResults.filter(result => result.id !== this.props.lead.id).map(result => {
            // highlight matched properties
            let firstNameClass, lastNameClass, cellPhoneClass, emailClass = ""
            if (String.formatPhoneNumber(this.state.search.phoneValue) === String.formatPhoneNumber(result.cell_phone)) {
                cellPhoneClass = "font-weight-bold"
            }
            if (this.state.search.firstNameValue.trim().toLowerCase() === result.first_name.trim().toLowerCase()) {
                firstNameClass = "font-weight-bold"
            }
            if (this.state.search.lastNameValue.trim().toLowerCase() === result.last_name.trim().toLowerCase()) {
                lastNameClass = "font-weight-bold"
            }
            if (this.state.search.emailValue.trim().toLowerCase() === result.email.trim().toLowerCase()) {
                emailClass = "font-weight-bold"
            }
            return (<MDBBox className="mb-2 p-4 border skin-border-primary" key={result.id}>
                <h4><span className={firstNameClass}>{result.first_name}</span> <span
                    className={lastNameClass}>{result.last_name}</span></h4>
                <MDBBox className="w-100">{localization.leadID}: {result.id}</MDBBox>
                <MDBBox className="d-flex flex-row w-100">
                    {result.cell_phone !== null && <MDBBox className="w-50 pr-2">
                        {localization.cell_phone}: <span
                        className={cellPhoneClass}>{String.formatPhoneNumber(result.cell_phone)}</span>
                    </MDBBox>}
                    {result.home_phone !== null && <MDBBox className="w-50 pr-2">
                        {localization.home_phone}: <span>{String.formatPhoneNumber(result.home_phone)}</span>
                    </MDBBox>}
                </MDBBox>
                <MDBBox className="d-flex flex-row w-100">
                    <MDBBox className="d-flex flex-column w-75">
                        {result.email !== null && <MDBBox>
                            {localization.email}: <span className={emailClass}>{result.email}</span>
                        </MDBBox>}
                        <MDBBox>
                            {localization.region}: {result.region_name}
                        </MDBBox>
                    </MDBBox>
                    <MDBBox className="d-flex justify-content-end align-self-end w-25">
                        <MDBBtn rounded color="primary"
                                onClick={() => this.selectTarget(result.id)}>{localization.selectButton}</MDBBtn>
                    </MDBBox>
                </MDBBox>
            </MDBBox>)
        })
    }

    renderMergeFields = () => {
        const fields = ["first_name", "last_name", "email", "cell_phone", "home_phone", "address_1", "city", "state", "zip"]
        const localization = this.props.localization.interaction.summary.mergeLead

        return fields.map(field => {
            // standardize the various ways these values could be "empty"
            let targetValue = this.state.targetLead[field]
            if (targetValue === undefined || targetValue === "") {
                targetValue = null
            }
            let sourceValue = this.props.lead.details[field]
            if (sourceValue === undefined || sourceValue === "") {
                sourceValue = null
            }
            let mergeValue = this.state.mergeWriteFields[field]
            if (mergeValue === undefined || mergeValue === "") {
                mergeValue = null
            }

            if (targetValue === sourceValue) {
                // fields that have the same values in both leads don't need to be displayed
                return ""
            } else if (field === "cell_phone" || field === "home_phone") {
                // phone fields have a couple radio choices each
                return (
                    <MDBBox key={field} className="d-flex flex-column w-100 pb-4">
                        <MDBBox className="w-100">
                            <div className="w-100">{localization[field]}</div>
                        </MDBBox>
                        <MDBBox className="d-flex flex-row w-100">
                            <MDBBox className="border p-4 mr-2 w-50">
                                {this.state.targetLead.cell_phone !== null &&
                                <span onClick={this.setMergeUpdateField(field, this.state.targetLead.cell_phone)}>
                                    <MDBInput
                                        gap
                                        type="radio"
                                        label={String.formatPhoneNumber(this.state.targetLead.cell_phone) + localization.cellSpecLabel}
                                        checked={mergeValue === this.state.targetLead.cell_phone}
                                    />
                                </span>}
                                {this.state.targetLead.home_phone !== null &&
                                <span onClick={this.setMergeUpdateField(field, this.state.targetLead.home_phone)}>
                                    <MDBInput
                                        gap
                                        type="radio"
                                        label={String.formatPhoneNumber(this.state.targetLead.home_phone) + localization.homeSpecLabel}
                                        checked={mergeValue === this.state.targetLead.home_phone}
                                    />
                                </span>}
                            </MDBBox>
                            <MDBBox className="border p-4 ml-2 w-50">
                                {this.props.lead.details.cell_phone !== null &&
                                <span onClick={this.setMergeUpdateField(field, this.props.lead.details.cell_phone)}>
                                    <MDBInput
                                        gap
                                        type="radio"
                                        label={String.formatPhoneNumber(this.props.lead.details.cell_phone) + localization.cellSpecLabel}
                                        checked={mergeValue === this.props.lead.details.cell_phone}
                                    />
                                </span>}
                                {this.props.lead.details.home_phone !== null &&
                                <span onClick={this.setMergeUpdateField(field, this.props.lead.details.home_phone)}>
                                    <MDBInput
                                        gap
                                        type="radio"
                                        label={String.formatPhoneNumber(this.props.lead.details.home_phone) + localization.homeSpecLabel}
                                        checked={mergeValue === this.props.lead.details.home_phone}
                                    />
                                </span>}
                            </MDBBox>
                        </MDBBox>
                    </MDBBox>
                )
            } else {
                // other fields with discrepancies need to display a selection box
                return (
                    <MDBBox key={field} className="d-flex flex-column w-100 pb-4">
                        <MDBBox className="w-100">
                            <div className="w-100">{localization[field]}</div>
                        </MDBBox>
                        <MDBBox className="d-flex flex-row w-100">
                            <MDBBox className="border p-4 mr-2 w-50"
                                    onClick={this.setMergeUpdateField(field, targetValue)}>
                                <MDBInput
                                    gap
                                    type="radio"
                                    name={field}
                                    label={targetValue}
                                    checked={mergeValue === targetValue}
                                />
                            </MDBBox>
                            <MDBBox className="border p-4 ml-2 w-50"
                                    onClick={this.setMergeUpdateField(field, sourceValue)}>
                                <MDBInput
                                    gap
                                    type="radio"
                                    name={field}
                                    label={sourceValue}
                                    checked={mergeValue === sourceValue}
                                />
                            </MDBBox>
                        </MDBBox>
                    </MDBBox>
                )
            }
        })
    }

    render() {
        const localization = this.props.localization.interaction.summary.mergeLead
        return (
            <MDBModal isOpen={true} toggle={this.props.closeModal} size="lg">
                <MDBModalHeader>{localization.title}</MDBModalHeader>
                {this.state.targetLead === undefined && <MDBModalBody className="d-flex flex-column w-100">
                    Find a lead
                    <MDBBox className="d-flex flex-row w-100 flex-wrap">
                        <MDBInput type="text"
                                  label={localization.first_name}
                                  id="firstNameValue"
                                  outline
                                  name="firstNameValue"
                                  value={this.state.firstNameValue}
                                  onChange={this.updateSearchForm}
                                  containerClass="m-0 p-1 w-50"
                                  className="skin-border-primary"
                        />
                        <MDBInput type="text"
                                  label={localization.last_name}
                                  id="lastNameValue"
                                  outline
                                  name="lastNameValue"
                                  value={this.state.lastNameValue}
                                  onChange={this.updateSearchForm}
                                  containerClass="m-0 p-1 w-50"
                                  className="skin-border-primary"
                        />
                        <MDBInput type="text"
                                  label={localization.email}
                                  id="emailValue"
                                  outline
                                  name="emailValue"
                                  value={this.state.emailValue}
                                  onChange={this.updateSearchForm}
                                  containerClass="m-0 p-1 w-50"
                                  className="skin-border-primary"
                        />
                        <MDBInput type="text"
                                  label={localization.cell_phone}
                                  id="phoneValue"
                                  outline
                                  name="phoneValue"
                                  value={this.state.phoneValue}
                                  onChange={this.updateSearchForm}
                                  containerClass="m-0 p-1 w-50"
                                  className="skin-border-primary"
                        />
                        <MDBInput type="text"
                                  label={localization.leadID}
                                  id="leadIDValue"
                                  outline
                                  name="leadIDValue"
                                  value={this.state.leadIDValue}
                                  onChange={this.updateSearchForm}
                                  containerClass="m-0 p-1 w-50"
                                  className="skin-border-primary"
                        />
                    </MDBBox>
                    <MDBBox className="d-flex justify-content-between p-1">
                        <MDBBtn color="secondary" rounded outline size="sm"
                                onClick={this.props.closeModal}>{localization.cancelButton}</MDBBtn>
                        {this.state.noResultsError &&
                        <MDBBox className="align-self-center">{localization.noResultsErrorMessage}</MDBBox>}
                        <MDBBtn color="primary" rounded size="sm" disabled={this.state.searchDisabled}
                                onClick={this.search}>{localization.searchButton}</MDBBtn>
                    </MDBBox>
                    {this.state.searchResults.length > 0 && <MDBBox className="d-flex flex-column border-top mt-1 pt-2">
                        {this.renderResults()}
                    </MDBBox>}
                </MDBModalBody>}
                {this.state.targetLead !== undefined && <MDBModalBody className="d-flex flex-column w-100">
                    <p>{localization.mergeStepInstructions}</p>
                    {this.renderMergeFields()}
                    <hr/>
                    <MDBBox className="d-flex flex-row justify-content-between">
                        <MDBBtn rounded color="secondary" outline
                                onClick={this.props.closeModal}>{localization.cancelButton}</MDBBtn>
                        <MDBBtn rounded color="primary" onClick={this.merge}
                                disabled={this.state.mergeDisabled}>{localization.mergeButton}</MDBBtn>
                    </MDBBox>
                </MDBModalBody>}
            </MDBModal>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        interaction: state.interaction,
        twilio: state.twilio
    }
}

export default connect(mapStateToProps)(MergeLead);
