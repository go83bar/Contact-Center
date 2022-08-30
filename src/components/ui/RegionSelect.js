import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import Select from "react-select";
import LeadAPI from "../../api/leadAPI";
import {toast} from "react-toastify";

const RegionSelect = () => {
    const dispatch = useDispatch()
    const currentRegion = useSelector(state => state.lead.region_id)
    const leadID = useSelector(state => state.lead.id)
    const interactionID = useSelector(state => state.interaction.id)
    const regions = useSelector(state => state.lead.client.regions)
    const successMessage = useSelector(state => state.localization.toast.details.updateSucceeded)
    const failMessage = useSelector(state => state.localization.toast.details.updateFailed)

    const handleChange = (selectedOption) => {

        // call API method and dispatch new data to the store when it's complete
        const data = {
            lead_id: leadID,
            interaction_id: interactionID,
            updates: {
                region_id: selectedOption.value
            }
        }
        LeadAPI.updateDetails(data)
            .then(response => {
                if (response.success !== true) {
                    toast.error(failMessage)
                } else {
                    let leadData = response.lead
                    leadData["region"] = regions.find(region => region.id === selectedOption.value)

                    // set the lead's current email
                    let primaryEmail = ""
                    if (Array.isArray(leadData.email_summary)) {
                        leadData.email_summary.forEach(summary => {
                            if (summary.is_current) primaryEmail = summary.email_address
                        })
                    }
                    leadData.details.email = primaryEmail

                    dispatch({type: 'LEAD.LOAD',payload: leadData})

                    toast.success(successMessage)
                }
            }).catch(reason => {
                console.log("Contact details fail: ", reason)
                toast.error(failMessage)
        })
    }

    let selectedRegion = {}
    const regionOptions = regions.filter(region => region.active).map(region => {
        if (region.id === currentRegion) {
            selectedRegion = {value: region.id, label: region.name}
        }
        return {value: region.id, label: region.name}
    })

    return (
        <Select onChange={handleChange} value={selectedRegion} options={regionOptions} />
    )
}

export default RegionSelect