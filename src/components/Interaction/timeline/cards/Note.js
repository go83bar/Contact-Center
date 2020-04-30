import React, { Component } from 'react'
import {MDBBox, MDBCard} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid,faStickyNote} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";

class Note extends Component {

    constructor(props) {
        super(props)
        //this.toggleCollapse=this.toggleCollapse.bind(this)

        this.state = {
           // collapsed : true
        }

    }
  /*  toggleCollapse() {
        this.setState({collapsed : !this.state.collapsed})
    }*/

    render() {
        /*
                                this was on the MDBBox:           onClick={this.toggleCollapse}


                    this was below Created By:        <span><MDBIcon className="m-2" size={"lg"} icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/></span>

        this was after the MDBBox:                <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height:"2px", backgroundColor:"#DCE0E3", borderTop : 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary">
                        Content Here
                    </MDBCardBody>
                </MDBCollapse>
*/
        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm">
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x my-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faStickyNote} transform={"shrink-8"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="">{this.props.data.content}</span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-start">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                            <span>{this.props.localization.created_by}: {this.props.data.created_by}</span>
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

export default connect(mapStateToProps)(Note);
