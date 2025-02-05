import React, { useContext, useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from '../context/AuthContext';
import useAxios from "../utils/useAxios";

const AudioFilesPage = () => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
    const api = useAxios();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getAudioFiles();
    }, []);

    const getAudioFiles = async () => {
        try {
            let response = await api.get("/api/audio_files/");
            if (response.status === 200) {
                setAudioFiles(response.data);
            }
        } catch (error) {
            console.error('Error fetching audio files:', error);
        }
    };

    const sortedAudioFiles = React.useMemo(() => {
        let sortableFiles = [...audioFiles];
        if (sortConfig !== null) {
            sortableFiles.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableFiles;
    }, [audioFiles, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '';
    };

    return (
        <div>
            <Header />
            <Container fluid className="main-container bg-dark text-white">
                <div className='container-md' style={{ marginBlock: '10%' }}>
                    <div className="table-responsive">
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('title')} style={{ cursor: 'pointer' }}>Title {getSortIndicator('title')}</th>
                                    <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>Status {getSortIndicator('status')}</th>
                                    <th onClick={() => requestSort('producer_name')} style={{ cursor: 'pointer' }}>Uploaded by {getSortIndicator('producer_name')}</th>
                                    <th onClick={() => requestSort('artist_name')} style={{ cursor: 'pointer' }}>Artist {getSortIndicator('artist_name')}</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAudioFiles.map(file => (
                                    <tr key={file.id}>
                                        <td>{file.title}</td>
                                        <td>{file.status}</td>
                                        <td>{file.producer_name}</td>
                                        <td>{file.artist_name}</td>
                                        <td>
                                            <audio controls>
                                                <source src={file.file} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                            <Button variant="dark" href={file.file} download className="mt-2">
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    );
}

export default AudioFilesPage;