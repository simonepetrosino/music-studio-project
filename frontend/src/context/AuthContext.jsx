import { createContext, useState, useEffect } from "react";
import  {jwtDecode}  from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // we use the arrow function to set the initial state so this value is only going to be set once on the initial render and not on every render
    // in this way we are more efficient because we are not going to read the local storage on every render
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    let [loading, setLoading] = useState(true); //is going to tell us if everything inside the provider is loaded and if we can show the children components

    const navigate = useNavigate();

    let registerUser = async (data) => {
        let response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username, 
                password: data.password
            }),
        });

        let responsedata = await response.json();

        if(response.status === 201){
            loginUser(data);
        } else {
            alert('Something went wrong');
        }
    };

    let loginUser = async (data) => {
        //e.preventDefault();
        let response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username, 
                password: data.password,
            }),
        });

        let responsedata = await response.json();

        if(response.status === 200){
            setAuthTokens(responsedata);
            setUser(jwtDecode(responsedata.access)); //we are going to decode the token and set the user state with the user information that is in the token
            localStorage.setItem('authTokens', JSON.stringify(responsedata));
            navigate('/');
        } else {
            alert('Something went wrong');
        }
    };


    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    let contextData = { //we are going to pass this object to the value of the AuthContext.Provider
        user: user,
        authTokens: authTokens,
        setAuthTokens: setAuthTokens,
        setUser: setUser,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
    };


    useEffect(() => {

        if(authTokens){
            setUser(jwtDecode(authTokens.access));
        }
        setLoading(false); //we are going to set loading to false so we can show the children
        

    }, [authTokens, loading]);


    return (
        <AuthContext.Provider value={contextData}> {/*in the value we are going to pass everything that we want to share with the children components*/}
            {loading ? null : children} {/*before we show the children components we are going to check if everything is loaded*/}
        </AuthContext.Provider>
    );
};