import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiDatabase } from "react-icons/fi";
import { AiFillControl } from "react-icons/ai";
import { MdOutlineRestaurant } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { MdTableRestaurant } from "react-icons/md";
import { Card, Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import "./Mesa.css"; // Archivo de estilos CSS

function Mesa() {
  const [mesas, setMesas] = useState([]);
  const [nuevaMesaNumero, setNuevaMesaNumero] = useState("");
  const [nuevaMesaActivate, setNuevaMesaActivate] = useState(true); // Estado para el campo activate
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMesaID, setAlertMesaID] = useState(null); // Estado para almacenar el ID de la mesa a eliminar

  useEffect(() => {
    obtenerMesas();
  }, []);

  const obtenerMesas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/mesas");
      console.log("Mesas obtenidas:", response.data);
      setMesas(response.data);
    } catch (error) {
      console.error("Error al obtener las mesas:", error);
    }
  };

  const agregarMesa = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/mesas", {
        mesaID: parseInt(nuevaMesaNumero),
        activate: nuevaMesaActivate, // Incluye el campo activate
      });
      console.log("Mesa agregada:", response.data);
      obtenerMesas();
      setNuevaMesaNumero("");
      setNuevaMesaActivate(true); // Restablecer el estado
    } catch (error) {
      console.error("Error al agregar mesa:", error);
    }
  };

  const cambiarEstadoMesa = async (mesaID, activate) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/mesas/${mesaID}/cambiar-estado`, {
        activate: activate,
      });
      console.log("Estado de la mesa cambiado:", response.data);
      obtenerMesas();
    } catch (error) {
      console.error("Error al cambiar estado de la mesa:", error);
    }
  };

  const confirmarEliminarMesa = (mesaID) => {
    setAlertMesaID(mesaID);
    setShowAlert(true);
  };

  const eliminarMesa = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/mesas/${alertMesaID}`);
      console.log("Mesa eliminada:", alertMesaID);
      obtenerMesas();
      setAlertMesaID(null);
      setShowAlert(false); // Oculta la alerta
    } catch (error) {
      console.error("Error al eliminar mesa:", error);
      setShowAlert(false); // Oculta la alerta en caso de error
    }
  };

  return (
    <Container>
      <header className="navbar">
        <h1>Placeres del mar | OrdenBrivs</h1>
      </header>
      <Row className="justify-content-start">
        <Col sm={3} className="pl-0">
          <div className="contenedor">
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
                        <li>
                            <div className="iconosbarra">
                                <FiDatabase size={20} />
                                <Link to="/avanzado" className="nav-link">Copia de seguridad</Link>
                            </div>
                        </li>
                            <div className="iconosbarra">
                                <FaPowerOff size={20} />
                                <Link to="/inicio" className="nav-link">Cerrar sesión</Link>
                            </div>
                        </li>

                    </ul>
            </div>
          </div>
        </Col>
        <Col sm={9}>
          <div className="contenido">
            <h1>Mesas</h1>
            {showAlert && (
              <Alert show={showAlert} variant="danger" className="alert-fixed">
                <Alert.Heading>¡Atención!</Alert.Heading>
                <p>
                  ¿Estás seguro de que deseas eliminar esta mesa? Esta acción no se podrá deshacer y podría afectar tus consultas.
                  Recomendamos "Desactivar" la mesa en lugar de eliminarla.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={() => setShowAlert(false)} variant="success">
                    Cancelar
                  </Button>
                  <Button onClick={eliminarMesa} variant="danger" className="ms-2">
                    Borrar
                  </Button>
                </div>
              </Alert>
            )}
            <div className="mesas-container">
              <Row>
                {mesas.map((mesa) => (
                  <Col key={mesa.mesaID} sm={4}>
                    <Card className="mb-3">
                      <Card.Body>
                        <Card.Title>Mesa {mesa.mesaID}</Card.Title>
                        <Button variant="danger" className="mr-2" onClick={() => confirmarEliminarMesa(mesa.mesaID)}>Eliminar</Button>
                        <Button variant="primary" onClick={() => cambiarEstadoMesa(mesa.mesaID, !mesa.activate)}>
                          {mesa.activate ? "Desactivar" : "Activar"}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
                <Col sm={4}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>Agregar Mesa</Card.Title>
                      <Form>
                        <Form.Group controlId="formNumeroMesa">
                          <Form.Control type="number" value={nuevaMesaNumero} onChange={(e) => setNuevaMesaNumero(e.target.value)} placeholder="Número de Mesa" />
                        </Form.Group>
                        <Form.Group controlId="formActivate">
                          <Form.Check
                            type="checkbox"
                            label="Activar Mesa"
                            checked={nuevaMesaActivate}
                            onChange={(e) => setNuevaMesaActivate(e.target.checked)}
                          />
                        </Form.Group>
                        <Button variant="success" onClick={agregarMesa}>Agregar Mesa</Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Mesa;
