import React, {Component} from 'react'
import {
    MDBBtn, MDBInput, MDBModal,
    MDBBox, MDBModalBody, MDBModalFooter,
    MDBModalHeader, MDBSelect
} from 'mdbreact'
import {toast} from "react-toastify"
import {connect} from "react-redux"
import Switch from "../../ui/Switch"
import LeadAPI from "../../../api/leadAPI"
import moment from "moment"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faStar as solidStar,
} from "@fortawesome/pro-solid-svg-icons";
import {
    faStar as emptyStar,
} from "@fortawesome/pro-regular-svg-icons"

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
        for (let [field, value] of Object.entries(props.lead.details)) {
            formattedLeadDetails[field] = (value === null) ? undefined : value
        }

        formattedLeadDetails.region_id = props.lead.region_id

        // build timezone options
        const timezoneOptions = props.localization.interaction.timezoneChoices.map(timezone => {
            return {
                value: timezone.value,
                text: timezone.label,
                checked: timezone.value === props.lead.details.timezone
            }
        })

        // region options
        const client = this.props.shift.clients[this.props.lead.client_index]
        const regionOptions = client.regions.filter(region => region.active).map(region => {
            return {
                value: region.id.toString(),
                text: region.name,
                checked: region.id === props.lead.region_id
            }
        })

        this.state = {
            ...formattedLeadDetails,
            cell_phone: this.maskPhoneValue(formattedLeadDetails.cell_phone),
            home_phone: this.maskPhoneValue(formattedLeadDetails.home_phone),
            originalValues: formattedLeadDetails,
            monthValue: month,
            dayValue: day,
            yearValue: year,
            timezoneOptions: timezoneOptions,
            regionOptions: regionOptions,
            disableSave: true,
            hasErrors: false,
            errorMessage: ""
        };
    }

    submit = () => {
        // Validate date of birth to be either complete or empty
        if ((this.state.yearValue === undefined || this.state.monthValue === undefined || this.state.dayValue === undefined) && (this.state.yearValue !== undefined || this.state.monthValue !== undefined || this.state.dayValue !== undefined)) {
            console.log("Year: ", this.state.yearValue, " Month: ", this.state.monthValue, " Day: ", this.state.dayValue)
            this.setState({
                hasErrors: true,
                errorMessage: "Date of Birth cannot be partially filled",
                disableSave: true
            })
            return
        }

        // validate date of birth year to be empty or 4 digits
        if (this.state.yearValue !== undefined && this.state.yearValue.length !== 4) {
            this.setState({hasErrors: true, errorMessage: "Birth year must be 4 digits", disableSave: true})
            return
        }

        // valid DOB date validation, if we have a DOB
        let validDate = ""
        if (this.state.monthValue !== undefined) {
            const dateString = this.state.yearValue + "-" + this.state.monthValue.padStart(2, "0") + "-" + this.state.dayValue.padStart(2, "0")
            validDate = moment(dateString)
            if (validDate.format("YYYY-MM-DD") === "Invalid date") {
                this.setState({hasErrors: true, errorMessage: "Invalid date of birth", disableSave: true})
                return
            }
            if (validDate.isAfter()) {
                this.setState({hasErrors: true, errorMessage: "Date of Birth cannot be in the future", disableSave: true})
                return
            }
        }

        // Compare current state to props to build save payload based on what changed
        let updatedFields = []
        for (let [field, value] of Object.entries(this.state.originalValues)) {
            // date of birth check is special
            if (field === "date_of_birth") {
                let stateDate = null
                if (this.state.monthValue !== undefined) {
                    stateDate = validDate.format("YYYY-MM-DD")
                }
                let originalDate = null
                if (value !== undefined) {
                    originalDate = value
                }

                if (stateDate !== originalDate) {
                    updatedFields.push({fieldName: "date_of_birth", value: stateDate, oldValue: originalDate})
                }
                // must strip non-numeric from phone fields before comparison
            } else if (field === "cell_phone" || field === "home_phone") {
                const newPhone = this.state[field].replace(/\D/g, '')
                if (newPhone !== value && (newPhone !== "" && value !== undefined)) { // ignore any "change" from undefined to blank string
                    updatedFields.push({fieldName: field, value: newPhone, oldValue: value})
                }
                // other fields are simple string comparison, again ignoring empty cells that started undefined
            } else if (value !== this.state[field] && (this.state[field] !== "" && value !== undefined)) {
                updatedFields.push({fieldName: field, value: this.state[field], oldValue: value})
            }
        }

        // build payload for save API call and array of changes for redux action
        let payload = {}
        let changeLogs = []
        updatedFields.forEach(field => {
            payload[field.fieldName] = field.value
            changeLogs.push({
                field: field.fieldName,
                old_value: field.oldValue,
                new_value: field.value,
                created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
                created_by: this.props.user.label_name
            })
        })

        // hack for phone numbers because of PHP code
        if (this.state.cell_phone !== undefined) {
            payload.cell_phone = this.state.cell_phone.replace(/\D/g, '')
        }
        if (this.state.home_phone !== undefined) {
            payload.home_phone = this.state.home_phone.replace(/\D/g, '')
        }

        // call API method and dispatch new data to the store when it's complete
        LeadAPI.saveContactInfo({leadID: this.props.lead.id, payload: payload})
            .then(response => {
                if (response !== "false") {
                    // check to see if timezone changed, we need to update a couple fields there
                    if (payload.timezone !== undefined) {
                        payload.timezone_short = moment().tz(payload.timezone).format('z')
                    }
                    let updateAction = {
                        type: "LEAD.UPDATE_DETAILS",
                        data: payload,
                        logs: changeLogs
                    }
                    // check to see if region changed, to add a couple things to the action
                    if (payload.region_id !== undefined) {
                        // find new region_index
                        const currentClient = this.props.shift.clients[this.props.lead.client_index]
                        const newRegionIndex = currentClient.regions.findIndex(region => {
                            return region.id === payload.region_id
                        })

                        updateAction.regionData = {
                            region_id: payload.region_id,
                            region_index: newRegionIndex
                        }
                    }
                    this.props.dispatch(updateAction)
                    toast.success(this.props.localization.toast.editLead.success, {delay: 1000})
                } else {
                    toast.error(this.props.localization.toast.editLead.error, {delay: 1000})
                }
            }).catch(reason => {
            // TODO handle error
            toast.error(this.props.localization.toast.editLead.error, {delay: 1000})
            console.log("REASON: ", reason)
        })
        this.props.closeModal(this.state.modalName)
    }

    cancel = () => {
        this.props.closeModal(this.state.modalName)
    }

    maskPhoneValue = (rawInput) => {
        if (rawInput === undefined) {
            return ""
        }
        const matches = rawInput.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        return !matches[2] ? matches[1] : '(' + matches[1] + ') ' + matches[2] + (matches[3] ? '-' + matches[3] : '')
    }

    maskPhone = (val, type) => {
        let newPhoneState = {}
        newPhoneState[type] = this.maskPhoneValue(val)
        this.setState(newPhoneState)

    }

    handleFormInput = (evt) => {
        this.setState({[evt.target.name]: evt.target.value, hasErrors: false, disableSave: false})
    }

    chooseTimezone = (values) => {
        this.setState({timezone: values[0], hasErrors: false, disableSave: false})
    }

    chooseRegion = (values) => {
        this.setState({region_id: parseInt(values[0]), hasErrors: false, disableSave: false})
    }

    togglePreferredPhone = () => {
        // update preferred_phone only if the other option has a value
        if (this.state.preferred_phone === "cell" && this.state.home_phone !== "" && this.state.home_phone !== undefined) {
            this.setState({preferred_phone: "home", disableSave: false})
        } else if (this.state.preferred_phone === "home" && this.state.cell_phone !== "" && this.state.cell_phone !== undefined) {
            this.setState({preferred_phone: "cell", disableSave: false})
        }
    }

    updatePreference = field => {
        const newPreference = !this.props.lead.contact_preferences[field] ? "1" : "0"
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
                            value: newPreference,
                            timestamp: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
                            user_label: this.props.user.label_name
                        }
                    })
                    toast.success(this.props.localization.toast.editContactPreferences.success, {delay: 1000})
                } else {
                    toast.error(this.props.localization.toast.editContactPreferences.error, {delay: 1000})
                }
            })
    }

    render() {
        const switches = ['phone_calls', 'emails', 'texts'].map((field) => {
            let icon = ""
            switch (field) {
                case "phone_calls":
                    icon = "phone";
                    break;
                case "emails":
                    icon = "envelope";
                    break;
                case "texts":
                    icon = "comment";
                    break;
                default:
                    break
            }
            return (
                <Switch checked={this.props.lead.contact_preferences[field]}
                        offLabel={this.props.localization.interaction.summary.contactPreferences.notAllowedLabel}
                        key={field}
                        onLabel={this.props.localization.interaction.summary.contactPreferences.allowedLabel}
                        icon={icon}
                        onChange={() => this.updatePreference(field)}/>
            )
        })
        return (
            <MDBModal isOpen={true} toggle={this.props.closeModal} size="lg" contentClassName="w-900px">
                <MDBModalHeader>{this.props.localized.title}</MDBModalHeader>
                <MDBModalBody className="d-flex flex-wrap justify-content-start w-100">
                    {this.props.localized.contactInfoHeader}
                    <div className="break mb-1"/>
                    <MDBInput type="text"
                              label={this.props.localized.firstName}
                              id="first_name"
                              outline
                              name="first_name"
                              value={this.state.first_name}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.lastName}
                              id="last_name"
                              outline
                              name="last_name"
                              value={this.state.last_name}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.email}
                              id="email"
                              outline
                              name="email"
                              value={this.state.email}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-50"
                              className="skin-border-primary"
                    />
                    <div className="break mt-1"/>
                    <FontAwesomeIcon icon={this.state.preferred_phone === "cell" ? solidStar : emptyStar}
                                     onClick={this.togglePreferredPhone}
                                     className="skin-primary-color mt-2 mr-1 pointer"/>
                    <MDBInput type="text"
                              label={this.props.localized.cellPhone}
                              id="cell_phone"
                              outline
                              name="cell_phone"
                              value={this.state.cell_phone}
                              onChange={this.handleFormInput}
                              getValue={(val) => this.maskPhone(val, "cell_phone")}
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <FontAwesomeIcon icon={this.state.preferred_phone === "home" ? solidStar : emptyStar}
                                     onClick={this.togglePreferredPhone}
                                     className="skin-primary-color mt-2 ml-2 mr-1 pointer"/>
                    <MDBInput type="text"
                              label={this.props.localized.homePhone}
                              id="home_phone"
                              outline
                              name="home_phone"
                              value={this.state.home_phone}
                              getValue={(val) => this.maskPhone(val, "home_phone")}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <div className="break mt-3 pb-1"/>
                    {this.props.localized.streetAddressHeader}
                    <div className="break mb-1"/>
                    <MDBInput type="text"
                              label={this.props.localized.address}
                              id="address_1"
                              outline
                              name="address_1"
                              value={this.state.address_1}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.address2}
                              id="address_2"
                              outline
                              name="address_2"
                              value={this.state.address_2}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-25"
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
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.state}
                              id="state"
                              outline
                              name="state"
                              value={this.state.state}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <MDBInput type="text"
                              label={this.props.localized.zip}
                              id="zip"
                              outline
                              name="zip"
                              value={this.state.zip}
                              onChange={this.handleFormInput}
                              containerClass="m-0 pr-2 w-25"
                              className="skin-border-primary"
                    />
                    <div className="break mt-3 pb-1"/>
                    {this.props.localized.regionHeader}
                    <div className="break mb-1"/>
                    <MDBSelect options={this.state.regionOptions}
                               getValue={this.chooseRegion}
                               search={this.state.regionOptions.length > 8}
                               label={this.props.localized.region}
                               className="mb-1 mt-1 mr-3"
                    />
                    <MDBSelect options={this.state.timezoneOptions}
                               getValue={this.chooseTimezone}
                               label={this.props.localized.timezone}
                               className="mb-1 mt-1"
                    />

                    <div className="break"/>
                    {this.props.localized.dobHeader}
                    <div className="break mb-1"/>
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
                    {this.state.hasErrors &&
                    <MDBBox className="p-1 w-75 text-danger text-right"> {this.state.errorMessage} </MDBBox>}
                    <div className="break mt-3 pb-1"/>
                    {this.props.localized.contactPreferencesHeader}
                    <div className="break mb-1"/>

                    <MDBBox className="d-flex flex-wrap w-100">
                        {switches}
                    </MDBBox>
                </MDBModalBody>

                <MDBModalFooter className="p-1 justify-content-between">
                    <MDBBtn color="secondary"
                            rounded outline
                            onClick={this.cancel}>
                        {this.props.localized.cancelButton}
                    </MDBBtn>
                    <MDBBtn color="primary"
                            rounded
                            disabled={this.state.disableSave}
                            onClick={this.submit}>
                        {this.props.localized.submitButton}
                    </MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        localization: state.localization,
        localized: state.localization.interaction.summary.editLead,
        lead: state.lead,
        shift: state.shift
    }
}

export default connect(mapStateToProps)(EditLead);
