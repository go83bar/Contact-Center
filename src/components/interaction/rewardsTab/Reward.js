import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faGift,} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";
import {MDBBox, MDBBtn, MDBCard} from "mdbreact";
import AgentAPI from "../../../api/agentAPI";
import {toast} from "react-toastify";


class Reward extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resending: false,
            resendButtonLabel: props.localization.interaction.rewards.resendButtonLabel
        }
    }
    resendReward = () => {
        this.setState({resending: true, resendButtonLabel: this.props.localization.interaction.rewards.resendingButtonLabel})
        AgentAPI.resendReward({rewardID: this.props.reward.id}).then( response => {
            // just need to update the lead data with the new resend and the button will be destroyed
            this.props.dispatch({
                type: "LEAD.REWARD_RESENT",
                data: {
                    rewardID: this.props.reward.id,
                    lastResentAt: moment.utc().format("YYYY-MM-DD hh:mm:ss")
                }
            })
            toast.success(this.props.localization.toast.rewards.resent)
        }).catch( error => {
            console.log("Error resending reward: ", error);
            toast.error(this.props.localization.toast.rewards.notResent)
            this.setState({
                resendButtonLabel: this.props.localization.interaction.rewards.resendButtonLabel
            })
        })
    }

    render() {
        const timezone = this.props.lead.details.timezone
        const localization = this.props.localization.interaction.rewards
        const rewardTime = moment.utc(this.props.reward.created_at).tz(timezone)
        let resendTime = false
        if (this.props.reward.last_resent_at) {
            resendTime = moment.utc(this.props.reward.last_resent_at).tz(timezone)
        }

        return (
            <MDBCard className="d-flex w-100 shadow-sm border-0 mb-2">
                <MDBBox className="d-flex backgroundColorInherit skin-border-primary f-m w-100">
                    <div className="d-flex p-1 px-3 w-100 skin-border-primary timelineCardHeader">
                        <MDBBox className="w-75 p-2 d-flex">
                            <span className="fa-layers fa-fw fa-3x mt-2">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                <FontAwesomeIcon icon={faGift} transform={"shrink-8"} className={"darkIcon"}/>
                            </span>
                            <div className="d-flex p-2 flex-column text-left w-50">
                                <span className="f-l font-weight-bold">{this.props.reward.campaign} / {localization.amountDisplay.replace(";", this.props.reward.amount)}</span>
                                {this.props.reward.resendable && <div><MDBBtn rounded onClick={this.resendReward} className="btn-primary w-50" disabled={this.state.resending}>{this.state.resendButtonLabel}</MDBBtn></div>}
                            </div>

                        </MDBBox>
                        <MDBBox className="d-flex w-25 p-2 f-s flex-column text-right justify-content-start grey-text">
                            {resendTime && <span>{localization.lastResentAt}<span
                                className="font-weight-bold">{resendTime.format("MMM D")}</span>, {resendTime.format("h:mm a z")}</span>}
                            <span>{localization.createdAt} <span
                                className="font-weight-bold">{rewardTime.format("MMM D")}</span>, {rewardTime.format("h:mm a z")}</span>
                        </MDBBox>
                    </div>
                </MDBBox>
            </MDBCard>
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

export default connect(mapStateToProps)(Reward)