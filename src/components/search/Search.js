import React, {Component} from 'react'
import {MDBBtn, MDBRow, MDBCol, MDBBox, MDBAlert, MDBIcon, MDBContainer} from "mdbreact"
import LeadAPI from '../../api/leadAPI'
import SearchResults from './SearchResults'
import { connect } from 'react-redux'
import CircularSideNav from "../CircluarSideNav/CircularSideNav";

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                leadIDValue: 0,
                firstNameValue: "",
                lastNameValue: "",
                phoneValue: "",
                clientIDValue: ""
            },
            clients: [
                {name: "Myriad", id: 10},
                {name: "Bob", id: 20}
            ],
            validationError: false,
            validationMessage: "",
            isFetchingResults: false,
            searchResults: []

        };

        this.handleFormInput = this.handleFormInput.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    generateClientOptions() {
        let clientOptions = this.state.clients.map((client, key) =>
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
            id: this.state.form.leadIDValue,
            first_name: this.state.form.firstNameValue,
            last_name: this.state.form.lastNameValue,
            phone: this.state.form.phoneValue,
            client_id: this.state.form.clientIDValue
        }

        // perform search
        LeadAPI.moduleSearch(this.props.auth.auth, payload)
            .then((response) => {
                let newStateOptions = {
                    isFetchingResults: false
                }
                if (response.success === false) {
                    newStateOptions.validationError = true
                    newStateOptions.validationMessage = "Search Error"
                } else if (response.data.length === 0) {
                    newStateOptions.validationError = true
                    newStateOptions.validationMessage = "No Results Found"
                }

                newStateOptions.searchResults = response.data

                this.setState(newStateOptions)

                console.log("THUNK")
                console.log(response)
            }).catch((reason) => {
                console.log(reason)
            })
    }

    render() {
        const localized = this.props.localization.search
        const isFetching = this.state.isFetchingResults
        let button
        if (isFetching) {
            button = (<MDBBtn color="indigo" disabled>
                    {localized.searchButtonLabel} <MDBIcon icon="cog" spin className="ml-1" />
                </MDBBtn>
            )
        } else {
            button = (<MDBBtn color="indigo" onClick={this.handleFormSubmit}>
                    {localized.searchButtonLabel}
                </MDBBtn>
            )
        }



        return (
            <MDBContainer fluid>
                <CircularSideNav
                    backgroundImg={"/images/nav.png"}
                    backgroundColor={'#E0E0E0'}
                    color={'#7c7c7c'}
                    navSize={16}
                    animation={''}
                    animationPeriod={0.04}
                />
            <MDBBox>
                <MDBRow center>
                    <MDBCol size="12">
                        <p className="h4 text-center mb-4">{localized.componentTitle}</p>
                    </MDBCol>
                </MDBRow>
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
                        <br />
                        <label htmlFor="lead_id" className="grey-text">{localized.leadIDLabel}</label>
                        <input type="text"
                            id="lead_id"
                            name="leadIDValue"
                            className="form-control"
                            value={this.state.leadIDValue}
                            onChange={this.handleFormInput}
                        />
                        <br />
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
                        <br />
                        <label htmlFor="phone" className="grey-text">{localized.phoneLabel}</label>
                        <input type="text"
                            id="phone"
                            name="phoneValue"
                            value={this.state.phoneValue}
                            onChange={this.handleFormInput}
                            className="form-control"
                        />
                        <br />
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
                        {button}
                        {this.state.validationError &&
                            <MDBAlert color="danger" >
                            {this.state.validationMessage}
                          </MDBAlert>
                        }
                        </div>
                    </MDBCol>
                </MDBRow>
                {this.state.searchResults.length > 0 &&
                    <SearchResults results={this.state.searchResults} />
                }
            </MDBBox>
            </MDBContainer>

        )
    }
}


const mapStateToProps = state => {
    return { auth: state.auth, localization : state.localization }
}

const mapDispatchToProps = dispatch => { return { dispatch }}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
