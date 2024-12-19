import React, {useContext} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';
import useAxios from "../utils/useAxios";
import SessionCard from "../components/SessionCard";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Footer from "../components/Footer";


const SessionPage = () => {
    let [sessions, setSessions] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext);
    let { user } = useContext(AuthContext);

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
        <Container fluid className="main-container bg-dark text-white">
            <Header />

                <div className='container-md' style={{marginBlock: '10%'}}>

                    {sessions.map(session => (
                        <div key={session.id} style={{marginBlock: '2%'}}>
                            <SessionCard session={session} />
                        </div>
                    ))}
                </div>

                <Footer />
        </Container>
        
    );

};

export default SessionPage;