import React from "react";
import ReactDOM from "react-dom";
import "./styles/css/theme.css";
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
    Navigation,
    Footer,
    Home,
    About,
    Privacy
} from "./components";

function getLibrary(provider) {
    return new Web3(provider)
}

ReactDOM.render(
    <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<Privacy />} />
            </Routes>
            <Footer />
        </Router>
    </Web3ReactProvider>,

    document.getElementById("root")
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
