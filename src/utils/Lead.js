import LeadAPI from "../api/leadAPI";
import store from "../store"
import { toast } from "react-toastify";
import {DisplayDashboard} from "../reducers/actions/hubActions";

class Lead {
    static async loadPreview(leadID, callQueueID) {

        LeadAPI.getLeadPreview({leadID, callQueueID}).then( response => {
            if (response.success) {
                store.dispatch({type: "PREVIEW.LOAD", payload: response.data})
            } else {
                // something went wrong on the backend, dump to the dashboard
                toast.error("Lead Preview cannot be loaded!")
                store.dispatch(DisplayDashboard())
            }
        }).catch( reason => {
            // a problem with the request itself, dump to dashboard
            console.log("Preview could not be loaded: ", reason)
            toast.error("Error loading preview! Another agent might have just loaded this lead.")
            store.dispatch(DisplayDashboard())
        })

    }

    static async loadLead(leadID) {
        const redux = store.getState()

        const result = await LeadAPI.getLeadDTO({leadID: leadID})
            .then((responseJson) => {
                if (responseJson.success) {
                    let leadData = responseJson.data

                    // load some client data into convenience properties on the redux Lead object
                    const currentClient = redux.shift.clients.find(client => client.id === leadData.client_id)
                    leadData["client"] = currentClient
                    if (currentClient === undefined) {
                        // serious problem, lead's client doesn't exist in agent's shift data
                        toast.error(redux.localization.toast.interaction.loadLead.clientMissing)
                        throw new Error("Missing client data")
                    }

                    const currentCampaign = currentClient.campaigns.find(campaign => campaign.id === leadData.campaign_id);
                    leadData["campaign"] = currentCampaign
                    if (currentCampaign === undefined) {
                        // lead's campaign doesn't exist in agent's shift data
                        toast.error(redux.localization.toast.interaction.loadLead.campaignMissing)
                        throw new Error("Missing campaign data")
                    }

                    const currentRegion = currentClient.regions.find(region => region.id === leadData.region_id);
                    leadData["region"] = currentRegion
                    if (currentRegion === undefined) {
                        // lead's region doesn't exist in agent's shift data
                        toast.error(redux.localization.toast.interaction.loadLead.regionMissing)
                        throw new Error("Missing region data")
                    }

                    // set the lead's current email
                    let primaryEmail = ""
                    if (Array.isArray(leadData.email_summary)) {
                        leadData.email_summary.forEach(summary => {
                            if (summary.is_current) primaryEmail = summary.email_address
                        })
                    }
                    leadData.details.email = primaryEmail

                    store.dispatch({type: 'LEAD.LOAD',payload: leadData})
                } else {
                    toast.error(redux.localization.toast.interaction.loadLead.loadFailed)
                    console.log("Error loading lead: ", responseJson)
                    throw new Error("Lead Load API call failed")
                }

            }).catch( error => {
                toast.error(redux.localization.toast.interaction.loadLead.loadFailed)
                console.log("Lead Load error: ", error)
            })

        return result
    }
}

export default Lead