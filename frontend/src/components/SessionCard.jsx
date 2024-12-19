import {React} from 'react';
import {Card, Button, Container} from 'react-bootstrap';

const SessionCard = ({session}) => {
    const formattedDate = new Date(session.start).toLocaleDateString();

    return (
        <Card className="text-center"  bg='secondary' text='white'>
            <Card.Header>{formattedDate}</Card.Header>
            <Card.Body>
                <Card.Title>{session.artist_name} session with {session.producer_name}</Card.Title>
                <Card.Text>
                    {session.description}
                </Card.Text>
                <Button variant="dark">View Details</Button>
            </Card.Body>
            <Card.Footer className="text-muted">{session.duration}</Card.Footer>
        </Card>

    );
}

export default SessionCard;