import {React} from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';

const formatDateTime = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(dateString));
};


const SessionDetail = () => {

    const myParams = useParams();
    const id = myParams.id;

    let api = useAxios();

    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
            getSession();
        }, []);
    
    let getSession = async () => {
        let response = await api.get(`/api/session/${id}/`);
            
        if(response.status === 200){
            setSessions(response.data);
            setLoading(false);
        }
    };

    return (
        <div>
            { loading ? <h1>Loading...</h1> :
                <div>
                    <h1>{sessions.artist_name} session with {sessions.producer_name}</h1>
                    <p>{sessions.description}</p>
                    <p>Start: {formatDateTime(sessions.start)}</p>
                    <p>End: {formatDateTime(sessions.end)}</p>
                </div>
            }
        </div>
    );
}

export default SessionDetail;