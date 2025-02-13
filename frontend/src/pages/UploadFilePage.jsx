import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Dropdown } from 'react-bootstrap';
import useAxios from '../utils/useAxios';
import Header from '../components/Header';
import './UploadFilePage.css';

const UploadFilePage = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [artists, setArtists] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const api = useAxios();
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchArtists();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

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
        setFilteredArtists([]);
        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedArtist = artists.find(a => a.username === artist);
        if (!selectedArtist) {
            alert('Selected artist is not valid');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', selectedArtist.id);
        formData.append('file', file);
        formData.append('status', status);

        // Fetch the producer's ID from the authenticated user
        try {
            const userResponse = await api.get('/api/user/');
            if (userResponse.status === 200) {
                const producerId = userResponse.data.id;
                formData.append('producer', producerId);
            } else {
                alert('Failed to fetch user data');
                return;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to fetch user data');
            return;
        }

        // Debugging: Log the form data
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await api.post('/api/audio-files/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                alert('Audio file uploaded successfully');
                setTitle('');
                setArtist('');
                setFile(null);
                setStatus('');
            }
        } catch (error) {
            console.error('Error uploading audio file:', error);
            alert('Failed to upload audio file');
        }
    };

    return (
        <div className="upload-file-page">
            <Header />
            <Container className="upload-file-container">
                <h1 className="text-center mb-4">Upload Audio File</h1>
                <Form onSubmit={handleSubmit} className="bg-dark text-white p-4 rounded" style={{ maxWidth: '500px', margin: '0 auto' }}>
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

                    <Form.Group controlId="formArtist" className="mb-3" ref={dropdownRef}>
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
                            <option value="">Select status</option>
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
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Upload
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default UploadFilePage;