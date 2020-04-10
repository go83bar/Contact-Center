import { combineReducers } from 'redux'
import {authentication} from './authentication'
import {configuration} from "./configuration";
import {localization} from "./localization";

export default combineReducers({
    auth : authentication,
    config : configuration,
    localization : localization
})
