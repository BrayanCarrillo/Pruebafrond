import React, { useState, useEffect, useRef } from "react";
import { AiFillControl } from "react-icons/ai";
import { MdRestaurant } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './PanelPedro.css';
import { Button, Badge, Table, Pagination } from 'react-bootstrap';

function PanelPedro() {
  const [ordenes, setOrdenes] = useState([]);
  const [empleados, setEmpleados] = useState([
    { nombre: "Pedro", cargo: "Mesero", estado: "Online" },
    // Agrega más empleados según sea necesario
  ]);
  const [newReadyOrdersCount, setNewReadyOrdersCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const audioRef = useRef(new Audio('notification.mp3'));

  useEffect(() => {
    fetchOrdenesListas();
    const interval = setInterval(fetchOrdenesListas, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (soundEnabled && newReadyOrdersCount > 0) {
      audioRef.current.play().catch(error => {
        console.log('Error playing notification sound:', error);
      });
    }
  }, [newReadyOrdersCount, soundEnabled]);

  const fetchOrdenesListas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ordenes/listas');
      const data = await response.json();
      const newReadyOrders = data.ordenes.filter(order => order.estado === 'listo');
      
      if (newReadyOrders.length > ordenes.filter(order => order.estado === 'listo').length) {
        setNewReadyOrdersCount(newReadyOrders.length);
      } else {
        setNewReadyOrdersCount(0);
      }

      setOrdenes(newReadyOrders);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  const toggleEstado = (index) => {
    const updatedEmpleados = [...empleados];
    updatedEmpleados[index].estado = updatedEmpleados[index].estado === "Online" ? "Offline" : "Online";
    setEmpleados(updatedEmpleados);
  };

  const toggleSound = () => {
    setSoundEnabled(prevSoundEnabled => {
      if (!prevSoundEnabled) {
        audioRef.current.play().catch(error => {
          console.log('Error playing audio: User interaction required.', error);
        });
      }
      return !prevSoundEnabled;
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = ordenes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ordenes.length / itemsPerPage);

  return (
    <div>
      <header className="navbar">
        <h1>Placeres del mar | OrdenBrivs</h1>
      </header>
      <div className="wrapper">
        <div className="sidebar">
          <ul>
            <SidebarItem icon={<AiFillControl size={20} />} to="/PanelPedro" text="Panel de control" />
            <SidebarItem icon={<MdRestaurant size={20} />} to="/Orden" text="Orden" />
            <SidebarItem icon={<FaPowerOff size={20} />} to="/inicio" text="Cerrar sesión" />
          </ul>
        </div>
        <div className="container">
          <div className="content">
            <div className="page-title">
              <h1 className="text-center mt-4">Panel de empleado</h1>
              <p className="lead text-center">Las más recientes órdenes listas</p>
              <Button onClick={toggleSound}>
                {soundEnabled ? 'Deshabilitar sonido de notificación' : 'Habilitar sonido de notificación'}
              </Button>
              <div className="order-counter mt-3">
                <p>Órdenes listas: <Badge variant="secondary">{ordenes.filter(order => order.estado === 'listo').length}</Badge></p>
              </div>
              <div className="table-container">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Fecha</th>
                      <th>Mesa</th>
                      <th>Nombre del plato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((orden) => (
                      <tr key={orden.orderID}>
                        <td>{orden.orderID}</td>
                        <td>{orden.estado}</td>
                        <td>{orden.total}</td>
                        <td>{orden.fecha_orden}</td>
                        <td>{orden.mesaID}</td>
                        <td>{orden.menuItemName}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            </div>
            {/* Tabla de personal */}
            <div className="card">
              <div className="card-header">
                Estado
              </div>
              <div className="card-body">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Personal</th>
                      <th>Cargo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map((empleado, index) => (
                      <tr key={index}>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.cargo}</td>
                        <td>
                          <button 
                            onClick={() => toggleEstado(index)} 
                            className={empleado.estado === "Online" ? "btn btn-success" : "btn btn-danger"}
                          >
                            {empleado.estado}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, to, text }) => (
  <li>
    <div className="iconosbarra">
      {icon}
      <Link to={to} className="nav-link">{text}</Link>
    </div>
  </li>
);

export default PanelPedro;
