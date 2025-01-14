import React, { useContext, useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
    const [sessions, setSessions] = useState([]);
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        getSessions();
    }, []);

    const getSessions = async () => {
        let response = await api.get("/api/sessions/");
        if (response.status === 200) {
            setSessions(response.data);
        }
    };

    const handleUploadFiles = () => {
        navigate('/upload');
    };

    const handleBookSession = () => {
        navigate('/book');
    };

    const handleViewFiles = () => {
        navigate('/audio-files');
    };

    const handleViewSessions = () => {
        navigate('/sessions');
    };

    return (
        <div>
            <Header />
            <Container fluid className="main-container bg-dark text-white p-3">
                <h1>Hi, {user && user.username}</h1>
                <Row className="justify-content-center">
                    {user && user.role === 'artist' && (
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-3 d-flex">
                            <Card className="bg-secondary text-white p-3 flex-fill">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Book your session</Card.Title>
                                    <Card.Text className="flex-grow-1">
                                        You can book your session with one of our producers here.
                                    </Card.Text>
                                    <Button variant="dark" onClick={handleBookSession}>Book a session now</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-3 d-flex">
                        <Card className="bg-secondary text-white p-3 flex-fill">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>View your files</Card.Title>
                                <Card.Text className="flex-grow-1">
                                    You can view all your songs and beats here.
                                </Card.Text>
                                <Button variant="dark" onClick={handleViewFiles}>Show files</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-3 d-flex">
                        <Card className="bg-secondary text-white p-3 flex-fill">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>View your sessions</Card.Title>
                                <Card.Text className="flex-grow-1">
                                    You can view all your sessions here.
                                </Card.Text>
                                <Button variant="dark" onClick={handleViewSessions}>View sessions</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    {user && user.role === 'producer' && (
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-3 d-flex">
                            <Card className="bg-secondary text-white p-3 flex-fill">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Upload Audio Files</Card.Title>
                                    <Card.Text className="flex-grow-1">
                                        You can upload your audio files here.
                                    </Card.Text>
                                    <Button variant="dark" onClick={handleUploadFiles}>Upload Files</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default HomePage;