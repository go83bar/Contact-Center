import React, {Component} from 'react'
import {MDBBox, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBProgress} from "mdbreact";
import {connect} from "react-redux";
import CircularSideNav from "./CircluarSideNav/CircularSideNav";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faCalendarCheck, faHandPaper, faPhone} from "@fortawesome/pro-solid-svg-icons";

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
        const localization = this.props.localization.home
        return (
            <MDBBox>
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
                        <MDBRow style={{textAlign: "center"}}>
                            <MDBCol md='12' className="mb-5" style={{marginTop: "20%"}}>
                                <h1>Hi Agent! You have new leads!</h1>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow style={{marginTop: "50px"}}>
                            <MDBCol size={"4"} className='mb-5'>
                                <MDBCard cascade className='cascading-admin-card'>
                                    <MDBRow className='mt-3'>
                                        <MDBCol md='3' size='3' className='text-left pl-4'>
                                            <span className="fa-layers fa-fw fa-4x">
                                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                                <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                            </span>
                                        </MDBCol>
                                        <MDBCol md='9' col='9' className='text-right pr-5'>
                                            <p>{localization.interactions}</p>
                                            <h4 className='font-weight-bold dark-grey-text'>20</h4>
                                        </MDBCol>
                                    </MDBRow>
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
                            <MDBCol size={"4"} className='mb-5'>
                                <MDBCard cascade className='cascading-admin-card'>
                                    <MDBRow className='mt-3'>
                                        <MDBCol md='3' size='3' className='text-left pl-4'>
                                            <span className="fa-layers fa-fw fa-4x">
                                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                                <FontAwesomeIcon icon={faCalendarCheck} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                            </span>
                                        </MDBCol>
                                        <MDBCol md='9' col='9' className='text-right pr-5'>
                                            <p>{localization.appointments}</p>
                                            <h4 className='font-weight-bold dark-grey-text'>5</h4>
                                        </MDBCol>
                                    </MDBRow>
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
                            <MDBCol size={"4"} className='mb-5'>
                                <MDBCard cascade className='cascading-admin-card'>
                                    <MDBRow className='mt-3'>
                                        <MDBCol md='3' size='3' className='text-left pl-4'>
                                            <span className="fa-layers fa-fw fa-4x">
                                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                                <FontAwesomeIcon icon={faHandPaper} transform={"shrink-8"} className={"skin-secondary-color"}/>
                                            </span>
                                        </MDBCol>
                                        <MDBCol md='9' col='9' className='text-right pr-5'>
                                            <p>{localization.handoffs}</p>
                                            <h4 className='font-weight-bold dark-grey-text'>3</h4>
                                        </MDBCol>
                                    </MDBRow>
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
                    </MDBCol>
                </MDBRow>
            </MDBBox>
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
