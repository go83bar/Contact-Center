import React, { Component } from 'react'
import {MDBBox, MDBCard, MDBCollapse, MDBCardBody} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faPhone} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import ReactPlayer from "react-player/lazy";

class AgentCall extends Component {

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
                            <span className="font-weight-bold px-3">Agent Call</span>
                            <span className="f-l">
                                <span className="px-3">{this.props.data.duration} | {this.props.data.recording_url === undefined ? "No Recording" : "Has recording"}</span>
                            </span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                        </div>
                    </div>
                </MDBBox>
                <MDBCollapse isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height: "2px", backgroundColor: "#DCE0E3", borderTop: 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary d-flex pt-3 px-3 pb-0">
                        <MDBBox className="w-50">
                            <h5>Connections</h5>
                            {this.props.data.connections && this.props.data.connections.map( connection => {
                                return (
                                    <div className="d-flex justify-content-between">
                                        <span>{connection.direction === "outgoing" ? "Outgoing to " : "Incoming from "}{connection.party.toUpperCase()}</span>
                                        <span>{connection.duration}</span>
                                    </div>
                                )
                            })}
                        </MDBBox>
                        {this.props.data.recording_url && !this.state.collapsed &&<MDBBox className="w-50 d-flex align-items-start justify-content-end">
                             <ReactPlayer
                                width="240px"
                                height="60px"
                                controls={true}
                                config={{file: {forceAudio: true, attributes: {controlslist: "nodownload"}}}}
                                url={this.props.data.recording_url + "?auth_token=" + this.props.user.auth.token + "&user_id=" + this.props.user.id}
                            />
                        </MDBBox>}
                    </MDBCardBody>
                </MDBCollapse>

            </MDBCard>

        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization,
        user: store.user
    }
}

export default connect(mapStateToProps)(AgentCall);
