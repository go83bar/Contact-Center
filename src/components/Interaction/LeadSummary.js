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
            <MDBContainer fluid>

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
                    <MDBCol size={"6"}>
                        <MDBChip>Cell Phone: (937) 543 - 1960</MDBChip>
                        <MDBChip>Home Phone: (937) 555 - 1748</MDBChip>
                        <MDBChip>EST</MDBChip>
                        <MDBChip>Address: 10300 Jollyville, Austin, TX, 78759</MDBChip>
                        <MDBChip>Email: louisesmith@gmail.com</MDBChip>

                    </MDBCol>
                    <MDBCol size={"6"}>
                        <MDBChip className={"outlineChip"}>Client: Myriad</MDBChip>
                        <MDBChip className={"outlineChip"}>Trial: Genetic Testing</MDBChip>
                        <MDBChip className={"outlineChip"}>Phase: Nurture, Call 1 of 4</MDBChip>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }

}
export default LeadSummary;
