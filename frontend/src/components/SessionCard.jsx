import {React} from 'react';
import {Card, Button, Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import {useState} from 'react';

const SessionCard = ({session}) => {
    const [currentStatus, setCurrentStatus] = useState(session.status);
    const formattedStartDate = new Date(session.start).toLocaleString();
    const formattedEndDate = new Date(session.end).toLocaleString();

    const navigate = useNavigate();
    const api = useAxios();
    const { user } = useContext(AuthContext);

    const handleViewDetails = () => {
        navigate(`/sessionDetail/${session.id}`);
    };

    const handleChangeStatus = async (newStatus) => {
        try {
            const response = await api.put(`/api/session/${session.id}/status/`, {
                status: newStatus
            });
            if (response.status === 200) {
                setCurrentStatus(newStatus);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };


    return (
        <Card className="text-center"  bg='secondary' text='white'>
            <Card.Header>
            Start: {formattedStartDate} <br />
            End: {formattedEndDate}
            </Card.Header>
            <Card.Body>
                <Card.Title>{session.artist_name} session with {session.producer_name}</Card.Title>
                <Card.Text>Current Status: {currentStatus}</Card.Text>
                <Button variant="dark" onClick={handleViewDetails}>View Details</Button>
                {user && user.role === 'producer' && (
                    <>
                        <Button variant="success" onClick={() => handleChangeStatus('approved')} style={{ marginLeft: '10px' }}>Approve</Button>
                        <Button variant="danger" onClick={() => handleChangeStatus('rejected')} style={{ marginLeft: '10px' }}>Reject</Button>
                    </>
                )}
            </Card.Body>
            <Card.Footer className="text-muted">{session.duration}</Card.Footer>
        </Card>

    );
}

export default SessionCard;