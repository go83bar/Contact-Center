import React, {Component} from 'react'
import {MDBContainer, MDBNavItem, MDBNavLink, MDBNav, MDBIcon, MDBBtn, MDBRow, MDBCol, MDBChip, MDBCard,MDBCardBody, MDBCollapse, MDBCollapseHeader} from "mdbreact";
import {connect} from "react-redux";

class LeadSummary extends Component {

    constructor(props) {
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.state = {
            collapsed : false
        };
    }
    toggleCollapse() {
        this.setState({collapsed : !this.state.collapsed})
    }
    render() {
        return (
            <MDBContainer fluid className={'md-accordian p-0'}>
                <MDBCard className='mt-3 border-primary rounded'>
                    <MDBCollapseHeader className={"backgroundColorInherit border-0 p-0 ml-3"} onClick={() => this.toggleCollapse('collapse1')}>

                        {this.props.lead.first_name} {this.props.lead.last_name}

                        <MDBNav className={"justify-content-end float-right border-left border-primary " + (!this.state.collapsed && "border-bottom")}>
                            <MDBNavItem>
                                <MDBNavLink to="#!" className={"p-1"}>
                                    <MDBBtn floating size="sm"><MDBIcon icon={"phone"}/></MDBBtn>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#!" className={"p-3"}>
                                    <MDBIcon icon={"envelope"} className="darkIcon" size={"lg"} style={{marginTop:"8px"}}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#!" className={"p-3"}>
                                    <MDBIcon icon={"comment"} className="darkIcon" size={"lg"} style={{marginTop:"8px"}}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#!" className={"p-1"}>
                                    <MDBBtn floating size="sm" color="danger"><MDBIcon icon={"times"}/></MDBBtn>
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBNav className={"justify-content-end float-right border-0 px-3 mt-4"}>
                            <MDBIcon size={"lg"} icon={this.state.collapsed === true ? 'angle-up' : 'angle-down'}/>
                        </MDBNav>

                    </MDBCollapseHeader>
                    <MDBCollapse id='collapse1' isOpen={!this.state.collapsed}>
                        <MDBCardBody>
                            Pariatur cliche reprehenderit, enim eiusmod high life accusamus
                            terry richardson ad squid. 3 wolf moon officia aute, non
                            cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
                            laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a
                            bird on it squid single-origin coffee nulla assumenda shoreditch
                            et. Nihil anim keffiyeh helvetica, craft beer labore wes
                            anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
                            butcher vice lomo. Leggings occaecat craft beer farm-to-table,
                            raw denim aesthetic synth nesciunt you probably haven&apos;t
                            heard of them accusamus labore sustainable VHS.
                        </MDBCardBody>
                    </MDBCollapse>
                </MDBCard>


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

export default connect(mapStateToProps, mapDispatchToProps)(LeadSummary);
