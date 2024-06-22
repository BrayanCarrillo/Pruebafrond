import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Pagination, Badge } from 'react-bootstrap';
import { AiFillControl } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { MdRestaurant } from 'react-icons/md';
import { FaPowerOff } from 'react-icons/fa';
import './Panelcocina.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Panelcocina() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [waitingOrderCount, setWaitingOrderCount] = useState(0);
  const [newWaitingOrderCount, setNewWaitingOrderCount] = useState(0);
  const itemsPerPage = 5;
  const audioRef = useRef(new Audio('notification.mp3'));

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // Actualizar cada 3 segundos
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  useEffect(() => {
    if (soundEnabled && newWaitingOrderCount > 0) {
      audioRef.current.play().catch(error => {
        console.log('Error playing notification sound:', error);
      });
    }
  }, [newWaitingOrderCount, soundEnabled]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/chef/all-orders');
      const allOrders = response.data.orders;
      const ordersWithDetails = allOrders.filter(order => order.orderDetails.length > 0);
      const newWaitingOrders = ordersWithDetails.filter(order => order.orderDetails.some(detail => detail.estado === 'esperando'));

      // Verificar si hay nuevas órdenes con estado "esperando"
      if (newWaitingOrders.length > waitingOrderCount) {
        setNewWaitingOrderCount(newWaitingOrders.length - waitingOrderCount);
      } else {
        setNewWaitingOrderCount(0); // Reset count if no new waiting orders
      }

      setOrders(ordersWithDetails);
      setWaitingOrderCount(newWaitingOrders.length); // Actualizar el contador de órdenes "esperando"
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/chef/update-order-status/${orderId}`, { status: newStatus });
      fetchOrders(); // Actualizar la lista de órdenes después de cambiar el estado
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/chef/delete-order/${orderId}`);
      fetchOrders(); // Actualizar la lista de órdenes después de eliminar la orden
    } catch (error) {
      console.error('Error deleting order:', error);
    }
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

  // Filtrar órdenes según el estado
  const filteredOrders = orders.flatMap(order => order.orderDetails.filter(detail => detail.estado !== 'listo'));

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                <Link to="/Paneljuan" className="nav-link">Panel de control</Link>
              </div>
            </li>
            <li>
              <div className="iconosbarra">
                <MdRestaurant size={20} />
                <Link to="/Panelcocina" className="nav-link">Cocina</Link>
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
        <div className="content">
          <div className="iconos">
            <span className="icon">
              <AiFillControl />
            </span>
            <h2>Listado de Últimas Órdenes Recibidas</h2>
          </div>
          <Button onClick={toggleSound}>
            {soundEnabled ? 'Deshabilitar sonido de notificación' : 'Habilitar sonido de notificación'}
          </Button>
          <div className="order-counter mt-3">
            <p>Órdenes esperando: <Badge variant="secondary">{waitingOrderCount}</Badge></p>
          </div>
          <div className="table-container">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Menú</th>
                  <th>Item de Menú</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? currentOrders.map(detail => (
                  <tr key={detail['ID de orden']}>
                    <td>{detail['ID de orden']}</td>
                    <td>{detail.menu}</td>
                    <td>{detail.menuItemName}</td>
                    <td>{detail.cantidad}</td>
                    <td>{detail.estado}</td>
                    <td>
                      {detail.estado === 'esperando' && (
                        <>
                          <Button variant="warning" size="sm" onClick={() => handleUpdateStatus(detail['ID de orden'], 'preparando')}>Preparando</Button>{' '}
                          <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(detail['ID de orden'], 'cancelado')}>Cancelar</Button>
                        </>
                      )}
                      {detail.estado === 'preparando' && (
                        <Button variant="success" size="sm" onClick={() => handleUpdateStatus(detail['ID de orden'], 'listo')}>Listo</Button>
                      )}
                      {detail.estado === 'listo' && (
                        <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(detail['ID de orden'], 'cancelado')}>Cancelar</Button>
                      )}
                      <Button variant="secondary" size="sm" onClick={() => handleDeleteOrder(detail['ID de orden'])}>Limpiar</Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center">No orders available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Panelcocina;
