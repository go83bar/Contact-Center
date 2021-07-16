import React, {useState} from 'react'
import {useSelector} from "react-redux";
import EmailSummary from "./EmailSummary";
import {MDBBtn} from "mdbreact";
import EmailSummaryCreate from "./EmailSummaryCreate";

const EmailSummaryList = () => {
    const summaries = useSelector( state => state.lead.email_summary)
    const showMoreButtonLabel = useSelector( state => state.localization.buttonLabels.showMore)
    const [buttonModeAdd, setButtonModeAdd] = useState(summaries.length < 3)

    const showMore = () => {
        setButtonModeAdd(!buttonModeAdd)
    }

    return (
        <div className="w-100">
            <div className="w-100 d-flex flex-wrap">
                { summaries.map( (summary, index) => {
                    if (index < 2 || buttonModeAdd) {
                        return <EmailSummary key={index} summary={summary} />
                    }
                    return ""
                })}
            </div>
            <div style={{flex: "0 0 60%"}}>
                {buttonModeAdd ? <EmailSummaryCreate /> : <MDBBtn rounded outline onClick={showMore}>> {showMoreButtonLabel}</MDBBtn>}
            </div>
        </div>
    )
}

export default EmailSummaryList