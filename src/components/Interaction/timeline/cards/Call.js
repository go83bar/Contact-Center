import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faCircle as faCircleSolid,
    faPhone, faPlay
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import ReactPlayer from "react-player/lazy";

class Call extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse=this.toggleCollapse.bind(this)

        this.state = {
            collapsed : true
        }

    }
    toggleCollapse() {
        this.setState({collapsed : !this.state.collapsed})
    }

    render() {
        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm"
                                   onClick={this.toggleCollapse}
                >
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l">
                                <FontAwesomeIcon className="ml-1 skin-primary-color" icon={faArrowRight} size="sm"/>
                                <span className="px-3 font-weight-bold">00:12:05</span>|
                                <FontAwesomeIcon className="ml-2 skin-primary-color" icon={faPlay} size="sm"/>
                            </span>
                            <span>Provider Connection</span>
                        </div>
                        <div>
                            <ReactPlayer url="http://www.hyperion-records.co.uk/audiotest/18%20MacCunn%20The%20Lay%20of%20the%20Last%20Minstrel%20-%20Part%202%20Final%20chorus%20O%20Caledonia!%20stern%20and%20wild.MP3"/>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                        </div>
                    </div>
                </MDBBox>
            </MDBCard>

        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(Call);
