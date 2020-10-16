import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
//    faArrowRight, faArrowLeft,
    faCircle as faCircleSolid, faComment
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";


class Text extends Component {

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

/*
                            <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">
                                <FontAwesomeIcon icon={this.props.data.direction === "outgoing" ? faArrowRight : faArrowLeft} className="skin-text"/>
                            </span>

 */
    render() {
        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm"
                                   onClick={this.toggleCollapse}
                >
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x my-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            {this.props.data.direction === "incoming" ? <FontAwesomeIcon icon={faComment} className={"skin-primary-color"}  flip="horizontal" transform={"shrink-8"}/> :
                            <FontAwesomeIcon icon={faComment} className={"skin-secondary-color"} transform={"shrink-8"}/>}
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l">
                                {this.props.data.content}
                            </span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                            {this.props.data.created_by && <span>{this.props.localization.created_by}: {this.props.data.created_by}</span>}
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

export default connect(mapStateToProps)(Text);
