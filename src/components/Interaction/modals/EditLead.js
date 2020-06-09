import React, {Component} from 'react'
import {MDBBtn, MDBCol, MDBInput, MDBModal, MDBBox, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from 'mdbreact'
import {connect} from "react-redux"
import Switch from "../../ui/Switch"
import LeadAPI from "../../../api/leadAPI"
import moment from "moment"

class EditLead extends Component {

    constructor(props) {
        super(props);

        let year, month, day
        if (props.lead.details.date_of_birth !== null) {
            const dateOfBirth = moment(props.lead.details.date_of_birth)
            year = dateOfBirth.format("YYYY")
            month = dateOfBirth.format("MM")
            day = dateOfBirth.format("DD")
        }

        // build copy of lead data suitable for MDBInput components
        let formattedLeadDetails = {}
        for (let [field, value] of Object.entries(this.props.lead.details)) {
            formattedLeadDetails[field] = (value === null) ? undefined : value
        }

        this.state = {
            ...formattedLeadDetails,
            originalValues: formattedLeadDetails,
            monthValue: month,
            dayValue: day,
            yearValue: year,
            hasErrors: false,
            errorMessage: ""
        };
    }

    submit = () => {
        // Validate date of birth to be either complete or empty
        if ((this.state.yearValue === undefined || this.state.monthValue === undefined || this.state.dayValue === undefined) && (this.state.yearValue !== undefined || this.state.monthValue !== undefined || this.state.dayValue !== undefined)) {
            console.log("Year: ", this.state.yearValue, " Month: ", this.state.monthValue, " Day: ", this.state.dayValue)
            this.setState({ hasErrors: true, errorMessage: "Date of Birth cannot be partially filled"})
            return
        }
        // validate date of birth year to be empty or 4 digits
        if (this.state.yearValue !== undefined && this.state.yearValue.length !== 4) {
            this.setState({ hasErrors: true, errorMessage: "Birth year must be 4 digits"})
            return
        }        
        // Compare current state to props to build save payload based on what changed
        let updatedFields = []
        for (let [field, value] of Object.entries(this.state.originalValues)) {
            // date of birth check is special
            if (field === "date_of_birth") {
                let stateDate = null
                if (this.state.yearValue !== undefined) {
                    const dateString = this.state.yearValue + "-" + this.state.monthValue.padStart(2, "0") + "-" + this.state.dayValue.padStart(2, "0")
                    console.log(dateString)
                    stateDate = moment(dateString).format("YYYY-MM-DD")
                    if (stateDate === "Invalid date") {
                        this.setState({ hasErrors: true, errorMessage: "Invalid date of birth"})
                        return
                    }
                }
                let originalDate = null
                if (value !== undefined) {
                    originalDate = value
                }

                if (stateDate !== originalDate) {
                    updatedFields.push( {fieldName: "date_of_birth", value: stateDate})
                }
            // other fields are simple string comparison
            } else if (value !== this.state[field]) {
                updatedFields.push( {fieldName: field, value: this.state[field]})
            }
        }

        if (updatedFields.length === 0) {
            // no fields to update
            this.setState({ hasErrors: true, errorMessage: "You didn't change anything"})
            return
        }

        // build payload for save API call
        let payload = {}
        updatedFields.forEach( field => {
            payload[field.fieldName] = field.value
        })

        // hack for phone numbers because of PHP code
        if (this.state.cell_phone !== undefined) {
            payload.cell_phone = this.state.cell_phone
        }
        if (this.state.home_phone !== undefined) {
            payload.home_phone = this.state.home_phone
        }

        // call API method and dispatch new data to the store when it's complete
        LeadAPI.saveContactInfo({ leadID: this.props.lead.id, payload: payload}).then( response => {
            if (response !== "false") {
                this.props.dispatch({ type: "LEAD.UPDATE_DETAILS", data: payload })
            }
        }).catch( reason => {
            // TODO handle error
            console.log("REASON: ", reason)
        })
        this.props.closeModal(this.state.modalName)
    }

    cancel = () => {
        this.props.closeModal(this.state.modalName)
    }

    handleFormInput = (evt) => {
        
        this.setState({ [evt.target.name]: evt.target.value, hasErrors: false })
    }

    updatePreference = field => {
        const newPreference = !this.props.lead.contact_preferences[field]
        const payload = {
            leadID: this.props.lead.id,
            type: field,
            preference: newPreference
        }
        LeadAPI.setContactPreferences(payload)
            .then((response) => {
                if (response.success) {
                    this.props.dispatch({
                        type: "LEAD.UPDATE_CONTACT_PREFERENCES",
                        data: {
                            field: field,
                            value: newPreference
                        }
                    })
                }
            })

    }

    render() {
        const switches = ['phone_calls', 'emails', 'texts'].map((field) => {
            let icon = ""
            switch (field) {
                case "phone_calls": icon = "phone"; break;
                case "emails": icon = "envelope"; break;
                case "texts": icon = "comment"; break;
                default: break
            }
            return (
                    <Switch checked={this.props.lead.contact_preferences[field]} offLabel={"Not Allowed"} key={field}
                            onLabel={"Allowed"} icon={icon} onChange={() => this.updatePreference(field)}/>
            )
        })
        return (
            <MDBModal isOpen={true} toggle={this.props.closeModal} size="lg" contentClassName="w-900px" >
                <MDBModalHeader>{this.props.localized.title}</MDBModalHeader>
                <MDBModalBody className="d-flex flex-wrap justify-content-start w-100">
                    <MDBInput type="text"
                              label={this.props.localized.firstName}
                              id="first_name"
                              outline
                              name="first_name"
                              value={this.state.first_name}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.lastName}
                              id="last_name"
                              outline
                              name="last_name"
                              value={this.state.last_name}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.email}
                              id="email"
                              outline
                              name="email"
                              value={this.state.email}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-50"
                              className="skin-border-primary"
                    />
                        <div className="break"/>
                    <MDBInput type="text"
                              label={this.props.localized.cellPhone}
                              id="cell_phone"
                              outline
                              name="cell_phone"
                              value={this.state.cell_phone}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.homePhone}
                              id="home_phone"
                              outline
                              name="home_phone"
                              value={this.state.home_phone}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <div className="break"/>
                    <MDBInput type="text"
                              label={this.props.localized.address}
                              id="address_1"
                              outline
                              name="address_1"
                              value={this.state.address_1}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.address2}
                              id="address_2"
                              outline
                              name="address_2"
                              value={this.state.address_2}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                        <div className="break"/>

                    <MDBInput type="text"
                              label={this.props.localized.city}
                              id="city"
                              outline
                              name="city"
                              value={this.state.city}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.state}
                              id="state"
                              outline
                              name="state"
                              value={this.state.state}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.zip}
                              id="zip"
                              outline
                              name="zip"
                              value={this.state.zip}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 w-25"
                              className="skin-border-primary"
                    />
                    <div className="break"/>
                    Date Of Birth
                    <div className="break"/>
                    <MDBInput type="text"
                              label={this.props.localized.month}
                              id="month"
                              size="sm"
                              outline
                              name="monthValue"
                              value={this.state.monthValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2"
                              className="skin-border-primary"
                              style={{margin: "0px -120px 0.5rem 0"}}
                    />/
                    <MDBInput type="text"
                              label={this.props.localized.day}
                              id="day"
                              size="sm"
                              outline
                              name="dayValue"
                              value={this.state.dayValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 mr-2 ml-2"
                              className="skin-border-primary"
                              style={{margin: "0px -120px 0.5rem 0"}}
                    />/
                    <MDBInput type="text"
                              label={this.props.localized.year}
                              id="year"
                              size="sm"
                              outline
                              name="yearValue"
                              value={this.state.yearValue}
                              onChange={this.handleFormInput}
                              containerClass="m-0 ml-2"
                              className="skin-border-primary"
                              style={{margin: "0px -110px 0.5rem 0"}}
                    />
                    { this.state.hasErrors && <MDBBox className="p-1 w-75 text-danger text-right"> {this.state.errorMessage} </MDBBox>}
                    <div className="break"/>
                    Contact Preferences
                    <div className="break"/>

                    <MDBBox className="d-flex flex-wrap w-100" >
                        {switches}
                    </MDBBox>
                </MDBModalBody>

                <MDBModalFooter className="p-1">
                    <MDBRow>
                        <MDBCol size={"12"}>
                            <MDBBtn color="secondary" rounded outline className="float-left"
                                    onClick={this.cancel}>{this.props.localized.cancelButton}</MDBBtn>
                            <MDBBtn color="primary" rounded className="float-right" disabled={this.state.hasErrors}
                                    onClick={this.submit}>{this.props.localized.submitButton}</MDBBtn>

                        </MDBCol>
                    </MDBRow>
                </MDBModalFooter>
            </MDBModal>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localized: state.localization.interaction.summary.editLead,
        lead: state.lead,
    }
}

export default connect(mapStateToProps)(EditLead);
