import React from "react";
import { Link } from "react-router-dom";
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

const Header = () => {
    let {user, logoutUser} = useContext(AuthContext);

    return (
        <div>
            <Link to="/">Home</Link>
            <span> | </span>
            {user ? (
                <Link to="/" onClick={logoutUser}>Logout</Link>
            ) : (
                <Link to="/login">Login</Link>
            )}


            {user && <p>Hello {user.username}</p>} {/*if the user is logged in we are going to show the username*/}
        </div>
    );
}

export default Header;