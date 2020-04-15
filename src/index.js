import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import rootReducer from './reducers'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
//import "mdbreact/dist/css/mdb.css";
import "./assets/scss/mdb-pro.scss"
import "./index.css";
import Cookies from 'universal-cookie'
import registerServiceWorker from './registerServiceWorker';
import ContactCenter from "./ContactCenter";
import Unauthorized from "./Unauthorized";

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const host = window.location.host.indexOf(":") ? window.location.host.substr(0, window.location.host.indexOf(":")) : window.location.host
fetch(window.location.protocol + "//" + window.location.host + "//data//" + host + '.json')
    .then(response => response.json())
    .then((responseJson) => {
        responseJson["cookies"] = new Cookies()
        store.dispatch({type: 'CONFIGURE',payload: responseJson})
        const lang = responseJson.languages && responseJson.languages.indexOf(window.navigator.language) !== -1 ? window.navigator.language : responseJson["language-default"]

        fetch(window.location.protocol + "//" + window.location.host + "//localization//" + lang + '.json')
            .then(response => response.json())
            .then((responseJson) => {
                store.dispatch({type: 'LOCALIZE', payload: responseJson})
                ReactDOM.render(
                    <Provider store={store}>
                        <ContactCenter/>
                    </Provider>,
                    document.getElementById('83Bar-Activate')
                )
            })
    })
    .catch((error) => {
        //console.error(error)
        ReactDOM.render(<Unauthorized/>, document.getElementById('83Bar-Activate'))

    })

registerServiceWorker();



