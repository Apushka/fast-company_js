import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <ul className="nav">
            <li className="nav-item">
                <NavLink className="nav-link" activeClassName="bg-secondary text-white" to="/main">
                    Main
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" activeClassName="bg-secondary text-white" to="/login">
                    Login
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" activeClassName="bg-secondary text-white" to="/users">
                    Users
                </NavLink>
            </li>
        </ul>
    );
};

export default NavBar;
