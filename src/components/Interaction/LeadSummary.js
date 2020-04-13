import React, {Component} from 'react'
import {MDBContainer, MDBNavItem, MDBNavLink, MDBNav, MDBIcon, MDBBtn, MDBRow, MDBCol, MDBChip} from "mdbreact";

class LeadSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <MDBContainer>

                <MDBRow>
                    <MDBCol size={"6"}>Loiuse Smith</MDBCol>
                    <MDBCol size={"6"}>
                        <MDBNav className="justify-content-end" style={{float:"right", border:"1px solid #43C7B6"}}>
                            <MDBNavItem>
                                <MDBNavLink to="#!">
                                    <MDBBtn floating size="sm" ><MDBIcon icon={"phone"}/></MDBBtn>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#!">
                                    <MDBIcon icon={"envelope"} className="darkIcon" size={"lg"} style={{marginTop:"20px"}}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#!">
                                    <MDBIcon icon={"comment"} className="darkIcon" size={"lg"} style={{marginTop:"20px"}}/>
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#!">
                                    <MDBBtn floating size="sm" color="danger"><MDBIcon icon={"times"}/></MDBBtn>
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>

                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol size={"6"}> CellPhone: (937) 543 - 1960 </MDBCol>
                    <MDBCol size={"6"}>
                        <MDBChip>Client: Myriad</MDBChip>
                        <MDBChip>Trial: Genetic Testing</MDBChip>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }

}
export default LeadSummary;
