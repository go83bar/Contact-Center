import React, {Component} from 'react'
import {MDBCardBody, MDBCard, MDBCardText, MDBContainer, MDBCol, MDBRow, MDBIcon, MDBBtn} from "mdbreact";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

class Home extends Component {

    constructor(props) {
        super(props);

        this.logout=this.logout.bind(this)
        this.state = {};
    }

    logout(){
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
                                    <Link to="/interaction"><MDBBtn floating><MDBIcon icon={"headphones"} size={"2x"}/></MDBBtn><br/>{localization.fetch}</Link>

                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBCard style={{width: "100%", height: "15rem"}}>
                            <MDBCardBody style={{marginTop: "50px"}}>
                                <MDBCardText style={{fontSize: "20px"}}>
                                <Link to="/search"><MDBBtn floating><MDBIcon icon={"search"}
                                                                             size={"2x"}/></MDBBtn><br/>{localization.search}</Link>
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
                                <Link to="/recent" ><MDBBtn floating><MDBIcon icon={"list"} size={"2x"}/></MDBBtn><br/>{localization.recent}</Link>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol md='4'>
                        <MDBCard style={{width: "100%", height: "15rem"}}>
                            <MDBCardBody style={{marginTop: "50px"}}>
                                <MDBCardText style={{fontSize: "20px"}}>
                                    <Link to="#" onClick={this.logout}><MDBBtn floating onClick={this.logout}><MDBIcon icon={"lock"} size={"2x"}/></MDBBtn><br/>{localization.logout}</Link>
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
