import React, {Component} from 'react'
import {MDBContainer} from "mdbreact";
import LeadSummary from "./Interaction/LeadSummary";
import LeadDetail from "./Interaction/LeadDetail";
import CallBar from "./Interaction/CallBar";
import {connect} from "react-redux";
import LoadingScreen from './LoadingScreen';

class Interaction extends Component {

    constructor(props) {
        super(props);
        this.toggleCallBar=this.toggleCallBar.bind(this)
        this.state = {
            callBarVisible : true
        };

    }

    toggleCallBar() {
        this.setState({callBarVisible : !this.state.callBarVisible})
    }

    render() {
        if (this.props.lead === undefined) {
            return <LoadingScreen />
        }

        return (
            <MDBContainer fluid className={"p-0"}>
                <LeadSummary toggleCallBar={this.toggleCallBar}/>
                <MDBContainer fluid className="d-flex p-0 pt-3 flex-row">
                        <LeadDetail/>
                        <CallBar toggleCallBar={this.toggleCallBar} callBarVisible={this.state.callBarVisible}/>
                </MDBContainer>
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
