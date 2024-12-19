import React from "react";
import { Link } from "react-router-dom";
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = () => {
    let {user, logoutUser} = useContext(AuthContext);

    return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" sticky="top" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/" style={{marginLeft: '5%'}}>OffBeatz Studio</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/sessions">Sessions</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        {user && user.role === 'producer' && (
                            <Nav.Link href="/calendar">Calendar</Nav.Link>
                        )}
                    </Nav>
                    <Nav className="ms-auto" style={{marginRight: '5%'}}>
                        {user ? (
                            <Nav.Link as={Link} to="/" onClick={logoutUser}>Logout</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    </>
    );
}

export default Header;