import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Container, FormControl, InputGroup, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AudioFilesPage.css';

const AudioFilesPage = () => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [filteredAudioFiles, setFilteredAudioFiles] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [producerFilter, setProducerFilter] = useState('');
    const [artistFilter, setArtistFilter] = useState('');
    const api = useAxios();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getAudioFiles();
    }, []);

    useEffect(() => {
        filterAudioFiles();
    }, [searchTerm, statusFilter, producerFilter, artistFilter, audioFiles]);

    const getAudioFiles = async () => {
        try {
            let response = await api.get("/api/audio_files/");
            if (response.status === 200) {
                setAudioFiles(response.data);
                setFilteredAudioFiles(response.data);
            }
        } catch (error) {
            console.error('Error fetching audio files:', error);
        }
    };

    const filterAudioFiles = () => {
        let filtered = audioFiles;

        if (searchTerm) {
            filtered = filtered.filter(file =>
                file.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(file => file.status === statusFilter);
        }

        if (producerFilter) {
            filtered = filtered.filter(file => file.producer_name === producerFilter);
        }

        if (artistFilter) {
            filtered = filtered.filter(file => file.artist_name === artistFilter);
        }

        setFilteredAudioFiles(filtered);
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
        const sorted = [...filteredAudioFiles].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setFilteredAudioFiles(sorted);
    };

    const getSortIndicator = (key) => {
        if (!sortConfig) {
            return null;
        }
        return sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null;
    };

    const handleDelete = async (fileId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this audio file?');
        if (confirmDelete) {
            try {
                await api.delete(`/api/audio-files/${fileId}/delete/`);
                getAudioFiles(); // Refresh the list after deletion
            } catch (error) {
                console.error('There was an error deleting the audio file!', error);
            }
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setProducerFilter('');
        setArtistFilter('');
    };

    const uniqueStatuses = [...new Set(audioFiles.map(file => file.status))];
    const uniqueProducers = [...new Set(audioFiles.map(file => file.producer_name))];
    const uniqueArtists = [...new Set(audioFiles.map(file => file.artist_name))];

    return (
        <div className="audio-files-page-wrapper">
            <Header />
            <Container fluid className="audio-files-page-container">
                <div className='container-md' style={{ marginBlock: '10%' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Audio Files</h2>
                        {user.role === 'producer' && (
                            <Button as={Link} to="/upload" variant="primary">
                                New File
                            </Button>
                        )}
                    </div>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search by title"
                            aria-label="Search by title"
                            aria-describedby="basic-addon2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Row className="d-flex justify-content-between mb-3">
                        <Col xs={12} sm={4} md={3} className="mb-2 mb-sm-0">
                            <DropdownButton id="dropdown-basic-button" title={`Filter by Status: ${statusFilter || 'All'}`}>
                                <Dropdown.Item onClick={() => setStatusFilter('')}>All</Dropdown.Item>
                                {uniqueStatuses.map(status => (
                                    <Dropdown.Item key={status} onClick={() => setStatusFilter(status)}>
                                        {status}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                        <Col xs={12} sm={4} md={3} className="mb-2 mb-sm-0">
                            <DropdownButton id="dropdown-basic-button" title={`Filter by Producer: ${producerFilter || 'All'}`}>
                                <Dropdown.Item onClick={() => setProducerFilter('')}>All</Dropdown.Item>
                                {uniqueProducers.map(producer => (
                                    <Dropdown.Item key={producer} onClick={() => setProducerFilter(producer)}>
                                        {producer}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                        <Col xs={12} sm={4} md={3} className="mb-2 mb-sm-0">
                            <DropdownButton id="dropdown-basic-button" title={`Filter by Artist: ${artistFilter || 'All'}`}>
                                <Dropdown.Item onClick={() => setArtistFilter('')}>All</Dropdown.Item>
                                {uniqueArtists.map(artist => (
                                    <Dropdown.Item key={artist} onClick={() => setArtistFilter(artist)}>
                                        {artist}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>
                        <Col xs={12} sm={4} md={3}>
                            <Button variant="secondary" onClick={resetFilters} className="w-100">Reset Filters</Button>
                        </Col>
                    </Row>
                    <div className="table-responsive table-background">
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('title')} style={{ cursor: 'pointer' }}>Title {getSortIndicator('title')}</th>
                                    <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>Status {getSortIndicator('status')}</th>
                                    <th onClick={() => requestSort('producer_name')} style={{ cursor: 'pointer' }}>Uploaded by {getSortIndicator('producer_name')}</th>
                                    <th onClick={() => requestSort('artist_name')} style={{ cursor: 'pointer' }}>Artist {getSortIndicator('artist_name')}</th>
                                    <th>Actions</th>
                                    {user.role === 'producer' && <th>Update</th>}
                                    {user.role === 'producer' && <th>Delete</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAudioFiles.map(file => (
                                    <tr key={file.id}>
                                        <td>{file.title}</td>
                                        <td>{file.status}</td>
                                        <td>{file.producer_name}</td>
                                        <td>{file.artist_name}</td>
                                        <td>
                                            <audio controls>
                                                <source src={`${import.meta.env.VITE_API_URL}${file.file}`} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </td>
                                        {user.role === 'producer' && (
                                            <>
                                                <td>
                                                    <Link to={`/update-file/${file.id}`}>
                                                        <Button variant="warning">Update</Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => handleDelete(file.id)}>Delete</Button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    );
};

export default AudioFilesPage;