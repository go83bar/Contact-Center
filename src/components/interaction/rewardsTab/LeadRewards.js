import React from 'react'
import {MDBBox } from 'mdbreact'
import {useSelector} from 'react-redux'
import Reward from "./Reward";

const LeadRewards = ({active}) => {
    const leadRewards = useSelector(state => state.lead.rewards)

    return (
        <MDBBox className={active ? "d-flex w-100 flex-column bg-white f-m" : "hidden"}>
            <MDBBox className="d-flex w-100 flex-column bg-white f-m">
                <div className='d-flex flex-column p-1 px-3 gray-background gray-border mt-2 rounded'>
                    {leadRewards && leadRewards.map(reward => <Reward key={reward.id} reward={reward} />)}
                </div>
            </MDBBox>
        </MDBBox>
    )
}


export default LeadRewards