import {React} from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxios from "../utils/useAxios";


const MyCalendar = ({myEvents}) => {

    const [sessions, setSessions] = useState([]);

    let api = useAxios();

    useEffect(() => {
        getSessions();
    }, []);

    let getSessions = async () => {
        let response = await api.get("/api/sessions/");
        
        if(response.status === 200){
            setSessions(response.data);
        }
    };

    const navigate = useNavigate();

    const eventClickAction = (data) => {
        navigate(`/sessionDetail/${data.event.id}`);
    };

    return (
        <FullCalendar 
            plugins={[ dayGridPlugin , timeGridPlugin, listPlugin ]}
            initialView="dayGridMonth"
            events = {sessions.map(event => ({
                id: event.id,
                title: `${event.artist_name} session with ${event.producer_name}`,
                start: event.start,
                end: event.end
            }))}

            eventClick={eventClickAction}
            timeZone="Europe/Rome"
            

            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            }}
        />
    );
}

export default MyCalendar;