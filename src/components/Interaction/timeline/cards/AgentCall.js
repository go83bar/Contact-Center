import React, { Component } from 'react'
import {MDBBox, MDBCard, MDBCollapse, MDBCardBody} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faPhone, faPlay} from "@fortawesome/pro-solid-svg-icons";
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

    generateConnectionsString = () => {
        let hasLeadConnection = false
        let hasProviderConnection = false
        let connectionString = []
        let providerList = []
        this.props.data.connections && this.props.data.connections.forEach( connection => {
            if (connection.party === "lead") hasLeadConnection = true
            if (connection.party === "provider") {
                hasProviderConnection = true
                if (connection.office_id !== undefined) {
                    let office = this.props.shift.clients[this.props.lead.client_index].offices.find( office => office.id === connection.office_id)
                    if (office) providerList.push(office.name)
                }
            }
        })

        if (hasLeadConnection) connectionString.push("Lead Connection")
        if (hasProviderConnection) {
            if (providerList.length > 1) {
                connectionString.push("Provider Connections to " + providerList.join(", "))
            } else if (providerList.length === 1) {
                connectionString.push("Provider Connection to " + providerList[0])
            } else {
                connectionString.push("Provider Connection")
            }
        }
        return connectionString.join(", ")
    }

    render() {
        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm">
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="font-weight-bold px-3">Agent Call</span>
                            <span>
                                <span className="px-3">{this.props.data.duration} | {this.props.data.recording_url === undefined ? "No Recording" : <FontAwesomeIcon className="skin-primary-color" icon={faPlay} size="sm" onClick={this.toggleCollapse} />}</span>
                            </span>
                            <MDBBox className="px-3">
                                {this.generateConnectionsString()}
                            </MDBBox>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                        </div>
                    </div>
                </MDBBox>
                <MDBCollapse isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height: "2px", backgroundColor: "#DCE0E3", borderTop: 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary d-flex pt-3 px-3 pb-0">
                        {this.props.data.recording_url && !this.state.collapsed &&<MDBBox className="w-100 d-flex align-items-start justify-content-end">
                             <ReactPlayer
                                width="100%"
                                height="60px"
                                playing={true}
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
const mapStateToProps = state => {
    return {
        localization: state.localization,
        user: state.user,
        shift: state.shift,
        lead: state.lead
    }
}

export default connect(mapStateToProps)(AgentCall);
