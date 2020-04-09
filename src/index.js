import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
//import "mdbreact/dist/css/mdb.css";
import "./assets/scss/mdb-pro.scss"
import "./index.css";

import registerServiceWorker from './registerServiceWorker';
import ContactCenter from "./ContactCenter";

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
    <Provider store={store}>
        <ContactCenter />
    </Provider>,
    document.getElementById('83Bar-Activate')
);

// DISPLAY it in console
//store.subscribe(() => console.log(store.getState()))

registerServiceWorker();



