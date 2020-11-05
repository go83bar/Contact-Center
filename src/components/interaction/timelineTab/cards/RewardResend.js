import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle as faCircleSolid, faGift,
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";

class RewardResend extends Component {


    render() {
        const localization = this.props.localization.interaction.timeline.rewardResend

        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm pb-2">
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faGift} transform={"shrink-8"}/>
                        </span>
                        <div className="d-flex flex-grow-1 p-2 flex-column text-left">
                            <div className="f-l font-weight-bold">
                                {this.props.data.reward_campaign} / {localization.resentLabel}
                            </div>
                            <div>{localization.sentTo}{this.props.data.sent_to}</div>
                        </div>
                        <div className="d-flex ml-auto f-s flex-column text-right justify-content-start">
                            <span>{localization.createdAt} <span
                                className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("h:mm a z")}</span>
                        </div>
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

export default connect(mapStateToProps)(RewardResend);
