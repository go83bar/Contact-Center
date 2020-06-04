import React, {Component} from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBSelect
} from "mdbreact"
import {connect} from "react-redux"
import {faTimes} from "@fortawesome/pro-solid-svg-icons"
import Draggable from 'react-draggable'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

class TextForm extends Component {

    render() {
        return(
            <Draggable handle={".card-header"}>
                <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"370px",right:8, top:370}}>
                    <MDBCardHeader className="skin-secondary-background-color skin-text">Send Text
                        <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.props.toggle}/>
                    </MDBCardHeader>
                    <MDBCardBody className="px-3 py-0">
                        <MDBSelect selected={"Choose a template"} label={"Template"}/>
                        <div className="md-form">
                            <textarea className="md-textarea form-control" rows="3" placeholder={"Add text here."}></textarea>
                        </div>
                    </MDBCardBody>
                    <MDBCardFooter className="d-flex justify-content-end">
                        <MDBBtn outline rounded onClick={this.props.toggle}>Cancel</MDBBtn>
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

export default connect(mapStateToProps)(TextForm);
