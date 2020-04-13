import { combineReducers } from 'redux'
import {authentication} from './authentication'
import {configuration} from "./configuration";
import {localization} from "./localization";
import {lead} from "./lead";

export default combineReducers({
    auth : authentication,
    config : configuration,
    localization : localization,
    lead : lead
})
