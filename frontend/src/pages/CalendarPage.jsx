import React from 'react';
import MyCalendar from '../components/MyCalendar';
import Header from '../components/Header';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from '../components/Footer';
import './CalendarPage.css';

const CalendarPage = () => {
    return (
        <div className="calendar-page-wrapper">
            <Header />
            <Container fluid className="calendar-page-container">
                <Row className="justify-content-center" style={{ marginBlock: '10%' }}>
                    <Col md={10} lg={8} className="calendar-background">
                        <MyCalendar />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default CalendarPage;