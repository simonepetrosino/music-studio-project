import React, {useContext} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const LoginPage = () => {
    let {loginUser} = useContext(AuthContext);

    const navigate = useNavigate();

    {/*return (
        <div>
            <Header />
            <form onSubmit={loginUser}>
                <input type="text"  name="username" placeholder="enter username" />
                <input type="password" name="password" placeholder="enter password" />
                <input type="submit"/> 
            </form>
        </div>

    );*/}

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
        <div>
            <Header />
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
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
            </Container>
        </div>
    );


};

export default LoginPage;