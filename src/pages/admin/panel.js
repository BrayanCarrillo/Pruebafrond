import React, { useState, useEffect, useRef } from "react"; // Importaciones de React para manejar estados, efectos y referencias
import './panel.css';
import { AiFillControl } from "react-icons/ai";
import { FiDatabase } from "react-icons/fi";
import { MdOutlineRestaurant, MdEventAvailable, MdTableRestaurant } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Pagination, Button, Badge } from 'react-bootstrap';

function Panel() {
  // Estados para manejar datos y configuraciones del componente
  const [ordenes, setOrdenes] = useState([]); // Órdenes listas
  const [empleados, setEmpleados] = useState([]); // Lista de empleados
  const [ordenesPagina, setOrdenesPagina] = useState(1); // Página actual de órdenes
  const [empleadosPagina, setEmpleadosPagina] = useState(1); // Página actual de empleados
  const [newReadyOrdersCount, setNewReadyOrdersCount] = useState(0); // Contador de nuevas órdenes listas
  const [soundEnabled, setSoundEnabled] = useState(false); // Estado del sonido de notificación
  const registrosPorPagina = 5; // Cantidad de registros por página para la paginación
  const audioRef = useRef(new Audio('notification.mp3')); // Referencia a un objeto de audio

  // Efecto para cargar datos y configurar intervalos de actualización
  useEffect(() => {
    fetchOrdenesListas();
    fetchEmpleados();
    const interval = setInterval(fetchOrdenesListas, 3000); // Actualiza cada 3 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  // Efecto para reproducir sonido cuando hay nuevas órdenes listas
  useEffect(() => {
    if (soundEnabled && newReadyOrdersCount > 0) {
      audioRef.current.play().catch(error => {
        console.log('Error playing notification sound:', error);
      });
    }
  }, [newReadyOrdersCount, soundEnabled]);

  // Función para obtener órdenes listas desde la API
  const fetchOrdenesListas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ordenes/listas');
      const data = await response.json();
      const newReadyOrders = data.ordenes.filter(order => order.estado === 'listo');

      const previousReadyOrdersCount = ordenes.filter(order => order.estado === 'listo').length;
      const currentReadyOrdersCount = newReadyOrders.length;

      if (currentReadyOrdersCount > previousReadyOrdersCount) {
        setNewReadyOrdersCount(currentReadyOrdersCount - previousReadyOrdersCount);
      } else {
        setNewReadyOrdersCount(0);
      }

      setOrdenes(newReadyOrders);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  // Función para obtener la lista de empleados desde la API
  const fetchEmpleados = () => {
    axios.get('http://127.0.0.1:8000/api/employees')
      .then(response => {
        setEmpleados(response.data.employees);
      })
      .catch(error => {
        console.error('Error al obtener datos de la API de empleados:', error);
      });
  };

  // Función para alternar el estado del sonido de notificación
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

  // Función para cambiar la página actual en la paginación
  const handlePageChange = (setPage, pageNumber) => {
    setPage(pageNumber);
  };

  // Función para paginar los datos
  const paginar = (datos, paginaActual) => {
    const startIndex = (paginaActual - 1) * registrosPorPagina;
    const endIndex = startIndex + registrosPorPagina;
    return datos.slice(startIndex, endIndex);
  };

  // Datos paginados de órdenes y empleados
  const ordenesPaginadas = paginar(ordenes, ordenesPagina);
  const empleadosPaginados = paginar(empleados, empleadosPagina);

  // Renderiza la paginación
  const renderPagination = (items, currentPage, setPage) => {
    const totalPages = Math.ceil(items.length / registrosPorPagina);
    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
      paginationItems.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(setPage, number)}>
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination>{paginationItems}</Pagination>
    );
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Panel de administración</title>
      <header className="navbar">
        <h1>Placeres del mar | OrdenBrivs</h1>
      </header>
      <div className="wrapper">
        <div className="sidebar">
          <ul>
            {/* Menú de navegación en la barra lateral */}
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
                  <thead className="table-primary">
                    <tr>
                      <th># Orden</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Fecha</th>
                      <th>Mesa</th>
                      <th>Nombre del plato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenesPaginadas.map((orden) => (
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
                {ordenes.length > registrosPorPagina && renderPagination(ordenes, ordenesPagina, setOrdenesPagina)}
              </div>
            </div>
            <div>
              <p className="lead text-center">Disponibilidad del Personal</p>
              <div className="card">
                <div className="card-header">
                  Personal Estado
                </div>
                <div className="card-body">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleadosPaginados.map((empleado, index) => (
                        <tr key={index}>
                          <td>{empleado.username}</td>
                          <td>
                            <span className={empleado.status ? "badge bg-success" : "badge bg-danger"}>
                              {empleado.status ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {empleados.length > registrosPorPagina && renderPagination(empleados, empleadosPagina, setEmpleadosPagina)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panel; // Exporta el componente
