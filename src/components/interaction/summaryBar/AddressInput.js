import React, {useState} from "react"
import PlacesAutocomplete, {geocodeByPlaceId} from "react-places-autocomplete";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/pro-solid-svg-icons";
import {useSelector} from "react-redux";

const AddressInput = ({selectCallback}) => {
    const [addressDisplay, setAddressDisplay] = useState("")
    const addressError = useSelector(state => state.localization.toast.editContactPreferences.addressError)
    const addressPlaceholder = useSelector(state => state.localization.toast.editContactPreferences.addressPlaceholder)

    const handleSelect = (address, placeId, suggestion) => {
        // need to call additional Google API call to get zip code
        geocodeByPlaceId(placeId)
            .then(results => {
                // this returns an array of matches, we only care about the first one
                let result = results[0]

                // iterate through address_components of result match and populate callback argument object
                let newValues = {}
                let address1Number, address1Street = ""
                for (const component of result.address_components) {
                    switch(component.types[0]) {
                        case "street_number":
                            address1Number = component.long_name
                            break
                        case "route":
                            address1Street = component.long_name
                            break
                        case "locality":
                            newValues.city = component.long_name
                            break
                        case "administrative_area_level_1":
                            newValues.state = component.short_name
                            break
                        case "postal_code":
                            newValues.zip = component.long_name
                            break
                        default:
                            break
                    }
                }

                newValues.address_1 = address1Number + " " + address1Street

                // fire off the callback with the formatted result match values
                selectCallback(newValues)
            })
            .catch(error => {
                toast.error(addressError)
                console.error('Error finding Address components:', error)
            });
    };

    const handleChange = address => {
        setAddressDisplay(address);
    };

    return (
        <PlacesAutocomplete
            value={addressDisplay}
            onChange={handleChange}
            onSelect={handleSelect}
        >
            {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                <div className="autocomplete">
                    <div className="autocompleteColumn">
                        <div className="input-group">
                            <div className="input-group-text">
                                <FontAwesomeIcon icon={faHome} className="skin-primary-color"/>
                            </div>
                            <input
                                {...getInputProps({
                                    placeholder: addressPlaceholder,
                                    className: "form-control"
                                })}
                            />
                        </div>
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            { suggestions.length > 0 && suggestions.map((suggestion, index) => {
                                const className = suggestion.active
                                    ? 'suggestion-item-active'
                                    : 'suggestion-item';
                                return (
                                    <div key={"place-" + index}>
                                        <div {...getSuggestionItemProps(suggestion, { className })}>
                                            <div className="suggestion"> {suggestion.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </PlacesAutocomplete>

    )
}

export default AddressInput