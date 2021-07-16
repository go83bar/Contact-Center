import * as moment from "moment";

export function loadInteraction(interactionID, userName) {
    return {
        type: "INTERACTION.LOAD",
        payload: {
            id: interactionID,
            outcome_id: 27,
            outcome_reason_id: null,
            reason_id: null,
            created_at: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
            created_by: userName
        }
    }
}

export function resumeInteraction(interactionID, startTime, userName) {
    return {
        type: "INTERACTION.LOAD",
        payload: {
            id: interactionID,
            outcome_id: 27,
            outcome_reason_id: null,
            reason_id: null,
            created_at: startTime,
            created_by: userName,
            callReason: "Locked to you"
        }
    }
}

export function setCallReason(reason) {
    return {
        type: "INTERACTION.SET_CALL_REASON",
        payload: reason
    }
}

export function setCurrentEmail(emailSummaryID) {
    return {
        type: "LEAD.EMAIL_CURRENT",
        payload: emailSummaryID
    }
}

export function deselectEmail(emailSummaryID) {
    return {
        type: "LEAD.EMAIL_UNMARKED",
        payload: emailSummaryID
    }
}

export function setValidatedEmail(summaryID, isCurrent, isUsable, emailAddress) {
    return {
        type: "LEAD.EMAIL_VALIDATED",
        payload: {
            summaryID,
            isCurrent,
            isUsable,
            emailAddress
        }
    }
}