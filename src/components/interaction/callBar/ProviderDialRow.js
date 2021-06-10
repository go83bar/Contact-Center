import React from 'react'
import {MDBBtn} from "mdbreact"
import { faPhone } from "@fortawesome/pro-solid-svg-icons"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const ProviderDialRow = ({row, dialHandler}) => {

    let dialButton = (
        <MDBBtn className="align-top" size="sm" rounded disabled>Closed</MDBBtn>
    )
    if (row.available) {
        dialButton = (
            <MDBBtn className="align-top" size="sm" rounded onClick={() => dialHandler(row.office.id, row.number, row.extension)}><FontAwesomeIcon icon={faPhone} className="text-white"/></MDBBtn>
        )

    }
    return (
        <tr className={ row.available ? "mb-2 skin-border-primary skin-primary-color" : "mb-2 skin-footer-color"}>
            <td className="border-right">{row.office.name}</td>
            <td className="border-right">{row.office.city}</td>
            <td className="border-right">{row.number}</td>
            <td className="border-right">{row.extension}</td>
            <td className="border-right">{row.hours}</td>
            <td>{row.priority}</td>
            <td className="align-middle">{ dialButton }</td>
        </tr>
    )
}

export default ProviderDialRow
