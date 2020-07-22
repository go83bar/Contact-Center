import LeadAPI from "../api/leadAPI";
import store from "../store"
import { toast } from "react-toastify";

class Lead {
    static async loadLead(leadID) {
        const redux = store.getState()

        const result = await LeadAPI.getLeadDTO({leadID: leadID})
            .then((responseJson) => {
                if (responseJson.success) {
                    let leadData = responseJson.data
                    const clientIndex = redux.shift.clients.findIndex(client => client.id === leadData.client_id)
                    leadData["client_index"] = clientIndex
                    if (clientIndex === -1) {
                        // serious problem, lead's client doesn't exist in agent's shift data
                        toast.error(redux.localization.toast.interaction.loadLead.clientMissing)
                        throw new Error("Missing client data")
                    }

                    const campaignIndex = redux.shift.clients[clientIndex].campaigns.findIndex(campaign => campaign.id === leadData.campaign_id);
                    leadData["campaign_index"] = campaignIndex
                    if (campaignIndex === -1) {
                        // lead's campaign doesn't exist in agent's shift data
                        toast.error(redux.localization.toast.interaction.loadLead.campaignMissing)
                        throw new Error("Missing campaign data")
                    }

                    const regionIndex = redux.shift.clients[clientIndex].regions.findIndex(region => region.id === leadData.region_id);
                    leadData["region_index"] = regionIndex
                    if (regionIndex === -1) {
                        // lead's region doesn't exist in agent's shift data
                        toast.error(redux.localization.toast.interaction.loadLead.regionMissing)
                        throw new Error("Missing region data")
                    }
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