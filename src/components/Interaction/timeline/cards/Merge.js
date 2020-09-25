import React, { Component } from 'react'
import {MDBBox, MDBCard, MDBCardBody, MDBCollapse, MDBIcon} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle as faCircleSolid, faCodeMerge
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import String from "../../../../utils/String";

class Merge extends Component {

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
                            <FontAwesomeIcon icon={faCodeMerge} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l">
                                {this.props.localization.interaction.timeline.leadMerge}
                            </span>
                            <span className="p-2">
                                { this.props.data.direction === "target" ?
                                    this.props.localization.interaction.timeline.merge.targetMergeDescription.replace("$", this.props.data.source_lead_id) :
                                    this.props.localization.interaction.timeline.merge.sourceMergeDescription.replace("$", this.props.data.target_lead_id)
                                }
                            </span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("h:mm a z")}</span>
                            {this.props.data.merged_by && <span>{this.props.localization.created_by}: {this.props.data.merged_by}</span>}
                            {this.props.data.direction === "target" && <MDBIcon className="m-2" size={"lg"} icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/>}
                        </div>
                    </div>
                </MDBBox>
                {this.props.data.direction === "target" &&<MDBCollapse id='collapsed' isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height: "2px", backgroundColor: "#DCE0E3", borderTop: 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary pt-3 px-3 pb-0">
                        <div className="p-2 mb-2">{this.props.localization.interaction.timeline.merge.sourceDetails}</div>
                        <div className="p-2">
                            {this.props.data.source.name && this.props.data.source.name.length > 0 && <div>{this.props.data.source.name}</div>}
                            {this.props.data.source.email && this.props.data.source.email.length > 0 && <div>{this.props.data.source.email}</div>}
                            {this.props.data.source.cell_phone && this.props.data.source.cell_phone.length > 0 && <div>{this.props.localization.interaction.details.cellPhoneLabel}{String.formatPhoneNumber(this.props.data.source.cell_phone)}</div>}
                            {this.props.data.source.home_phone && this.props.data.source.home_phone.length > 0 && <div>{this.props.localization.interaction.details.homePhoneLabel}{String.formatPhoneNumber(this.props.data.source.home_phone)}</div>}
                            {this.props.data.source.address && this.props.data.source.address.length > 0 && <div>{this.props.data.source.address}</div>}
                        </div>

                    </MDBCardBody>
                </MDBCollapse>}
            </MDBCard>

        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(Merge);
