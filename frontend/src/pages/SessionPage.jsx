import React, { useContext, useEffect, useState } from "react";
import { Container, Table, Pagination, Button, FormControl, InputGroup, DropdownButton, Dropdown } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from '../context/AuthContext';
import useAxios from "../utils/useAxios";
import { Link } from 'react-router-dom';
import './SessionPage.css';

const SessionPage = () => {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sessionsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: 'start', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [producerFilter, setProducerFilter] = useState('');
    const [artistFilter, setArtistFilter] = useState('');
    const api = useAxios();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getSessions();
    }, []);

    useEffect(() => {
        filterSessions();
    }, [searchTerm, statusFilter, producerFilter, artistFilter, sessions]);

    const getSessions = async () => {
        let response = await api.get("/api/sessions/");
        if (response.status === 200) {
            const sessionsData = response.data.map(session => ({
                ...session,
                start: new Date(session.start).toISOString().replace('T', ' ').substring(0, 19),
                end: new Date(session.end).toISOString().replace('T', ' ').substring(0, 19),
            }));
            setSessions(sessionsData);
            setFilteredSessions(sessionsData);
        }
    };

    const filterSessions = () => {
        let filtered = sessions;

        if (searchTerm) {
            filtered = filtered.filter(session =>
                session.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(session => session.status === statusFilter);
        }

        if (producerFilter) {
            filtered = filtered.filter(session => session.producer_name === producerFilter);
        }

        if (artistFilter) {
            filtered = filtered.filter(session => session.artist_name === artistFilter);
        }

        setFilteredSessions(filtered);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        sortArray(key, direction);
    };

    const sortArray = (key, direction) => {
        const sorted = [...filteredSessions].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setFilteredSessions(sorted);
    };

    const getSortIndicator = (key) => {
        if (!sortConfig) {
            return null;
        }
        return sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null;
    };

    const handleDeleteSession = async (sessionId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this session?');
        if (confirmDelete) {
            try {
                await api.delete(`/api/session/${sessionId}/delete/`);
                getSessions(); // Refresh the list after deletion
            } catch (error) {
                console.error('There was an error deleting the session!', error);
            }
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setProducerFilter('');
        setArtistFilter('');
    };

    const uniqueStatuses = [...new Set(sessions.map(session => session.status))];
    const uniqueProducers = [...new Set(sessions.map(session => session.producer_name))];
    const uniqueArtists = [...new Set(sessions.map(session => session.artist_name))];

    // Get current sessions
    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="session-page-wrapper">
            <Header />
            <Container fluid className="session-page-container">
                <div className='container-md' style={{ marginBlock: '10%' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Sessions</h2>
                        <Button as={Link} to="/book" variant="primary">
                            Book a Session
                        </Button>
                    </div>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search by description"
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <div className="d-flex justify-content-between mb-3">
                        <DropdownButton id="dropdown-basic-button" title={`Filter by Status: ${statusFilter || 'All'}`}>
                            <Dropdown.Item onClick={() => setStatusFilter('')}>All</Dropdown.Item>
                            {uniqueStatuses.map(status => (
                                <Dropdown.Item key={status} onClick={() => setStatusFilter(status)}>
                                    {status}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <DropdownButton id="dropdown-basic-button" title={`Filter by Producer: ${producerFilter || 'All'}`}>
                            <Dropdown.Item onClick={() => setProducerFilter('')}>All</Dropdown.Item>
                            {uniqueProducers.map(producer => (
                                <Dropdown.Item key={producer} onClick={() => setProducerFilter(producer)}>
                                    {producer}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <DropdownButton id="dropdown-basic-button" title={`Filter by Artist: ${artistFilter || 'All'}`}>
                            <Dropdown.Item onClick={() => setArtistFilter('')}>All</Dropdown.Item>
                            {uniqueArtists.map(artist => (
                                <Dropdown.Item key={artist} onClick={() => setArtistFilter(artist)}>
                                    {artist}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
                    </div>
                    <div className="table-responsive table-background">
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('artist_name')} style={{ cursor: 'pointer' }}>Artist {getSortIndicator('artist_name')}</th>
                                    <th onClick={() => requestSort('producer_name')} style={{ cursor: 'pointer' }}>Producer {getSortIndicator('producer_name')}</th>
                                    <th onClick={() => requestSort('start')} style={{ cursor: 'pointer' }}>Start {getSortIndicator('start')}</th>
                                    <th onClick={() => requestSort('end')} style={{ cursor: 'pointer' }}>End {getSortIndicator('end')}</th>
                                    <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>Status {getSortIndicator('status')}</th>
                                    <th style={{ cursor: 'pointer' }}>Description</th>
                                    {user && user.role === 'producer' && <th>Actions</th>}
                                    {user && user.role === 'producer' && <th>Delete</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentSessions.map(session => (
                                    <tr key={session.id}>
                                        <td>{session.artist_name}</td>
                                        <td>{session.producer_name}</td>
                                        <td>{session.start}</td>
                                        <td>{session.end}</td>
                                        <td className={
                                            session.status === 'approved' ? 'text-success' :
                                            session.status === 'rejected' ? 'text-warning' : ''
                                        }>
                                            {session.status}
                                        </td>
                                        <td>{session.description}</td>
                                        {user && user.role === 'producer' && (
                                            <td>
                                                {session.status === 'rejected' ? (
                                                    <Button variant="success" onClick={() => handleChangeStatus(session.id, 'approved')} style={{ marginRight: '10px' }}>Approve</Button>
                                                ) : session.status === 'approved' ? (
                                                    <Button variant="warning" onClick={() => handleChangeStatus(session.id, 'rejected')}>Reject</Button>
                                                ) : (
                                                    <>
                                                        <Button variant="success" onClick={() => handleChangeStatus(session.id, 'approved')} style={{ marginRight: '10px' }}>Approve</Button>
                                                        <Button variant="warning" onClick={() => handleChangeStatus(session.id, 'rejected')}>Reject</Button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                        {user && user.role === 'producer' && (
                                            <td>
                                                <Button variant="danger" onClick={() => handleDeleteSession(session.id)}>Delete</Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <Pagination className="justify-content-center mt-3">
                        {Array.from({ length: Math.ceil(sessions.length / sessionsPerPage) }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </Container>
            <Footer />
        </div>
    );
}

export default SessionPage;