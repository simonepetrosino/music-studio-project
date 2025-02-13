import React, { useContext, useEffect, useState, useRef } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.css';

const HomePage = () => {
    const [sessions, setSessions] = useState([]);
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const navigate = useNavigate();
    const [showFullText, setShowFullText] = useState(false);
    const paragraphRef = useRef(null);

    useEffect(() => {
        getSessions();
    }, []);

    useEffect(() => {
        if (paragraphRef.current) {
            const paragraphHeight = paragraphRef.current.scrollHeight;
            const containerHeight = paragraphRef.current.parentElement.clientHeight;
            if (paragraphHeight <= containerHeight) {
                setShowFullText(true);
            }
        }
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
            <Container fluid className="main-container bg-dark text-white p-0">
                <div className="image-container-home">
                    <img src='/src/assets/recording-studio-esempio.jpg' alt="Studio" className="img-fluid" />
                    <div className="image-overlay-home">
                        <h1 className="overlay-text-home">OffBeatz Studio</h1>
                        <div className="overlay-paragraph-home" ref={paragraphRef}>
                            OffBeatz è il tuo punto di riferimento per la registrazione e la produzione musicale a Firenze.
                            {showFullText && (
                                <>
                                    <br /><br />
                                    Offriamo un ambiente professionale e attrezzature di alta qualità per garantire risultati eccezionali. Che tu sia un artista emergente o un professionista affermato, il nostro studio è progettato per soddisfare tutte le tue esigenze creative. Unisciti a noi per trasformare le tue idee in realtà sonore.
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Container className="mt-4">
                    <Row className="justify-content-center">
                        {user && user.role === 'artist' && (
                            <Col xs={12} sm={6} md={4} lg={4} className="mb-3 d-flex">
                                <Card className="bg-secondary text-white p-0 flex-fill">
                                    <Card.Img variant="top" src="/src/assets/microfono.avif" alt="Mic" className="card-img-top-no-margin fixed-dimension" />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>Book your session</Card.Title>
                                        <Card.Text className="flex-grow-1">
                                            You can book your session with one of our producers here.
                                        </Card.Text>
                                        <Button variant="dark" onClick={handleBookSession}>Book a session</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                        <Col xs={12} sm={6} md={4} lg={4} className="mb-3 d-flex">
                            <Card className="bg-secondary text-white p-0 flex-fill">
                                <Card.Img variant="top" src="/src/assets/mpc.jpg" alt="mpc" className="card-img-top-no-margin fixed-dimension" />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>View your files</Card.Title>
                                    <Card.Text className="flex-grow-1">
                                        You can view all your songs and beats here.
                                    </Card.Text>
                                    <Button variant="dark" onClick={handleViewFiles}>Show files</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={4} className="mb-3 d-flex">
                            <Card className="bg-secondary text-white p-0 flex-fill">
                                <Card.Img variant="top" src="/src/assets/session.webp" alt="Your Image" className="card-img-top-no-margin fixed-dimension" />
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
                            <Col xs={12} sm={6} md={4} lg={4} className="mb-3 d-flex">
                                <Card className="bg-secondary text-white p-0 flex-fill">
                                    <Card.Img variant="top" src="/src/assets/mixer-upload.jpeg" alt="Your Image" className="card-img-top-no-margin fixed-dimension" />
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
            </Container>
            <Footer />
        </div>
    );
}

export default HomePage;