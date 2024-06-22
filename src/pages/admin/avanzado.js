import React, { useEffect, useState, useCallback } from "react";
import './Ventas.css';
import { AiFillControl } from "react-icons/ai";
import { FiDatabase } from "react-icons/fi";
import { MdOutlineRestaurant } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { MdTableRestaurant } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer, Card, ListGroup, Button } from 'react-bootstrap';

function Avanzado() {
    const [nextBackup, setNextBackup] = useState(() => {
        const storedNextBackup = localStorage.getItem('nextBackup');
        return storedNextBackup ? parseInt(storedNextBackup, 10) : null;
    });
    const [timeLeft, setTimeLeft] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [errorLog, setErrorLog] = useState([]);

    const showToastMessage = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 5000);
    };

    const logError = (error) => {
        console.error('Error:', error);
        setErrorLog(prevLog => [...prevLog, error.message || 'Error desconocido']);
    };

    const handleBackup = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/backup', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'backup.sql');
            document.body.appendChild(link);
            link.click();

            const nextBackupTime = Date.now() + 12 * 60 * 60 * 1000; // 12 hours from now
            setNextBackup(nextBackupTime);
            localStorage.setItem('nextBackup', nextBackupTime.toString());

            showToastMessage('Backup creado con éxito', 'success');
        } catch (error) {
            logError(error);
            showToastMessage('Error creando el backup', 'danger');
        }
    }, []);

    const handleRestore = async (event, type) => {
        event.preventDefault();
        const fileInput = document.getElementById('backupFileInput');
        const file = fileInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('backupFile', file);

            try {
                const url = type === 'full' ? 'http://127.0.0.1:8000/api/restore' : 'http://127.0.0.1:8000/api/restore-data-only';
                const response = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Restore successful:', response.data);
                showToastMessage('Restauración exitosa', 'success');
            } catch (error) {
                logError(error);
                showToastMessage('Error restaurando el backup', 'danger');
            }
        } else {
            showToastMessage('Debe seleccionar un archivo para restaurar', 'warning');
        }
    };

    const updateTimer = useCallback(() => {
        if (nextBackup) {
            const timeLeftMs = nextBackup - Date.now();
            if (timeLeftMs <= 0) {
                handleBackup();
                setTimeLeft('Backup en progreso...');
            } else {
                const hours = Math.floor((timeLeftMs / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeLeftMs / (1000 * 60)) % 60);
                const seconds = Math.floor((timeLeftMs / 1000) % 60);
                setTimeLeft(`${hours} horas, ${minutes} minutos, ${seconds} segundos`);
            }
        } else {
            setTimeLeft('Backup en progreso...');
        }
    }, [nextBackup, handleBackup]);

    useEffect(() => {
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [updateTimer]);

    useEffect(() => {
        if (nextBackup === null) {
            const nextBackupTime = Date.now() + 12 * 60 * 60 * 1000;
            setNextBackup(nextBackupTime);
            localStorage.setItem('nextBackup', nextBackupTime.toString());
        }
    }, [nextBackup]);

    useEffect(() => {
        updateTimer();
    }, [nextBackup, updateTimer]);

    const clearErrorLog = () => {
        setErrorLog([]);
    };

    return (
        <div>
            <header className="navbar">
                <h1>Placeres del mar | OrdenBrivs</h1>
            </header>
            <div className="wrapper">
                <div className="sidebar">
                    <ul>
                        <li>
                            <div className="iconosbarra">
                                <AiFillControl size={20} />
                                <Link to="/panel" className="nav-link">Panel de Control</Link>
                            </div>
                        </li>
                        <li>
                            <div className="iconosbarra">
                                <MdOutlineRestaurant size={20} />
                                <Link to="/Categoria" className="nav-link">Menú</Link>
                            </div>
                        </li>
                        <li>
                            <div className="iconosbarra">
                                <MdEventAvailable size={20} />
                                <Link to="/Ventas" className="nav-link">Ventas</Link>
                            </div>
                        </li>
                        <li>
                            <div className="iconosbarra">
                                <IoPersonCircle size={20} />
                                <Link to="/adminusuarios" className="nav-link">Empleados</Link>
                            </div>
                        </li>
                        <li>
                            <div className="iconosbarra">
                                <MdTableRestaurant size={20} />
                                <Link to="/Mesa" className="nav-link">Mesas</Link>
                            </div>
                        </li>
                        <li>
                            <div className="iconosbarra">
                                <IoMdSettings size={20} />
                                <Link to="/Ajustes" className="nav-link">Contraseñas</Link>
                            </div>
                        </li>
                        <li>
                            <div className="iconosbarra">
                                <FiDatabase size={20} />
                                <Link to="/avanzado" className="nav-link">Copia de seguridad</Link>
                            </div>
                        </li>
                        <li>
                            <div className="iconosbarra">
                                <FaPowerOff size={20} />
                                <Link to="/inicio" className="nav-link">Cerrar sesión</Link>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="content container mt-4">
                    <h2 className="mb-4">Administración Avanzada</h2>
                    <div className="mb-3">
                        <p><strong>Próximo backup automático en:</strong></p>
                        <p>{timeLeft}</p>
                    </div>
                    <button onClick={handleBackup} className="btn btn-primary mb-3">Hacer Backup</button>
                    <form className="form-inline">
                        <input type="file" id="backupFileInput" name="backupFile" className="form-control mb-2 mr-sm-2" required />
                        <button onClick={(event) => handleRestore(event, 'full')} className="btn btn-success mb-2">Restaurar Backup Completo</button>
                        <button onClick={(event) => handleRestore(event, 'data')} className="btn btn-info mb-2 ml-2">Restaurar Sólo Datos</button>
                    </form>
                    <Card className="mt-3" bg="dark" text="white">
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Log de Errores</span>
                                <Button variant="danger" size="sm" onClick={clearErrorLog}>Limpiar Log</Button>
                            </div>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '200px', overflowY: 'auto', fontFamily: 'monospace' }}>
                            <ListGroup variant="flush">
                                {errorLog.length === 0 ? (
                                    <ListGroup.Item style={{ backgroundColor: 'black', color: 'white' }}>
                                        No hay errores registrados
                                    </ListGroup.Item>
                                ) : (
                                    errorLog.map((error, index) => (
                                        <ListGroup.Item key={index} style={{ backgroundColor: 'black', color: 'red' }}>
                                            {error}
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </div>
                <ToastContainer position="top-end" className="p-3">
                    <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastVariant}>
                        <Toast.Header>
                            <strong className="me-auto">Notificación</strong>
                        </Toast.Header>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>
        </div>
    );
}

export default Avanzado;
