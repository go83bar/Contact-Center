import React, {Component} from 'react'
import {
    MDBBox,

    MDBCard,
    MDBCardBody,
    MDBProgress,

    MDBModal,
    MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn
} from "mdbreact";
import {connect} from "react-redux";
//import CircularSideNav from "./CircluarSideNav/CircularSideNav";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle as faCircleSolid,
    faCalendarCheck,
    faHandPaper,
    faPhone,
    faHeadphones, faSearch, faList, faSignOut, faUserCircle
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {Link} from "react-router-dom";

import { WidthProvider, Responsive } from "react-grid-layout";
//import SearchResults from "./search/SearchResults";
import RecentLeads from "./RecentLeads";
import Search from "./search/Search";
import Profile from "./Profile";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Home extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this)
        this.toggleRecent = this.toggleRecent.bind(this)
        this.toggleSearch = this.toggleSearch.bind(this)
        this.toggleProfile = this.toggleProfile.bind(this)
        this.state = {
            showRecent : false,
            showSearch : false,
            showProfile : false
        };
    }

    logout() {
        this.props.dispatch({type: 'LOG_OUT_USER', payload: {}})
    }

    toggleRecent() {
        this.setState({showRecent : !this.state.showRecent})
    }
    toggleSearch() {
        this.setState({showSearch : !this.state.showSearch})
    }
    toggleProfile() {
        this.setState({showProfile : !this.state.showProfile})
    }

    profileClick() {

    }


    render() {
        const localization = this.props.localization.home

        return (
            <MDBBox className="d-flex flex-column w-100 justify-content-start skin-secondary-color mx-5">
                <MDBBox className="d-flex w-100 skin-secondary-background-color skin-text align-items-center p-1 f-l">
                    <MDBBox className="d-flex w-50 ml-4 align-items-center">
                        <img src={"/images/83Bar-white.png"} alt="logo" className="img-fluid m-1 mr-4"
                             style={{height: "48px"}}/>
                        <span>Welcome Agent!</span>
                    </MDBBox>
                    <MDBBox className="d-flex justify-content-end w-50 mr-4 align-items-center">
                        <Link to="#" onClick={this.toggleProfile} className="f-xl px-3">
                            <span className="fa-layers fa-fw fa-2x m-0">
                                <FontAwesomeIcon icon={faCircle} className={"skin-text"}/>
                                <FontAwesomeIcon icon={faUserCircle} transform={"shrink-6"}  className={"skin-text"}/>
                            </span>
                        </Link>
                        <Link to="#" onClick={this.logout} className="rounded-pill red-darken-2 p-2 px-4">
                            <span className="pr-2">
                                <FontAwesomeIcon icon={faSignOut} size="lg" className={"skin-text"}/>
                            </span><span className="skin-text">{localization.signout}</span>
                        </Link>

                    </MDBBox>
                </MDBBox>
                <MDBBox className="w-100 h-50 mt-3">
                    <ResponsiveReactGridLayout
                        className="layout"
                        cols={{ lg: 13, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={30}
                        layouts={this.state.layouts}
                    >
                        <MDBCard key="fetch" className="shadow-sm px-3 py-4" data-grid={{ w: 3, h: 3, x: 1, y: 1, minW: 3, minH: 3, isResizable : false, isDraggable : false }}>
                            <Link to="/next" className="d-flex skin-secondary-color align-items-center justify-content-between">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faHeadphones} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                                <span className="">FETCH NEW LEAD</span>
                            </Link>
                        </MDBCard>
                        <MDBCard key="find" className="shadow-sm px-3 py-4" data-grid={{ w: 3, h: 3, x: 5, y: 1, minW: 3, minH: 3, isResizable : false, isDraggable : false  }}>
                            <Link to="#" onClick={this.toggleSearch} className="d-flex skin-secondary-color align-items-center justify-content-between">
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                            <FontAwesomeIcon icon={faSearch} transform={"shrink-8"} className={"skin-text"}/>
                        </span><span>FIND A LEAD</span>
                            </Link>
                        </MDBCard>
                        <MDBCard key="recent" className="shadow-sm px-3 py-4" data-grid={{ w: 3, h: 3, x: 9, y: 1, minW: 3, minH: 3, isResizable : false, isDraggable : false  }}>
                            <Link to="#" onClick={this.toggleRecent} className="d-flex skin-secondary-color align-items-center justify-content-between">
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                            <FontAwesomeIcon icon={faList} transform={"shrink-8"} className={"skin-text"}/>
                        </span><span>RECENT LEADS</span>
                            </Link>
                        </MDBCard>
                        <MDBCard cascade key="1" className='cascading-admin-card shadow-sm' data-grid={{ w: 3, h: 5, x: 1, y: 6, minW: 3, minH: 5}}>
                                <MDBBox className='d-flex justify-content-between pl-3 mt-3'>
                                            <span className="fa-layers fa-fw fa-4x">
                                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                                <FontAwesomeIcon icon={faPhone} transform={"shrink-8"}
                                                                 className={"skin-secondary-color"}/>
                                            </span>
                                <MDBBox className='text-right pr-3'>
                                    <p>{localization.interactions}</p>
                                    <h4 className='font-weight-bold dark-grey-text'>20</h4>
                                </MDBBox>
                                </MDBBox>
                            <MDBCardBody cascade>
                                <MDBProgress
                                    value={25}
                                    barClassName='primary-color'
                                    height='6px'
                                    wrapperStyle={{opacity: '.7'}}
                                    className='mb-3'
                                />
                                <p className='card-text'>Better than last week (25%)</p>
                            </MDBCardBody>
                        </MDBCard>
                            <MDBCard key="2" cascade className='cascading-admin-card shadow-sm' data-grid={{ w: 3, h: 5, x: 5, y: 6, minW: 3, minH: 5 }}>
                                    <MDBBox className='d-flex justify-content-between pl-3 mt-3'>
                                            <span className="fa-layers fa-fw fa-4x">
                                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                                <FontAwesomeIcon icon={faCalendarCheck} transform={"shrink-8"}
                                                                 className={"skin-secondary-color"}/>
                                            </span>
                                        <MDBBox className='text-right pr-3'>
                                            <p>{localization.appointments}</p>
                                            <h4 className='font-weight-bold dark-grey-text'>3</h4>
                                        </MDBBox>
                                    </MDBBox>
                                <MDBCardBody cascade>
                                    <MDBProgress
                                        value={25}
                                        barClassName='primary-color'
                                        height='6px'
                                        wrapperStyle={{opacity: '.7'}}
                                        className='mb-3'
                                    />
                                    <p className='card-text'>Better than last week (25%)</p>
                                </MDBCardBody>
                            </MDBCard>
                        <MDBCard cascade key="3" className='cascading-admin-card shadow-sm' data-grid={{ w: 3, h: 5, x: 9, y: 6, minW: 3, minH: 5 }}>
                                <MDBBox className='d-flex justify-content-between mt-3 pl-3'>
                                            <span className="fa-layers fa-fw fa-4x">
                                                <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                                                <FontAwesomeIcon icon={faHandPaper} transform={"shrink-8"}
                                                                 className={"skin-secondary-color"}/>
                                            </span>
                                    <MDBBox className='text-right pr-3'>
                                        <p>{localization.handoffs}</p>
                                        <h4 className='font-weight-bold dark-grey-text'>3</h4>
                                    </MDBBox>
                                </MDBBox>
                            <MDBCardBody cascade>
                                <MDBProgress
                                    value={25}
                                    barClassName='primary-color'
                                    height='6px'
                                    wrapperStyle={{opacity: '.7'}}
                                    className='mb-3'
                                />
                                <p className='card-text'>Better than last week (25%)</p>
                            </MDBCardBody>
                        </MDBCard>
                    </ResponsiveReactGridLayout>
                </MDBBox>
                <MDBModal isOpen={this.state.showRecent} toggle={this.toggleRecent} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleRecent}>{localization.recent}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                          <RecentLeads />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn rounded color="secondary" onClick={this.toggleRecent}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBModal isOpen={this.state.showSearch} toggle={this.toggleSearch} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleSearch}>{localization.search}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                        <Search />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn rounded color="secondary" onClick={this.toggleSearch}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBModal isOpen={this.state.showProfile} toggle={this.toggleProfile} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleProfile}>{localization.profile}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                        <Profile onClose={this.toggleProfile}/>
                    </MDBModalBody>
                </MDBModal>
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
