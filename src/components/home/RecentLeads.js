import React, {useEffect, useState} from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader,

} from "mdbreact"
import AgentAPI from '../../api/agentAPI';
import LoadingScreen from '../LoadingScreen'
import SearchResults from './SearchResults'
import {useSelector} from 'react-redux';

const RecentLeads = ({isOpen, closeFunction}) => {
    const localization = useSelector( state => state.localization.home)
    const [isLoaded, setIsLoaded] = useState(false)
    const [recentLeadsData, setRecentLeadsData] = useState(undefined)

    // if isOpen is changing to true, fetch recent lead data
    useEffect(() => {
        if( isOpen) {
            AgentAPI.getRecentLeads().then( response => {
                if (response.success) {
                    const formattedResults = response.data.map( (item) => {
                        item.id = item.lead_id
                        return item
                    })
                    setRecentLeadsData(formattedResults)
                    setIsLoaded(true)
                }
            })
        } else {
            setIsLoaded(false)
        }
    }, [isOpen])

    return (
        <MDBModal isOpen={isOpen} toggle={closeFunction} centered size={"lg"}>
            <MDBModalHeader toggle={closeFunction}>{localization.recent}</MDBModalHeader>
            <MDBModalBody className="p-0">
                <MDBCard>
                    <MDBCardBody className="shadow-none">
                        {isLoaded ? <SearchResults results={recentLeadsData} /> : <LoadingScreen />}
                    </MDBCardBody>
                </MDBCard>
            </MDBModalBody>
            <MDBModalFooter className="d-flex justify-content-between">
                <MDBBtn rounded outline onClick={closeFunction}>Close</MDBBtn>
            </MDBModalFooter>
        </MDBModal>

    )
}

export default RecentLeads