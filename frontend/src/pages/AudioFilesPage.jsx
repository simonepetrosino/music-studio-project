import React, {useContext} from "react";
import Header from "../components/Header";
import {AuthContext} from '../context/AuthContext';
import useAxios from "../utils/useAxios";
import SessionCard from "../components/SessionCard";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Footer from "../components/Footer";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";


const AudioFilesPage = () => {
    let [audioFiles, setAudioFiles] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext);
    let { user } = useContext(AuthContext);

    let api = useAxios();

    useEffect(() => {
        getAudioFiles();
    }, []);
    
    
    let getAudioFiles = async () => {
        let response = await api.get("/api/audio_files/");
            
        if(response.status === 200){
            setAudioFiles(response.data);
        }
        console.log(response.data);
    };

    return (
        <Container fluid className="main-container bg-dark text-white">
            <Header />

                <div className='container-md' style={{marginBlock: '10%'}}>

                    {audioFiles.map(file => (
                        <Container key={file.id} className="d-flex justify-content-center">
                            <Card key={file.id} style={{ width: '18rem' }} className="m-2 bg-secondary text-white">
                            <Card.Body>
                                <Card.Text>Titolo: {file.title}</Card.Text>
                                <Card.Text>Status: {file.status}</Card.Text>
                                <Card.Text>Uploaded by: {file.producer_name}</Card.Text>
                                <Card.Text>Artist: {file.artist_name}</Card.Text>
                                <Button variant="dark" href={file.file} download>
                                        Download
                                </Button>
                            </Card.Body>
                        </Card>
                        </Container>
                    ))}
                </div>

                <Footer />
        </Container>
        
    );

};

export default AudioFilesPage;