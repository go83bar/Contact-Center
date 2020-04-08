import React, {Component} from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBRow, MDBIcon} from "mdbreact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faPalette} from "@fortawesome/pro-solid-svg-icons";

class TopNav extends Component {
    constructor(props) {
        super(props);
//        this.onClick = this.onClick.bind(this);
//        this.toggle = this.toggle.bind(this);
        this.handleToggleClickA = this.handleToggleClickA.bind(this);
        this.state = {
            activeItem: "1",
            collapse: false
        }
    }


    handleToggleClickA() {
        this.props.onSideNavToggleClick();
    }
    render() {
        return (
            <MDBContainer>
                <MDBRow className={"navBar"}>
                    <MDBCol sm="6" className="text-left">
                        <img className={"logo"} src="/images/83Bar-white.png" alt="logo"></img>
                        <div
                            onClick={this.handleToggleClickA}
                            key='sideNavToggleA'
                            style={{
                                lineHeight: '32px',
                                marginleft: '1em',
                                verticalAlign: 'middle',
                                cursor: 'pointer'
                            }}
                        >
                            <MDBIcon icon='bars' color='white' size='lg' />
                        </div>
                    </MDBCol>
                    <MDBCol sm="6" className="text-right">
                        <MDBBtn href="https://mdbootstrap.com/docs/react/" target="blank" color="light-blue"
                                size={"sm"}><FontAwesomeIcon icon={faBook}/></MDBBtn>
                        <MDBBtn color="light-blue" onClick={this.changeSkin} size={"sm"} floating><FontAwesomeIcon
                            icon={faPalette}/></MDBBtn>

                        Account
                    </MDBCol>
                </MDBRow>

            </MDBContainer>
        )
    }
}

export default TopNav;
