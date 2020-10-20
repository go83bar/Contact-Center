import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle as faCircleSolid, faGift,
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import moment from "moment-timezone";

class Reward extends Component {


    render() {
        const localization = this.props.localization.interaction.timeline.reward
        let resendTime = moment()
        if (this.props.reward.last_resent_at) {
            resendTime = moment.utc(this.props.reward.last_resent_at).tz(this.props.lead.details.timezone)
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
                            </div>

                        </MDBBox>
                        <MDBBox className="d-flex w-25 p-2 f-s flex-column text-right justify-content-start grey-text">
                            {resendTime && <span>{localization.lastResentAt}<span
                                className="font-weight-bold">{resendTime.format("MMM D")}</span>, {resendTime.format("h:mm a z")}</span>}
                            <span>{localization.createdAt} <span
                                className="font-weight-bold">{this.props.reward.created_at.format("MMM D")}</span>, {this.props.reward.created_at.format("h:mm a z")}</span>
                        </MDBBox>
                    </div>
                </MDBBox>
            </MDBCard>
        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization,
        lead: store.lead
    }
}

export default connect(mapStateToProps)(Reward);
