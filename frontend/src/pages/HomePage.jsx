import React, {useContext, useEffect, useState} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';
import useAxios from "../utils/useAxios";
import MyCalendar from "../components/MyCalendar";

const HomePage = () => {
    let [sessions, setSessions] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext);

    let api = useAxios();

    useEffect(() => {
        getSessions();
    }, []);

    let getSessions = async () => {
        let response = await api.get("/api/sessions/");
        
        if(response.status === 200){
            setSessions(response.data);
        }
    };

    return (
        <div>
            <Header />
            <h1>You are logged to the homepage</h1>

            <ul>
                {sessions.map(session => (
                    <li key={session.id}>{session.artist_name} session with {session.producer_name}</li>
                ))}
            </ul>

            <MyCalendar myEvents={sessions}/>

        </div>
    );
};

export default HomePage;
