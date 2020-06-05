import React, {Component} from 'react'
import {
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBBox,
    MDBAlert,
    MDBIcon,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCollapse
} from "mdbreact"
import LeadAPI from '../../api/leadAPI'
import SearchResults from './SearchResults'
import { connect } from 'react-redux'

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                firstNameValue: "",
                lastNameValue: "",
                phoneValue: "",
                clientIDValue: ""
            },
            validationError: false,
            validationMessage: "",
            isFetchingResults: false,
            searchOpen: true,
            searchResults: []

        };

        this.handleFormInput = this.handleFormInput.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    generateClientOptions() {
        let clientOptions = this.props.shift.clients.map((client, key) =>
            <option key={client.id} value={client.id}>{client.name}</option>
        )
        return clientOptions
    }

    handleFormInput(event) {
        const formValues = this.state.form

        formValues[event.target.name] = event.target.value
        this.setState({
            form: formValues,
            validationError: false
        })

    }

    handleFormSubmit() {
        // validate that a client has been chosen
        if (this.state.form.clientIDValue === "") {
            this.setState({
                validationError: true,
                validationMessage: this.props.localization.search.noClientSelectedError
            })
            return false
        }
        this.setState({isFetchingResults: true})



        // build payload object
        const payload = {
            first_name: this.state.form.firstNameValue,
            last_name: this.state.form.lastNameValue,
            phone: this.state.form.phoneValue,
            client_id: this.state.form.clientIDValue
        }

        // conditionally add lead ID since the backend is stupid and
        // will never return results with "undefined" as a query argument
        if (this.state.form.leadIDValue !== undefined) {
            payload["id"] = this.state.form.leadIDValue
        }

        // perform search
        LeadAPI.moduleSearch(payload)
            .then((response) => {
                let newStateOptions = {
                    isFetchingResults: false,
                    searchOpen: false
                }
                if (response.success === false) {
                    newStateOptions.validationError = true
                    newStateOptions.validationMessage = "Search Error"
                    newStateOptions.searchOpen = true
                } else if (response.data.length === 0) {
                    newStateOptions.validationError = true
                    newStateOptions.validationMessage = "No Results Found"
                    newStateOptions.searchOpen = true
                }

                newStateOptions.searchResults = response.data

                this.setState(newStateOptions)

            }).catch((reason) => {
                console.log(reason)
            })
    }

    toggleCollapse() {
        this.setState(prevState => ({
            searchOpen: !prevState.searchOpen
          }))
    }

    render() {
        const localized = this.props.localization.search
/*        const isFetching = this.state.isFetchingResults
        let button
        if (isFetching) {
            button = (<MDBBtn color="indigo" disabled>
                    {this.props.localization.buttonLabels.go} <MDBIcon icon="cog" spin className="ml-1" />
                </MDBBtn>
            )
        } else {
            button = (<MDBBtn color="indigo" onClick={this.handleFormSubmit}>
                    {this.props.localization.buttonLabels.go}
                </MDBBtn>
            )
        }
*/


        return (
            <MDBBox className="w-100">
                        <MDBCard>
                            <MDBCardBody className="shadow-none">
                                <MDBCardTitle className={this.state.searchOpen ? "" : "d-flex justify-content-between"}>
                                        {!this.state.searchOpen &&
                                        <MDBBtn color="primary" rounded onClick={() => this.toggleCollapse()}>New Search</MDBBtn>
                                    }
                                </MDBCardTitle>
                                <MDBCollapse id="searchResults" isOpen={this.state.searchOpen}>
                                    <MDBRow>
                                        <MDBCol size="6">
                                            <label htmlFor="first_name" className="grey-text">{localized.firstNameLabel}</label>
                                            <input type="text"
                                                id="first_name"
                                                name="firstNameValue"
                                                className="form-control"
                                                value={this.state.firstNameValue}
                                                onChange={this.handleFormInput}
                                            />
                                        </MDBCol>
                                        <MDBCol size="6">
                                            <label htmlFor="last_name" className="grey-text">{localized.lastNameLabel}</label>
                                            <input type="text"
                                                id="last_name"
                                                name="lastNameValue"
                                                className="form-control"
                                                value={this.state.lastNameValue}
                                                onChange={this.handleFormInput}
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className="pt-2">
                                        <MDBCol size="6">
                                            <label htmlFor="lead_id" className="grey-text">{localized.leadIDLabel}</label>
                                            <input type="text"
                                                id="lead_id"
                                                name="leadIDValue"
                                                className="form-control"
                                                value={this.state.leadIDValue}
                                                onChange={this.handleFormInput}
                                            />
                                        </MDBCol>
                                        <MDBCol size="6">
                                            <label htmlFor="phone" className="grey-text">{localized.phoneLabel}</label>
                                            <input type="text"
                                                id="phone"
                                                name="phoneValue"
                                                value={this.state.phoneValue}
                                                onChange={this.handleFormInput}
                                                className="form-control"
                                            />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow center>

                                        <MDBCol size="8">
                                            <label htmlFor="client_id" className="grey-text">{localized.clientIDLabel}</label>
                                            <select id="client_id"
                                                name="clientIDValue"
                                                className="form-control"
                                                value={this.state.clientIDValue}
                                                onChange={this.handleFormInput}
                                            >
                                                <option value="">{localized.clientIDSelect}</option>
                                                {this.generateClientOptions()}
                                            </select>
                                            <div className="text-center mt-4">
                                                <MDBBtn rounded disabled={this.state.isFetchingResults} onClick={this.handleFormSubmit}>
                                                    {this.props.localization.buttonLabels.go}
                                                    {this.state.isFetchingResults && (
                                                        <MDBIcon icon="cog" spin className="ml-1" />
                                                    )}
                                                </MDBBtn>
                                                {this.state.validationError &&
                                                    <MDBAlert color="danger" >
                                                    {this.state.validationMessage}
                                                </MDBAlert>
                                                }
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCollapse>
                            </MDBCardBody>
                        </MDBCard>
                        {this.state.searchResults.length > 0 &&
                            <MDBCard className="mt-4">
                                <MDBCardBody>
                                    <SearchResults results={this.state.searchResults} />

                                </MDBCardBody>
                            </MDBCard>
                        }
            </MDBBox>
        )
    }
}


const mapStateToProps = store => {
    return { 
        localization : store.localization,
        shift: store.shift 
    }
}

export default connect(mapStateToProps)(Search);
