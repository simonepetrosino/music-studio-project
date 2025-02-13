import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

const UpdateFilePage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [artistId, setArtistId] = useState(''); 
    const [status, setStatus] = useState('');
    const [file, setFile] = useState(null);
    const [currentFileUrl, setCurrentFileUrl] = useState('');
    const [artists, setArtists] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const api = useAxios();
    const { user, authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFileDetails();
        fetchArtists();
    }, []);

    const fetchFileDetails = async () => {
        try {
            const response = await api.get(`/api/audio-files/${id}/`);
            if (response.status === 200) {
                const fileData = response.data;
                setTitle(fileData.title);
                setArtist(fileData.artist_name);
                setArtistId(fileData.artist);
                setStatus(fileData.status);
                setCurrentFileUrl(fileData.file);
            }
        } catch (error) {
            console.error('Error fetching file details:', error);
        }
    };

    const fetchArtists = async () => {
        try {
            const response = await api.get('/api/artists/');
            if (response.status === 200) {
                setArtists(response.data);
                setFilteredArtists(response.data);
            }
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
    };

    const handleArtistChange = (e) => {
        const value = e.target.value;
        setArtist(value);
        setFilteredArtists(artists.filter(artist => artist.username.toLowerCase().includes(value.toLowerCase())));
        setShowDropdown(true);
    };

    const handleArtistSelect = (artist) => {
        setArtist(artist.username);
        setArtistId(artist.id);
        setFilteredArtists([]);
        setShowDropdown(false);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artistId);
        formData.append('status', status);
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('current_file_url', currentFileUrl); // Send current file URL if no new file is selected
        }

        // Log the form data to the console
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await api.put(`/api/audio-files/${id}/update/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            navigate('/audio-files');
        } catch (error) {
            console.error('There was an error updating the audio file!', error.response.data);
        }
    };

    return (
        <div>
            <Header />
            <Container fluid className="main-container bg-dark text-white">
                <div className='container-md' style={{ marginBlock: '10%' }}>
                    <Form onSubmit={handleUpdateSubmit}>
                        <Form.Group controlId="formTitle" className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formArtist" className="mb-3">
                            <Form.Label>Artist</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter artist name"
                                    value={artist}
                                    onChange={handleArtistChange}
                                    onFocus={() => setShowDropdown(true)}
                                    required
                                />
                                {showDropdown && filteredArtists.length > 0 && (
                                    <Dropdown.Menu show className="w-100 position-absolute">
                                        {filteredArtists.map(artist => (
                                            <Dropdown.Item key={artist.id} onClick={() => handleArtistSelect(artist)}>
                                                {artist.username}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="formStatus" className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="demo">Demo</option>
                                <option value="mix">Mix</option>
                                <option value="master">Master</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Audio File</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".mp3,.wav"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            {currentFileUrl && (
                                <>
                                    <div className="mt-2">Current file:</div>
                                    <audio controls className="mt-2">
                                        <source src={`${import.meta.env.VITE_API_URL}${currentFileUrl}`} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Update
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default UpdateFilePage;