import { combineReducers } from 'redux'
import {authentication} from './authentication'
import {preview} from "./preview"
import {configuration} from "./configuration"
import {localization} from "./localization"
import {lead} from "./lead";
import {shift} from "./shift"
import interaction from "./interaction"

export default combineReducers({
    auth : authentication,
    config : configuration,
    preview: preview,
    localization : localization,
    lead : lead,
    shift: shift,
    interaction: interaction
})
