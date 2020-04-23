import React, {Component} from 'react'
import {MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBBox} from "mdbreact"
import AgentAPI from '../api/agentAPI';
import LoadingScreen from './LoadingScreen'
import SearchResults from './search/SearchResults'
import { connect } from 'react-redux';
import CircularSideNav from "./CircluarSideNav/CircularSideNav";

class RecentLeads extends Component {

    constructor(props) {
        super(props);

        AgentAPI.getRecentLeads()
            .then((response) => {
                if (response.success) {
                    const searchifiedResults = response.data.map( (item) => {
                        item.id = item.lead_id
                        return item
                    })
                    this.setState({
                        recentData: searchifiedResults
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
            <MDBBox className="w-100 skin-secondary-color">
                <MDBRow>
                    <MDBCol size="3">
                        <CircularSideNav
                            backgroundImg={"/images/nav.png"}
                            backgroundColor={'#E0E0E0'}
                            color={'#7c7c7c'}
                            navSize={16}
                            animation={''}
                            animationPeriod={0.04}
                        />
                    </MDBCol>
                    <MDBCol size="7">
                        <MDBCard style={{marginTop: "10%"}}>
                            <MDBCardBody>
                                <MDBCardTitle>Recent Leads</MDBCardTitle>
                                <SearchResults results={this.state.recentData} />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBBox>
        )
    }
}
const mapStateToProps = state => {
    return { localization : state.localization, previewData: state.preview }
}

const mapDispatchToProps = dispatch => { return { dispatch }}

export default connect(mapStateToProps, mapDispatchToProps)(RecentLeads);
