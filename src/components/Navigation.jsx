import React from "react";
import { NavLink } from "react-router-dom";
import logo from '../logo.svg';

function Navigation() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top" id="banner">
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    <img src={logo} className="logo" alt="logo" />
                </NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse flex-grow-1 justify-content-end" id="collapsibleNavbar">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#roadmap">
                                Roadmap
                            </a>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">
                                About Us
                            </NavLink>
                        </li>
                        <li className="nav-item px-2">
                            <a href="https://twitter.com/peoples_NFT" title="twitter" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                            </a>
                        </li>
                        <li className="nav-item px-2">
                            <a href="https://discord.gg/kpSvvmpDJd" title="discord" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="19" viewBox="0 0 25 19.1" fill="currentColor">
                                    <path d="m21.2 1.6c-1.6-0.7-3.3-1.3-5.1-1.6h-0.1c-0.2 0.4-0.5 0.9-0.6 1.3-1.9-0.3-3.8-0.3-5.7 0-0.2-0.4-0.5-0.8-0.7-1.3h-0.1c-1.7 0.3-3.4 0.8-5.1 1.6-3.2 4.8-4.1 9.6-3.7 14.2v0.1c1.9 1.4 4 2.5 6.2 3.2h0.1c0.5-0.7 0.9-1.3 1.3-2.1v-0.1c-0.7-0.3-1.3-0.6-1.9-0.9v-0.1c0.1-0.1 0.3-0.2 0.4-0.3h0.1c4.1 1.9 8.5 1.9 12.6 0h0.1c0.1 0.1 0.3 0.2 0.4 0.3v0.1c-0.6 0.4-1.3 0.7-2 0.9v0.1c0.4 0.7 0.8 1.4 1.3 2.1h0.1c2.2-0.7 4.4-1.8 6.3-3.2v-0.1c0.3-5.4-1.1-10-3.9-14.2zm-12.8 11.4c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5zm8.3 0c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5z"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
