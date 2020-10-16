import React, {Component} from 'react'
import {MDBBtn} from "mdbreact"
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { faPhone } from "@fortawesome/pro-solid-svg-icons"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class ProviderDialRow extends Component {
    constructor(props) {
        super(props)
         
        this.state = {
            
        }
    }

    // when user clicks on a result, we load the preview screen for that lead
    handleDialClick = () => {
        this.props.dialHandler(this.props.row.office.id, this.props.row.number)
    }

    render() {
        return (
            <tr className={ this.props.row.available ? "mb-2 skin-border-primary skin-primary-color" : "mb-2 skin-footer-color"}>
                <td className="border-right">{this.props.row.office.name}</td>
                <td className="border-right">{this.props.row.office.city}</td>
                <td className="border-right">{this.props.row.number}</td>
                <td className="border-right">{this.props.row.hours}</td>
                <td>{this.props.row.priority}</td>
                <td className="align-middle">{this.props.row.available && (
                    <MDBBtn className="align-top" size="sm" rounded onClick={this.handleDialClick}>
                    <FontAwesomeIcon icon={faPhone} className="text-white"/></MDBBtn>
                )}</td>
            </tr>
        )

    }
}

const mapStateToProps = store => {
    return { localization : store.localization }
}

export default withRouter(connect(mapStateToProps)(ProviderDialRow))
