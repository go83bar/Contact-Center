import React from "react"
import {MDBBox} from "mdbreact";
import {faCalendarCheck, faGraduationCap, faPhone} from "@fortawesome/pro-solid-svg-icons";
import {faClipboardList} from "@fortawesome/pro-light-svg-icons";
import {useSelector} from "react-redux";
import AgentStatCard from "./AgentStatCard";

const AgentStats = ({agentStats}) => {
    const localization = useSelector(state => state.localization.home)


    return (
        <MDBBox className="d-flex flex-row justify-content-between mt-3 flex-wrap">
            <AgentStatCard title={localization.queueLabel} count={agentStats.queueCount} icon={faClipboardList} />
            <AgentStatCard title={localization.interactionsLabel} count={agentStats.interactionsCount} icon={faPhone} />
            <AgentStatCard title={localization.bookingsLabel} count={agentStats.bookingsCount} icon={faCalendarCheck} />
            <AgentStatCard title={localization.educationsLabel} count={agentStats.educationsCount} icon={faGraduationCap} />
        </MDBBox>
    )
}

export default AgentStats