import { combineReducers } from 'redux'
import {user} from './user'
import {preview} from "./preview"
import {configuration} from "./configuration"
import {localization} from "./localization"
import {lead} from "./lead";
import {shift} from "./shift"
import {interaction} from "./interaction"
import {twilio} from "./twilio"
import {auth} from "./auth";
import {hub} from "./hub";

export default combineReducers({
    auth: auth,
    user : user,
    config : configuration,
    preview: preview,
    localization : localization,
    lead : lead,
    shift: shift,
    interaction: interaction,
    twilio: twilio,
    hub: hub,
})
