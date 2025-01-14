import React, {useContext} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    let {registerUser} = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };
        if(data.password !== data.confirmPassword){
            alert('Passwords do not match');
            return;
        }
        registerUser(data);
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

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" name="confirmPassword" placeholder="Confirm password" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                    <div className="mt-3">
                    <Link to="/login">Already have an account? Sign in</Link>
                    </div>
                </Form>
            </Container>
        </div>
    );


};

export default RegisterPage;