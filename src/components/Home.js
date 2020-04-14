import React, {Component} from 'react'
import {MDBCardBody, MDBCard, MDBCardText, MDBContainer, MDBCol, MDBRow} from "mdbreact";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {faHeadphones, faList, faLock, faSearch} from "@fortawesome/pro-solid-svg-icons";

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
            <MDBContainer>
                <MDBRow style={{textAlign: "center", marginTop: "20%"}}>
                    <MDBCol md='4' className={"offset-md-2"}>
                        <MDBCard style={{width: "100%", height: "15rem"}}>
                            <MDBCardBody style={{marginTop: "50px"}}>
                                <MDBCardText style={{fontSize: "20px"}}>
                                    <Link to="/interaction" className={"dark"}>
                                        <span className="fa-layers fa-fw fa-3x">
                                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                                            <FontAwesomeIcon icon={faHeadphones} transform={"shrink-8"} className={"darkIcon"}/>
                                        </span>
                                        <br/>{localization.fetch}</Link>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBCard style={{width: "100%", height: "15rem"}}>
                            <MDBCardBody style={{marginTop: "50px"}}>
                                <MDBCardText style={{fontSize: "20px"}}>
                                    <Link to="/search" className={"dark"}>
                                        <span className="fa-layers fa-fw fa-3x">
                                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                                            <FontAwesomeIcon icon={faSearch} transform={"shrink-8"} className={"darkIcon"}/>
                                        </span>
                                        <br/>{localization.search}
                                    </Link>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow style={{textAlign: "center", marginTop: "30px"}}>

                    <MDBCol md='4' className={"offset-md-2"}>
                        <MDBCard style={{width: "100%", height: "15rem"}}>
                            <MDBCardBody style={{marginTop: "50px"}}>
                                <MDBCardText style={{fontSize: "20px"}}>
                                    <Link to="/recent" className={"dark"}>
                                        <span className="fa-layers fa-fw fa-3x">
                                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                                            <FontAwesomeIcon icon={faList} transform={"shrink-8"} className={"darkIcon"}/>
                                        </span>
                                        <br/>{localization.recent}
                                    </Link>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBCard style={{width: "100%", height: "15rem"}}>
                            <MDBCardBody style={{marginTop: "50px"}}>
                                <MDBCardText style={{fontSize: "20px"}}>
                                    <Link to="#" onClick={this.logout} className={"dark"}>
                                        <span className="fa-layers fa-fw fa-3x">
                                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                                            <FontAwesomeIcon icon={faLock} transform={"shrink-8"} className={"darkIcon"}/>
                                        </span>
                                        <br/>{localization.logout}</Link>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
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
