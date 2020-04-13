import React, {Component} from 'react'

import { connect } from 'react-redux'
import LoadingScreen from './LoadingScreen'
import LeadAPI from '../api/leadAPI'

class Preview extends Component {

    constructor(props) {
        super(props)

        // grab store data, fetch preview response, and set it into state
        const previewPayload = {
            leadID: this.props.previewData.leadID,
            callQueueID: this.props.previewData.callQueueID
        }
        LeadAPI.getLeadPreview(this.props.auth.auth, previewPayload)
            .then((response) => {
                this.setState({
                    leadData: response.data
                })
            })
    }
    render() {
        if (!this.state.leadData === undefined) {
            return <LoadingScreen />
        }
        return (
            <div>Well OK then</div>
        )
    }
}

const mapStateToProps = state => {
    return { auth: state.auth, localization : state.localization, previewData: state.preview }
}

const mapDispatchToProps = dispatch => { return { dispatch }}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
