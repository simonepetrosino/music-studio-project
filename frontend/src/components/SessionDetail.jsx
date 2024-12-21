import {React} from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import SessionCard from './SessionCard';
import { Tabs, Tab, Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';


const SessionDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const api = useAxios();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                let response = await api.get(`/api/session/${id}/`);
                if (response.status === 200) {
                    setSession(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };
        fetchSession();
    }, [id]);

    if (loading) return <h1>Loading...</h1>;

    return (
        <div>
            <Header />
            {session ? (
                <SessionCard session={session} />
            ) : (
                <h1>Session not found</h1>
            )}
            <Footer />
        </div>
    );
};






export default SessionDetail;