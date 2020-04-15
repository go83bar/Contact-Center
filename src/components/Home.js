import React, {Component} from 'react'
import {MDBContainer, MDBCol, MDBRow, MDBCard, MDBIcon, MDBCardBody, MDBProgress} from "mdbreact";
import {connect} from "react-redux";
import CircularSideNav from "./CircluarSideNav/CircularSideNav";
//import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
//import {faCircle} from "@fortawesome/pro-light-svg-icons";
//import {faPhone, faCalendarCheck, faHandPaper} from "@fortawesome/pro-solid-svg-icons";
//import {faCircle} from "@fortawesome/pro-light-svg-icons";

class Home extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this)
        this.state = {};
    }

    logout() {
        this.props.dispatch({type: 'LOG_OUT_USER', payload: {}})
    }

    render() {
        //const localization = this.props.localization.home
        return (
            <MDBContainer>
                <CircularSideNav
                    backgroundImg={"/images/nav.png"}
                    backgroundColor={'#E0E0E0'}
                    color={'#7c7c7c'}
                    navSize={16}
                    animation={''}
                    animationPeriod={0.04}
                />
                <MDBRow style={{marginTop: "50px"}}>
                    <MDBCol size={"3"} className='mb-5 offset-2'>
                        <MDBCard cascade className='cascading-admin-card'>
                            <div className='admin-up'>
                                <MDBIcon
                                    icon='phone-alt'
                                    className='far primary-color mr-3 z-depth-2'
                                />
                                <div className='data'>
                                    <p>INTERACTIONS<br/> MADE TODAY</p>
                                    <h4 className='font-weight-bold dark-grey-text'>2000</h4>
                                </div>
                            </div>
                            <MDBCardBody cascade>
                                <MDBProgress
                                    value={25}
                                    barClassName='primary-color'
                                    height='6px'
                                    wrapperStyle={{ opacity: '.7' }}
                                    className='mb-3'
                                />
                                <p className='card-text'>Better than last week (25%)</p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size={"3"} className='mb-5'>
                        <MDBCard cascade className='cascading-admin-card'>
                            <div className='admin-up'>
                                <MDBIcon
                                    icon='calendar-check'
                                    className='far primary-color mr-3 z-depth-2'
                                />
                                <div className='data'>
                                    <p>APPOINTMENTS<br/>BOOKED</p>
                                    <h4 className='font-weight-bold dark-grey-text'>2000</h4>
                                </div>
                            </div>
                            <MDBCardBody cascade>
                                <MDBProgress
                                    value={25}
                                    barClassName='primary-color'
                                    height='6px'
                                    wrapperStyle={{ opacity: '.7' }}
                                    className='mb-3'
                                />
                                <p className='card-text'>Better than last week (25%)</p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size={"3"} className='mb-5'>
                        <MDBCard cascade className='cascading-admin-card'>
                            <div className='admin-up'>
                                <MDBIcon
                                    icon='hand-paper'
                                    className='far primary-color mr-3 z-depth-2'
                                />
                                <div className='data'>
                                    <p>HANDOFFS<br/> MADE</p>
                                    <h4 className='font-weight-bold dark-grey-text'>2000</h4>
                                </div>
                            </div>
                            <MDBCardBody cascade>
                                <MDBProgress
                                    value={25}
                                    barClassName='primary-color'
                                    height='6px'
                                    wrapperStyle={{ opacity: '.7' }}
                                    className='mb-3'
                                />
                                <p className='card-text'>Better than last week (25%)</p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                </MDBRow>
                <MDBRow style={{textAlign: "center"}}>

                    <MDBCol md='6' className={"offset-md-3"}>
                        <h1>Hi Agent! You have new leads!</h1>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
