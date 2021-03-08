import React, {Component} from 'react'
import {MDBBtn} from "mdbreact"
//import LeadAPI from '../../api/leadAPI'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Lead from "../../utils/Lead";

class SearchResult extends Component {
    constructor(props) {
        super(props)


        // some small changes to display items depending on locked status
        let lockedOpts = {}
        let leadName = props.row.first_name + " " + props.row.last_name
        if (props.row.locked) {
            lockedOpts.className = "deep-orange-text"
            leadName = leadName + " - " + props.localization.search.resultLockedLabel
        }

        this.state = {
            lockedOpts: lockedOpts,
            leadName: leadName
        }

        this.handleResultClick = this.handleResultClick.bind(this)
    }

    // when user clicks on a result, we load the preview screen for that lead
    handleResultClick() {
        Lead.loadPreview(this.props.row.id, "search").then(() => { console.log("Preview loaded")})
    }

    render() {
        return (
            <tr>
                <td>{this.props.row.id}</td>
                <td {...this.state.lockedOpts}>{this.state.leadName}</td>
                <td>{this.props.row.client_name}</td>
                <td>{this.props.row.vertical_name}</td>
                <td>{this.props.row.phase_name}</td>
                <td>{this.props.row.next_contact}</td>
                <td className="align-middle">{!this.props.row.locked && (
                    <MDBBtn className="align-top" size="sm" rounded onClick={this.handleResultClick}>
                    {this.props.localization.buttonLabels.load}</MDBBtn>
                )}</td>
            </tr>
        )

    }
}

const mapStateToProps = store => {
    return { localization : store.localization }
}

export default withRouter(connect(mapStateToProps)(SearchResult))
