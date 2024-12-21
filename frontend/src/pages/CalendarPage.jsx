import {React} from 'react';
import MyCalendar from '../components/MyCalendar';
import Header from '../components/Header';
import { Container } from 'react-bootstrap';
import Footer from '../components/Footer';
import { Row, Col } from 'react-bootstrap';

const CalendarPage = () => {
    return (
        <Container fluid className="main-container bg-dark text-white">
            <Header />

            <Row className="justify-content-center" style={{ marginBlock: '10%' }}>
                <Col md={10} lg={8}>
                    <MyCalendar />
                </Col>
            </Row>

            <Footer />
        </Container>
    );
}

export default CalendarPage;