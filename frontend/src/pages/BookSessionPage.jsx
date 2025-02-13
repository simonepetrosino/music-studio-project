import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import useAxios from '../utils/useAxios';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import './BookSessionPage.css';

const BookSessionPage = () => {
    const [producers, setProducers] = useState([]);
    const [artists, setArtists] = useState([]);
    const [producerId, setProducerId] = useState('');
    const [artistId, setArtistId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timeOptions, setTimeOptions] = useState([]);
    const [bookedSessions, setBookedSessions] = useState([]);
    const api = useAxios();
    const { user, authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducers();
        fetchArtists();
        setInitialDate();
    }, []);

    useEffect(() => {
        if (date) {
            fetchBookedSessions(date);
        }
    }, [date]);

    useEffect(() => {
        setTimeOptions(generateTimeOptions());
    }, [date, bookedSessions]);

    const fetchProducers = async () => {
        try {
            const response = await api.get('/api/producers/');
            if (response.status === 200) {
                setProducers(response.data);
            }
        } catch (error) {
            console.error('Error fetching producers:', error);
        }
    };

    const fetchArtists = async () => {
        try {
            const response = await api.get('/api/artists/');
            if (response.status === 200) {
                setArtists(response.data);
            }
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
    };

    const fetchBookedSessions = async (selectedDate) => {
        try {
            const response = await api.get(`/api/sessions/${selectedDate}/`);
            if (response.status === 200) {
                setBookedSessions(response.data);
            }
        } catch (error) {
            console.error('Error fetching booked sessions:', error);
        }
    };

    const setInitialDate = () => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        setDate(currentDate);
    };

    const calculateEndTime = (startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endTime = new Date();
        endTime.setHours(hours);
        endTime.setMinutes(minutes + Number(duration));
        const endHours = String(endTime.getHours()).padStart(2, '0');
        const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
        const endDate = endTime.getDate() !== new Date().getDate() ? new Date(endTime.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : date;
        return { endHours, endMinutes, endDate };
    };

    const getUserIdFromToken = () => {
        if (authTokens) {
            const decodedToken = jwtDecode(authTokens.access);
            return decodedToken.user_id;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { endHours, endMinutes, endDate } = calculateEndTime(startTime, duration);
        const userId = getUserIdFromToken();

        const start = `${date}T${startTime}:00`;
        const end = `${endDate}T${endHours}:${endMinutes}:00`;

        const requestData = {
            producer: producerId,
            artist: artistId,
            start,
            end,
            description,
        };

        if (user.role === 'artist') {
            requestData.producer = producerId;
            requestData.artist = userId;
        } else if (user.role === 'producer') {
            requestData.producer = userId;
            requestData.artist = artistId;
        }

        console.log('Request Data:', requestData);

        try {
            const response = await api.post('/api/book-session/', requestData);

            if (response.status === 201) {
                setSuccess('Session booked successfully!');
                setTimeout(() => {
                    navigate('/sessions');
                }, 2000);
            }
        } catch (error) {
            setError('Error booking session. There is a session already booked in this time period. Please try again.');
            console.error('Error booking session:', error);
        }
    };

    const generateTimeOptions = () => {
        const options = [];
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        for (let hour = 0; hour < 24; hour++) {
            if (hour >= 5 && hour < 10) {
                continue; // Skip hours from 5 to 10 AM
            }
            if (date === now.toISOString().split('T')[0] && hour <= currentHour) {
                if (hour === currentHour && currentMinutes > 0) {
                    continue;
                }
            }
            const hourString = String(hour).padStart(2, '0');
            const isBooked = bookedSessions.some(session => {
                const sessionStart = new Date(session.start);
                const sessionEnd = new Date(session.end);
                const optionTime = new Date(`${date}T${hourString}:00`);
                return optionTime >= sessionStart && optionTime < sessionEnd;
            });
            if (!isBooked) {
                options.push(`${hourString}:00`);
            }
        }
        return options;
    };

    return (
        <div className="book-session-page-wrapper">
            <Header />
            <Container fluid className="book-session-page-container">
                <div className='container-md' style={{ marginBlock: '5%' }}>
                    <h2>Book a Session</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        {user.role === 'artist' && (
                            <Form.Group controlId="formProducer" className="mb-3">
                                <Form.Label>Producer</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={producerId}
                                    onChange={(e) => setProducerId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a producer</option>
                                    {producers.map(producer => (
                                        <option key={producer.id} value={producer.id}>
                                            {producer.username}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}

                        {user.role === 'producer' && (
                            <Form.Group controlId="formArtist" className="mb-3">
                                <Form.Label>Artist</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={artistId}
                                    onChange={(e) => setArtistId(e.target.value)}
                                    required
                                >
                                    <option value="">Select an artist</option>
                                    {artists.map(artist => (
                                        <option key={artist.id} value={artist.id}>
                                            {artist.username}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        )}

                        <Form.Group controlId="formDate" className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formStartTime" className="mb-3">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                as="select"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            >
                                <option value="">Select start time</option>
                                {timeOptions.map(time => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formDuration" className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                as="select"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            >
                                <option value="">Select duration</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                                <option value="180">3 hours</option>
                                <option value="240">4 hours</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formDescription" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                placeholder="scrivi in questo campo ciò che vorresti fare durante la sessione"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Book Session
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default BookSessionPage;