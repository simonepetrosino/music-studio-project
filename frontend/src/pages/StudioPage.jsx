import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import micImage from '../assets/mic.jpg';
import sg1Image from '../assets/sg1.jpg';
import sg3Image from '../assets/sg3.jpg';
import mpcImage from '../assets/mpc.jpg';
import focalImage from '../assets/focal.jpg';
import korgImage from '../assets/korg.jpg';
import guitarsImage from '../assets/guitars.jpg';
import apolloImage from '../assets/apollo.jpg';
import focalKorgImage from '../assets/focal-e-korg.jpg';
import offVideo from '../assets/off.mp4';
import './StudioPage.css';

const StudioPage = () => {
    return (
        <div className="studio-page-wrapper">
            <Header />
            <Container fluid className="studio-page-container">
                <Row className="justify-content-center" style={{ marginBlock: '5%' }}>
                    <Col md={10} lg={8} className="content-container">
                        <div className="d-flex mb-4 align-items-center">
                            <div className="video-container me-4">
                                <video controls autoPlay muted className="d-block w-100">
                                    <source src={offVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="text-container">
                                <h2 className="text-center">OffBeatz</h2>
                                <p>Il nostro studio offre una varietà di opzioni e attrezzature professionali per dare vita alle tue idee. Scorrendo troverai ciò che offriamo per soddisfare le tue esigenze musicali.</p>
                            </div>
                        </div>
                        <h1 className="text-center mb-4">Our Studio</h1>
                        <Row>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={sg1Image} alt="Studio Gear 1" fluid />
                                    <div className="caption">
                                        <h3>Vista 1 Studio</h3>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={sg3Image} alt="Studio Gear 3" fluid />
                                    <div className="caption">
                                        <h3>Vista 2 Studio</h3>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={micImage} alt="Microphone Setup" fluid />
                                    <div className="caption">
                                        <h3>AKG C414 XLII</h3>
                                        <h6>Microfono per catturare ogni dettaglio della tua voce o del tuo strumento</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={mpcImage} alt="MPC" fluid />
                                    <div className="caption">
                                        <h3>Maschine MK2</h3>
                                        <h6>Perfetta per beatmaking e produzione intuitiva</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={focalImage} alt="Focal" fluid />
                                    <div className="caption">
                                        <h3>Focal Alpha Twin Evo</h3>
                                        <h6>Monitor attivi per un ascolto preciso e dettagliato</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={korgImage} alt="Korg" fluid />
                                    <div className="caption">
                                        <h3>Korg Minilogue XD</h3>
                                        <h6>Sintetizzatore analogico polifonico con effetti digitali</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={guitarsImage} alt="Guitars" fluid />
                                    <div className="caption">
                                        <h3>Chitarre e basso</h3>
                                        <h6>Strumenti per ogni genere musicale e stile di suono</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={apolloImage} alt="Apollo" fluid />
                                    <div className="caption">
                                        <h3>Apollo Twin X</h3>
                                        <h6>Interfaccia audio professionale con emulazioni di preamplificatori e compressori analogici</h6>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="media-content">
                                    <Image src={focalKorgImage} alt="Focal e Korg" fluid />
                                    <div className="caption">
                                        <h3>Focal e Korg</h3>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default StudioPage;