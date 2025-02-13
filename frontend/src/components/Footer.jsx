import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
      <Row>
          <Col md={4} className="text-center mb-3">
            <h5>Chi siamo</h5>
            <p>OffBeatz Studio è uno studio di registrazione professionale che offre servizi di alta qualità per artisti e produttori.</p>
          </Col>
          <Col md={4} className="text-center mb-3">
          <h5>Social dei produttori</h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://www.instagram.com/offbeatzstudio" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaInstagram /> OffBeatz Studio
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/producer1" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaInstagram /> Producer 1
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/producer2" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaInstagram /> Producer 2
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/producer3" className="text-white" target="_blank" rel="noopener noreferrer">
                  <FaInstagram /> Producer 3
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="text-center mb-3">
            <h5>Contatti</h5>
            <p>Email: info@offbeatzstudio.com</p>
            <p>Telefono: +39 123 456 7890</p>
            <p>Indirizzo: Via Roma 123, 00100 Firenze, Italia</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p>&copy; OffBeatz Studio 2023. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
