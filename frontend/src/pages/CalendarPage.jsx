import {React} from 'react';
import MyCalendar from '../components/MyCalendar';
import Header from '../components/Header';
import { Container } from 'react-bootstrap';
import Footer from '../components/Footer';

const CalendarPage = () => {
    return (
        <Container fluid className="main-container bg-dark text-white">
            <Header />

            <div className='container-md' style={{marginBlock: '10%'}}>
                <MyCalendar />

            </div>

            <Footer />
        </Container>
    );
}

export default CalendarPage;