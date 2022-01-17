import React from "react";
import {NavLink} from "react-router-dom";

function Footer() {
    return (

    <footer className="py-3">
        <div className="container">
            <p className="m-0 text-center text-white">
                Copyright &copy; The People's NFT {new Date().getFullYear()}
                {/*| <NavLink to="/privacy-policy">Privacy Policy</NavLink>*/}
            </p>
        </div>
    </footer>
    );
}

export default Footer;
