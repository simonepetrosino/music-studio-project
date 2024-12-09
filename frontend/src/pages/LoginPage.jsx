import React, {useContext} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext);
    return (
        <div>
            <Header />
            <form onSubmit={loginUser}>
                <input type="text"  name="username" placeholder="enter username" />
                <input type="password" name="password" placeholder="enter password" />
                <input type="submit"/> 
            </form>
        </div>
    );
};

export default LoginPage;