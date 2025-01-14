import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    let { user, logoutUser } = useContext(AuthContext);
    const location = useLocation();

    return (
        <Navbar bg="dark" data-bs-theme="dark" sticky="top" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/" style={{ marginLeft: '5%' }}>OffBeatz Studio</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        {location.pathname !== '/login' && location.pathname !== '/register' && (
                            <>
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="/sessions">Sessions</Nav.Link>
                                <Nav.Link href="/audio-files">Files</Nav.Link>
                                {user && user.role === 'producer' && (
                                    <Nav.Link href="/calendar">Calendar</Nav.Link>
                                )}
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto" style={{ marginRight: '5%' }}>
                        {location.pathname === '/login' ? (
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        ) : location.pathname === '/register' ? (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        ) : (
                            user ? (
                                <Nav.Link as={Link} to="/" onClick={logoutUser}>Logout</Nav.Link>
                            ) : (
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            )
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;