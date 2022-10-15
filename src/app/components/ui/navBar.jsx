import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NavProfile from "./navProfile";

const NavBar = () => {
    const { currentUser } = useAuth();
    return (
        <nav className="navbar bg-light mb-3">
            <div className="container-fluid">
                <ul className="nav">
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="bg-secondary text-white" exact to="/">
                            Main
                        </NavLink>
                    </li>
                    {currentUser && <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="bg-secondary text-white" to="/users">
                            Users
                        </NavLink>
                    </li>}
                </ul>
                <div className="nav d-flex">
                    {currentUser
                        ? <NavProfile />
                        : <NavLink className="nav-link" aria-current="page" activeClassName="bg-secondary text-white" to="/login">
                            Login
                        </NavLink>}

                </div>
            </div>
        </nav>
    );
};

export default NavBar;
