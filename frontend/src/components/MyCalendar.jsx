import {React} from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { useNavigate } from 'react-router-dom';

const MyCalendar = ({myEvents}) => {

    const navigate = useNavigate();

    const eventClickAction = (data) => {
        navigate(`/sessionDetail/${data.event.id}`);
    };

    return (
        <FullCalendar
            plugins={[ dayGridPlugin , timeGridPlugin, listPlugin ]}
            initialView="dayGridMonth"
            events = {myEvents.map(event => ({
                id: event.id,
                title: `${event.artist_name} session with ${event.producer_name}`,
                start: event.start,
                end: event.end
            }))}

            eventClick={eventClickAction}
            

            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            }}
        />
    );
}

export default MyCalendar;