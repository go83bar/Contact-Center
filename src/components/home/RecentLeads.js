import React, { Component } from 'react'
import {

    MDBCard,
    MDBCardBody,

} from "mdbreact"
import AgentAPI from '../api/agentAPI';
import LoadingScreen from './LoadingScreen'
import SearchResults from './search/SearchResults'
import { connect } from 'react-redux';

class RecentLeads extends Component {

    constructor(props) {
        super(props);

        AgentAPI.getRecentLeads()
            .then((response) => {
                if (response.success) {
                    const searchifiedResults = response.data.map( (item) => {
                        item.id = item.lead_id
                        return item
                    })
                    this.setState({
                        recentData: searchifiedResults
                    })
                }
            }).catch((reason) => {
                // TODO HANDLE ERRORS
                console.log(reason)
            })

        this.state = {
        };
    }

    render() {
        if (this.state.recentData === undefined) {
            return <LoadingScreen />
        }
        return (
            <MDBCard>
                <MDBCardBody className="shadow-none">
                    <SearchResults results={this.state.recentData} />
                </MDBCardBody>
            </MDBCard>
        )
    }
}
const mapStateToProps = store => {
    return {
        localization : store.localization,
        previewData: store.preview
    }
}

export default connect(mapStateToProps)(RecentLeads);
