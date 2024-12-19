import React, {useContext, useEffect, useState} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';
import useAxios from "../utils/useAxios";
import SessionPage from "./SessionPage";
import { Container } from "react-bootstrap";
import { Card, Button } from "react-bootstrap";
import Footer from "../components/Footer";

const HomePage = () => {
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
            <div>
                <Header />
                <Container fluid className="main-container bg-dark text-white">
                    <h1>Hi, {user && user.username}</h1>

                    <Container className="d-flex justify-content-center">

                        {user && user.role === 'artist' && (
                        <Card style={{ width: '18rem' }} className="mx-auto" bg="secondary">
                            <Card.Img variant="top" src="holder.js/100px180" />
                            <Card.Body>
                                <Card.Title>Book your session</Card.Title>
                                <Card.Text>
                                    You can book your session with one of our producers here.
                                </Card.Text>
                                <Button variant="dark">Book a session</Button>
                            </Card.Body>
                        </Card>
                        )}

                        <Card style={{ width: '18rem' }} className="mx-auto" bg="secondary">
                            <Card.Img variant="top" src="holder.js/100px180" />
                            <Card.Body>
                                <Card.Title>View your files</Card.Title>
                                <Card.Text>
                                    You can view all your songs and beats here.
                                </Card.Text>
                                <Button variant="dark">Show files</Button>
                            </Card.Body>
                        </Card>

                    </Container>

                    <Footer />

                </Container>

            </div>
    );
};

export default HomePage;
