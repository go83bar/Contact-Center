import React, {Component} from 'react'
import {
    MDBBtn, MDBCol, MDBRow,
    MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader,
    MDBTable, MDBTableHead, MDBTableBody, 
    MDBInput, MDBBox
 } from 'mdbreact'
import {connect} from "react-redux";
import ProviderDialRow from "./ProviderDialRow"

class ProviderChoices extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchContent: "",
            visibleOffices: props.data
        }

    }

    applySearch = (searchValue) => {
        let newVisibleOffices
        if (searchValue === "") {
            newVisibleOffices = this.props.data
        } else {
            newVisibleOffices = this.props.data.filter( (row) => {
                return row.office.name.toLowerCase().search(searchValue.toLowerCase()) !== -1
            })
        }
        console.log("Value: ", searchValue)
        console.log("newVisibleOffices: ", newVisibleOffices)
        this.setState({
            searchContent: searchValue,
            visibleOffices: newVisibleOffices
        })
    }

    generateProviderRows = () => {
        return this.state.visibleOffices.map((row) => {
            return (
                <ProviderDialRow key={row.id} row={row} dialHandler={this.props.selectOffice} />
            )
        })


    }

    render() {
        return (
            <MDBModal isOpen={true} toggle={this.props.toggle} size="lg" >
                <MDBBox className="d-flex justify-content-between align-items-center pl-4 pr-5">
                    <h4>{this.props.localized.title}</h4>
                    <MDBInput id="officeSearch"
                        label={this.props.localization.buttonLabels.search} 
                        outline 
                        getValue={this.applySearch} 
                        value={this.state.searchContent}
                        icon="search"
                        size="sm"
                    />
               </MDBBox>
                <MDBModalBody >
                    <MDBTable>
                        <MDBTableHead>
                            <tr>
                                <th>{this.props.localized.nameHeader}</th>
                                <th>{this.props.localized.cityHeader}</th>
                                <th>{this.props.localized.numberHeader}</th>
                                <th>{this.props.localized.hoursHeader}</th>
                                <th>{this.props.localized.priorityHeader}</th>
                                <th></th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {this.generateProviderRows()}
                        </MDBTableBody>
                    </MDBTable>
                </MDBModalBody>
                <MDBModalFooter className="p-1 justify-content-start">
                    <MDBRow>
                        <MDBCol size={"12"}>
                            <MDBBtn color="secondary" rounded outline className="float-left"
                                    onClick={this.props.toggle}>{this.props.localization.buttonLabels.cancel}</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBModalFooter>
            </MDBModal>
        )
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        localized: state.localization.interaction.callbar.providerChoices,
    }
}

export default connect(mapStateToProps)(ProviderChoices);
