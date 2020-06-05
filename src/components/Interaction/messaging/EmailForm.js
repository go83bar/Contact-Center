import React, { Component } from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBInput,
    MDBSelect
} from "mdbreact"

import {connect} from "react-redux"
import {faTimes} from "@fortawesome/pro-solid-svg-icons"
import Draggable from 'react-draggable'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import MDBWysiwyg from 'mdb-react-wysiwyg'

class EmailForm extends Component {
    render() {
        return(
            <Draggable handle={".card-header"}>
                <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"520px",right:8, top:70}}>
                    <MDBCardHeader className="skin-secondary-background-color skin-text">Send Email
                        <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.props.toggle}/>
                    </MDBCardHeader>
                    <MDBCardBody className="px-3 py-0">
                        <MDBSelect selected={"Choose a template"} label={"Template"}/>
                        <MDBInput label="Subject"/>
                        <MDBWysiwyg />
                    </MDBCardBody>
                    <MDBCardFooter className="d-flex justify-content-end">
                        <MDBBtn rounded outline onClick={this.props.toggle}>Cancel</MDBBtn>
                        <MDBBtn rounded onClick={this.props.toggle}>Send</MDBBtn>
                    </MDBCardFooter>
                </MDBCard>
            </Draggable>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead : state.lead
    }
}

export default connect(mapStateToProps)(EmailForm);
