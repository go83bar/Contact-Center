import React from "react"
import {MDBBox, MDBCard} from "mdbreact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faCircleSolid} from "@fortawesome/pro-solid-svg-icons";

const AgentStatCard = ({title, count, icon}) => {
    return (
        <MDBCard className="shadow-sm px-2 py-2 mt-1">
            <MDBBox className="d-flex skin-secondary-color align-items-center justify-content-between ml-3">
                <span>{title}: {count}</span>
                <span className="fa-layers fa-fw fa-3x">
                    <FontAwesomeIcon icon={faCircleSolid} className="skin-secondary-color"/>
                    <FontAwesomeIcon icon={icon} transform={"shrink-8"} className={"skin-text"}/>
                </span>
            </MDBBox>
        </MDBCard>
    )
}

export default AgentStatCard