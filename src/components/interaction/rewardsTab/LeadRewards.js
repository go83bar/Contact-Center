import React, {Component} from 'react'
import {MDBBox } from 'mdbreact'
import {connect} from 'react-redux'
import Reward from "./Reward";

class LeadDocusign extends Component {

    constructor(props) {
        super(props);

        let sendOptions = []

        this.state = {
            sendDisabled: true,
            selectedTemplateID: undefined,
            sendOptions
        };
    }

    handleTemplateSelect = (values) => {
        const templateID = parseInt(values[0])

        this.setState({ selectedTemplateID: templateID, sendDisabled: false })
    }

    render() {
        return (
            <MDBBox className={this.props.active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}>
                <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                    <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                        {this.props.lead.rewards && this.props.lead.rewards.map(reward => <Reward key={reward.id} reward={reward} />)}
                    </div>
                </MDBBox>
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        shift: state.shift,
        user: state.user
    }
}

export default connect(mapStateToProps)(LeadDocusign)