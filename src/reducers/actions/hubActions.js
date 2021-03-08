export function DisplayDashboard() {
    return {
        type: "HUB.SET_VIEW",
        payload: "dashboard"
    }
}

export function DisplayPreview() {
    return {
        type: "HUB.SET_VIEW",
        payload: "preview"
    }
}

export function DisplayInteraction() {
    return {
        type: "HUB.SET_VIEW",
        payload: "interaction"
    }
}
