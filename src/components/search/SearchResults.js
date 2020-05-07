import React, { Component } from 'react'
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody
} from "mdbreact"
import SearchResult from './SearchResult'
import { connect } from 'react-redux'

class SearchResults extends Component {

    render() {
        const rows = this.props.results.map((row) => {
            return (
                <SearchResult key={row.id} row={row} />
            )
        })
        const localized = this.props.localization.search

        return (

                    <MDBTable striped>
                        <MDBTableHead color="primary-color" textWhite>
                            <tr>
                                <th>{localized.resultIDHeader}</th>
                                <th>{localized.resultNameHeader}</th>
                                <th>{localized.resultVerticalHeader}</th>
                                <th>{localized.resultPhaseHeader}</th>
                                <th>{localized.resultNextContactHeader}</th>
                                <th></th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {rows}
                        </MDBTableBody>
                    </MDBTable>

        )
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(SearchResults);
