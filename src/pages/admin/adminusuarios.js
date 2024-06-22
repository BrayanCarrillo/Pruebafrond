import React, { useState, useEffect } from "react";
import { AiFillControl } from "react-icons/ai";
import { FiDatabase, FiEdit } from "react-icons/fi"; // Import FiEdit
import { MdOutlineRestaurant } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { MdTableRestaurant } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Pagination, Alert, Button } from 'react-bootstrap';
import "./adminusuarios.css";

function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDishAlert, setShowDishAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserName, setEditingUserName] = useState('');
  const registrosPorPagina = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/empleados');
      setUsers(response.data.empleados);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAgregarEmpleado = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/empleados', { 
        username: newUserName,
        status: true,
        role: newUserRole.toLowerCase(),
        password: '1234abcd'
      });
      fetchUsers();
      setNewUserName('');
      setNewUserRole('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEliminarEmpleado = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/empleados/${userToDelete.staffID}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setShowDishAlert(false);
    setUserToDelete(null);
  };

  const handleActualizarRol = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:8000/api/empleados/${id}/rol`, { role: newRole.toLowerCase() });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleToggleEstadoEmpleado = async (id, status) => {
    try {
      const newStatus = !status;
      await axios.put(`http://localhost:8000/api/empleados/${id}/estado`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling employee status:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginar = (datos, paginaActual) => {
    const startIndex = (paginaActual - 1) * registrosPorPagina;
    const endIndex = startIndex + registrosPorPagina;
    return datos.slice(startIndex, endIndex);
  };

  const usuariosPaginados = paginar(users, currentPage);

  const renderPagination = () => {
    const totalPages = Math.ceil(users.length / registrosPorPagina);
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination>{items}</Pagination>
    );
  };

  const showDeleteAlert = (user) => {
    setUserToDelete(user);
    setShowDishAlert(true);
  };

  const handleEditUserName = (user) => {
    setEditingUserId(user.staffID);
    setEditingUserName(user.username);
  };

  const handleUpdateUserName = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/empleados/${id}/actualizar-nombre`, { username: editingUserName });
      fetchUsers();
      setEditingUserId(null);
      setEditingUserName('');
    } catch (error) {
      console.error('Error updating user name:', error);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleUpdateUserName(id);
    }
  };

  return (
    <div className="app-container">
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
        <div className="content">
          <div id="page-content-wrapper" className="content-wrapper">
            <div className="table-wrapper">
              <div className="card mt-4">
                <div className="card-body">
                  <h1 className="mt-4">Administración de Empleados</h1>
                  <div className="card-text">
                    <p className="lead">Administración de Empleados Disponibles</p>
                    <p>Lista Actual de Empleados</p>
                  </div>
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead className="table-primary">
                        <tr>
                          <th>#</th>
                          <th>Usuario</th>
                          <th>Estado</th>
                          <th>Cargo</th>
                          <th>Opción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuariosPaginados.map((user) => (
                          <tr key={user.staffID}>
                            <td>{user.staffID}</td>
                            <td>
                              {editingUserId === user.staffID ? (
                                <input
                                  type="text"
                                  value={editingUserName}
                                  onChange={(e) => setEditingUserName(e.target.value)}
                                  onBlur={() => handleUpdateUserName(user.staffID)}
                                  onKeyDown={(e) => handleKeyDown(e, user.staffID)}
                                  autoFocus
                                />
                              ) : (
                                <>
                                  {user.username}
                                  <FiEdit className="ms-2" onClick={() => handleEditUserName(user)} style={{ cursor: 'pointer' }} />
                                </>
                              )}
                            </td>
                            <td>{user.status ? "Activo" : "Inactivo"}</td>
                            <td>
                              <select className="form-select" value={user.role} onChange={(e) => handleActualizarRol(user.staffID, e.target.value)}>
                                <option value="mesero">Mesero</option>
                                <option value="Chef">Chef</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className={user.status ? "btn btn-secondary" : "btn btn-success"}
                                onClick={() => handleToggleEstadoEmpleado(user.staffID, user.status)}
                              >
                                {user.status ? "Desactivar" : "Activar"}
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => showDeleteAlert(user)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {renderPagination()}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-wrapper">
              <div className="card mt-4">
                <div className="card-body">
                  <h2>Agregar Nuevo Empleado</h2>
                  <form onSubmit={handleAgregarEmpleado}>
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">
                        Nombre:
                      </label>
                      <input type="text" className="form-control" id="nombre" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="rol" className="form-label">
                        Rol:
                      </label>
                      <select className="form-select" id="rol" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} required>
                        <option value="">Seleccionar Rol</option>
                        <option value="mesero">Mesero</option>
                        <option value="Chef">Chef</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Agregar Empleado
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert show={showDishAlert} variant="danger" className="alert-fixed">
        <Alert.Heading>¡Atención!</Alert.Heading>
        <p>
          ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se podrá deshacer y podría afectar tus consultas.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShowDishAlert(false)} variant="success">
            Cancelar
          </Button>
          <Button onClick={handleEliminarEmpleado} variant="danger" className="ms-2">
            Borrar
          </Button>
        </div>
      </Alert>
    </div>
  );
}

export default AdminUsuarios;
