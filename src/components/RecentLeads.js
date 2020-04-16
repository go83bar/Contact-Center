import React, {Component} from 'react'
import {MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle} from "mdbreact"
import AgentAPI from '../api/agentAPI';
import LoadingScreen from './LoadingScreen'
import SearchResults from './search/SearchResults'
import { connect } from 'react-redux';
import CircularSideNav from "./CircluarSideNav/CircularSideNav";

class RecentLeads extends Component {

    constructor(props) {
        super(props);

        AgentAPI.getRecentLeads(this.props.auth.auth)
            .then((response) => {
                if (response.success) {
                    this.setState({
                        recentData: response.data
                    })
                }
            }).catch((reason) => {
                // TODO HANDLE ERRORS
                console.log("BAMF")
                console.log(reason)
            })

        this.state = {
        };


    }

    render() {
        if (this.state.recentData === undefined) {
            return <LoadingScreen />
        }
        return (
            <MDBRow center>
                <MDBCol size="12">
                    <CircularSideNav
                        backgroundImg={"/images/nav.png"}
                        backgroundColor={'#E0E0E0'}
                        color={'#7c7c7c'}
                        navSize={16}
                        animation={''}
                        animationPeriod={0.04}
                    />
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle>Recent Leads</MDBCardTitle>
                            <SearchResults results={this.state.recentData} />
                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>
            </MDBRow>
        )
    }
}
const mapStateToProps = state => {
    return { auth: state.auth, localization : state.localization, previewData: state.preview }
}

const mapDispatchToProps = dispatch => { return { dispatch }}

export default connect(mapStateToProps, mapDispatchToProps)(RecentLeads);
