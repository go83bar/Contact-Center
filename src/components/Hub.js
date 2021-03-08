import React from "react"
import {useSelector} from "react-redux";
import Preview from "./home/Preview";
import Home from "./home/Home";
import Interaction from "./interaction/Interaction";

const Hub = () => {
    const currentView = useSelector( state => state.hub.currentView)

    switch (currentView) {
        case "dashboard":
            return <Home />

        case "preview":
            return <Preview />

        case "interaction":
            return <Interaction />

        default:
            return <Home />
    }
}

export default Hub