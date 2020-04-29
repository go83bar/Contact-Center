import React, { Component } from 'react'
import {MDBBox, MDBCard, MDBCardBody, MDBCollapse, MDBIcon} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid, faEnvelope, faEnvelopeOpen} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";

class Email extends Component {

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
                            <FontAwesomeIcon icon={faEnvelope} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l font-weight-bold">Subject</span>
                            <span>View full email <FontAwesomeIcon className="ml-1" icon={faEnvelopeOpen} size="sm"/></span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-between">
                            <span><span className="font-weight-bold">FEB 20</span>, 10:44am EST</span>
                            <span><MDBIcon className="m-2" size={"lg"} icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/></span>
                        </div>
                    </div>
                </MDBBox>
                <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height:"2px", backgroundColor:"#DCE0E3", borderTop : 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary">
                        Pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. 3 wolf moon officia aute, non
                        cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
                        laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a
                        bird on it squid single-origin coffee nulla assumenda shoreditch
                        et. Nihil anim keffiyeh helvetica, craft beer labore wes
                        anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
                        butcher vice lomo. Leggings occaecat craft beer farm-to-table,
                        raw denim aesthetic synth nesciunt you probably haven&apos;t
                        heard of them accusamus labore sustainable VHS.
                    </MDBCardBody>
                </MDBCollapse>
            </MDBCard>

        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(Email);
