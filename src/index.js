import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
//import "mdbreact/dist/css/mdb.css";
import "react-grid-layout/css/styles.css"
import 'react-dates/lib/css/_datepicker.css';
import "react-resizable/css/styles.css"
import "./assets/scss/mdb-pro.scss"
import "./index.css";
import 'react-dates/initialize';

import registerServiceWorker from './registerServiceWorker';
import ContactCenter from "./ContactCenter";
import Unauthorized from "./Unauthorized";
import store from './store'

window.initMap = () => {
    console.log("Google Maps loaded")
}

const host = window.location.host.indexOf(":") > 0 ? window.location.host.substr(0, window.location.host.indexOf(":")) : window.location.host

// load configuration data based on the URL the app is running on
fetch(window.location.protocol + "//" + window.location.host + "/data/" + host + '.json')
    .then(response => response.json())
    .then((responseJson) => {
        store.dispatch({type: 'CONFIGURE', payload: responseJson})

        // insert Google Places API connector script
        let h = document.getElementsByTagName("head")
        let s=document.createElement("script")
        s.src="https://maps.googleapis.com/maps/api/js?key=" +  atob(responseJson["gmap-key"]) + "&libraries=places&callback=initMap";
        h[0].appendChild(s)


        // load language localization file for this configuration
        const lang = responseJson.languages && responseJson.languages.indexOf(window.navigator.language) !== -1 ? window.navigator.language : responseJson["language-default"]
        fetch(window.location.protocol + "//" + window.location.host + "/localization/" + lang + '.json')
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



