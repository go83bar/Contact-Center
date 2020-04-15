import React, {Component} from 'react'
import {MDBContainer} from "mdbreact";
import LeadSummary from "./Interaction/LeadSummary";
import LeadDetail from "./Interaction/LeadDetail";
import CallBar from "./Interaction/CallBar";
import {connect} from "react-redux";

class Interaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

        fetch(window.location.protocol + "//" + window.location.host + "//leadDTO.json")
            .then(response => response.json())
            .then((responseJson) => {
                this.props.dispatch({type: 'LEAD.LOADSAMPLE',payload: responseJson})
            })

    }

    render() {
        return (
            <MDBContainer fluid className={"p-0"}>
                <LeadSummary/>
                <CallBar/>
                <LeadDetail/>
            </MDBContainer>
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

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Interaction);
