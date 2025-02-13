import React, { useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './LoginPage.css';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        loginUser(data);
    };

    return (
        <div className="login-page-wrapper">
            <Header />
            <Container fluid className="login-page-container">
                <div className="image-container-login">
                    <div className="image-overlay">
                        <div className="overlay-text">
                            <h1>OffBeatz Studio</h1>
                            <p className="overlay-paragraph-login">
                                OffBeatz è il tuo punto di riferimento per la registrazione e la produzione musicale a Firenze.
                                <br /><br />
                                Offriamo un ambiente professionale e attrezzature di alta qualità per garantire risultati eccezionali. Che tu sia un artista emergente o un professionista affermato, il nostro studio è progettato per soddisfare tutte le tue esigenze creative. Unisciti a noi per trasformare le tue idee in realtà sonore.
                            </p>
                            <div className="text-center">
                                <Button variant="primary" as={Link} to="/studio">
                                    Visita il nostro Studio
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-container">
                    <Form onSubmit={handleSubmit} className="bg-dark text-white p-4 rounded" style={{ width: '300px' }}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Enter password" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                        <div className="mt-3">
                            <Link to="/register">Don't have an account? Register here</Link>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default LoginPage;