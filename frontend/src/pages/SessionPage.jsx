import React, { useContext, useEffect, useState } from "react";
import { Container, Table, Pagination, Button } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from '../context/AuthContext';
import useAxios from "../utils/useAxios";

const SessionPage = () => {
    const [sessions, setSessions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sessionsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: 'start', direction: 'ascending' });
    const api = useAxios();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getSessions();
    }, []);

    const getSessions = async () => {
        let response = await api.get("/api/sessions/");
        if (response.status === 200) {
            setSessions(response.data);
        }
    };

    const sortedSessions = React.useMemo(() => {
        let sortableSessions = [...sessions];
        if (sortConfig !== null) {
            sortableSessions.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableSessions;
    }, [sessions, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '';
    };

    // Get current sessions
    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = sortedSessions.slice(indexOfFirstSession, indexOfLastSession);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleChangeStatus = async (sessionId, newStatus) => {
        try {
            const response = await api.put(`/api/session/${sessionId}/status/`, {
                status: newStatus
            });
            if (response.status === 200) {
                setSessions(sessions.map(session => 
                    session.id === sessionId ? { ...session, status: newStatus } : session
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <Header />
            <Container fluid className="main-container bg-dark text-white">
                <div className='container-md' style={{ marginBlock: '10%' }}>
                    <div className="table-responsive">
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
                                </tr>
                            </thead>
                            <tbody>
                                {currentSessions.map(session => (
                                    <tr key={session.id}>
                                        <td>{session.artist_name}</td>
                                        <td>{session.producer_name}</td>
                                        <td>{new Date(session.start).toLocaleString()}</td>
                                        <td>{new Date(session.end).toLocaleString()}</td>
                                        <td>{session.status}</td>
                                        <td>{session.description}</td>
                                        {user && user.role === 'producer' && (
                                            <td>
                                                {session.status === 'rejected' ? (
                                                    <Button variant="success" onClick={() => handleChangeStatus(session.id, 'approved')} style={{ marginRight: '10px' }}>Approve</Button>
                                                ) : session.status === 'approved' ? (
                                                    <Button variant="danger" onClick={() => handleChangeStatus(session.id, 'rejected')}>Reject</Button>
                                                ) : (
                                                    <>
                                                        <Button variant="success" onClick={() => handleChangeStatus(session.id, 'approved')} style={{ marginRight: '10px' }}>Approve</Button>
                                                        <Button variant="danger" onClick={() => handleChangeStatus(session.id, 'rejected')}>Reject</Button>
                                                    </>
                                                )}
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