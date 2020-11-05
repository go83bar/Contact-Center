import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faGift} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";
import {
    MDBBox,
    MDBBtn,
    MDBCard,
    MDBModal,
    MDBModalBody,
    MDBModalFooter,
    MDBModalHeader,
} from "mdbreact";
import AgentAPI from "../../../api/agentAPI";
import {toast} from "react-toastify";


class Reward extends Component {

    constructor(props) {
        super(props)


        const buttonLabelLocalizationName = props.reward.resendable ? "buttonLabelResend" : "buttonLabelCannotResend"

        this.state = {
            disableResend: !props.reward.resendable,
            confirmVisible: false,
            resendButtonLabel: this.props.localization.interaction.rewards[buttonLabelLocalizationName]
        }
    }
    resendReward = () => {
        this.setState({disableResend: true, resendButtonLabel: this.props.localization.interaction.rewards.buttonLabelResending})
        AgentAPI.resendReward({rewardID: this.props.reward.id}).then( response => {
            if (response.success) {
                // just need to update the lead data with the new resend and the button will be destroyed
                this.props.dispatch({
                    type: "LEAD.REWARD_RESENT",
                    data: {
                        rewardID: this.props.reward.id,
                        interactionID: this.props.interaction.id,
                        sentTo: this.props.lead.details.email,
                        campaign: this.props.reward.campaign,
                        lastResentAt: moment.utc().format("YYYY-MM-DD hh:mm:ss")
                    }
                })

                this.setState({
                    resendButtonLabel: this.props.localization.interaction.rewards.buttonLabelSent,
                    confirmVisible: false
                })

                toast.success(this.props.localization.toast.rewards.resent)
            } else {
                toast.error(this.props.localization.toast.rewards.notResent)
                this.setState({
                    resendButtonLabel: this.props.localization.interaction.rewards.buttonLabelCannotResend
                })
            }
        }).catch( error => {
            console.log("Error resending reward: ", error);
            toast.error(this.props.localization.toast.rewards.notResent)
            this.setState({
                resendButtonLabel: this.props.localization.interaction.rewards.buttonLabelCannotResend
            })
        })
    }

    toggleConfirm = () => {
        this.setState({confirmVisible: !this.state.confirmVisible})
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
                        <MDBBox className="p-2 d-flex">
                            <span className="fa-layers fa-fw fa-3x mt-2">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                <FontAwesomeIcon icon={faGift} transform={"shrink-8"} className={"darkIcon"}/>
                            </span>
                            <div className="d-flex flex-grow-1 p-2 flex-column text-left">
                                <span className="f-l font-weight-bold">{this.props.reward.campaign} / {localization.amountDisplay.replace(";", this.props.reward.amount)}</span>
                                <div>{localization.sentTo}{this.props.reward.original_sent_to}</div>
                                {this.props.reward.last_sent_to && <div>{localization.lastResentTo}{this.props.reward.last_sent_to}</div>}
                                <div><MDBBtn rounded onClick={this.toggleConfirm} className="btn-primary" disabled={this.state.disableResend}>{this.state.resendButtonLabel}</MDBBtn></div>
                                {!this.props.reward.resendable && <div className="text-muted font-italic">{localization.timelockMessage}</div>}
                            </div>

                        </MDBBox>
                        <MDBBox className="ml-auto d-flex p-2 f-s flex-column text-right justify-content-start grey-text">
                            <span className="font-weight-bold skin-secondary-color">{this.props.reward.status}</span>
                            {resendTime && <span>{localization.lastResentAt}<span
                                className="font-weight-bold">{resendTime.format("MMM D")}</span>, {resendTime.format("h:mm a z")}</span>}
                            <span>{localization.createdAt} <span
                                className="font-weight-bold">{rewardTime.format("MMM D")}</span>, {rewardTime.format("h:mm a z")}</span>
                        </MDBBox>
                    </div>
                </MDBBox>
                <MDBModal isOpen={this.state.confirmVisible} toggle={this.toggleConfirm} size="lg" >
                    <MDBModalHeader>{localization.confirmTitle}</MDBModalHeader>
                    <MDBModalBody >
                        <p>{localization.confirmEmail.replace('$', this.props.lead.details.email)}</p>
                    </MDBModalBody>
                    <MDBModalFooter className="p-1 d-flex justify-content-end">

                        <MDBBtn color="secondary"
                                rounded
                                outline
                                onClick={this.toggleConfirm}>
                            {this.props.localization.buttonLabels.cancel}
                        </MDBBtn>
                        <MDBBtn color="secondary"
                                rounded
                                onClick={this.resendReward}>
                            {this.props.localization.buttonLabels.send}
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModal>

            </MDBCard>
        )
    }


}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead: state.lead,
        shift: state.shift,
        interaction: state.interaction,
        user: state.user
    }
}

export default connect(mapStateToProps)(Reward)