import React, { useState, useEffect } from "react";
import './Ventas.css';
import axios from 'axios';
import { MdAttachMoney } from "react-icons/md";
import { FiDatabase } from "react-icons/fi";
import { AiFillControl } from "react-icons/ai";
import { MdOutlineRestaurant } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { MdTableRestaurant } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Table, Pagination } from 'react-bootstrap';

function Ventas() {
    const [ventasData, setVentasData] = useState({
        hoy: null,
        semana: null,
        mes: null,
        todoElTiempo: null,
        ordenes: []
    });

    const [mesaDetalles, setMesaDetalles] = useState([]);
    const [ordenesPage, setOrdenesPage] = useState(1);
    const [mesaPage, setMesaPage] = useState(1);
    const registrosPorPagina = 10;

    useEffect(() => {
        async function fetchVentasData() {
            try {
                const [hoyResp, semanaResp, mesResp, todoElTiempoResp, ordenesResp, mesaDetallesResp] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/ganancias/hoy'),
                    axios.get('http://127.0.0.1:8000/api/ganancias/semana'),
                    axios.get('http://127.0.0.1:8000/api/ganancias/mes'),
                    axios.get('http://127.0.0.1:8000/api/ganancias/todo-el-tiempo'),
                    axios.get('http://127.0.0.1:8000/api/ordenes'),
                    axios.get('http://127.0.0.1:8000/api/detalles-mesa'),
                ]);

                setVentasData({
                    hoy: hoyResp.data.ganancias,
                    semana: semanaResp.data.ganancias,
                    mes: mesResp.data.ganancias,
                    todoElTiempo: todoElTiempoResp.data.ganancias,
                    ordenes: ordenesResp.data.ordenes,
                });

                setMesaDetalles(mesaDetallesResp.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchVentasData();
    }, []);

    const handleOrdenesPageChange = (pageNumber) => {
        setOrdenesPage(pageNumber);
    };

    const handleMesaPageChange = (pageNumber) => {
        setMesaPage(pageNumber);
    };

    const paginar = (datos, paginaActual) => {
        const startIndex = (paginaActual - 1) * registrosPorPagina;
        const endIndex = startIndex + registrosPorPagina;
        return datos.slice(startIndex, endIndex);
    };

    const ordenesPaginadas = paginar(ventasData.ordenes, ordenesPage);
    const mesaPaginadas = paginar(mesaDetalles, mesaPage);

    const renderPagination = (totalRecords, currentPage, onPageChange) => {
        const totalPages = Math.ceil(totalRecords / registrosPorPagina);
        const items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return (
            <Pagination>{items}</Pagination>
        );
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
                <div className="content">
                    <div className="container">
                        <div className="contenido">
                            <div className="titulo">
                                <h1>Administración de ventas</h1>
                                <p>Acá puedes ver las ventas hechas del restaurante.</p>
                            </div>
                            <div className="tabla-estadisticas">
                                <div className="icono-titulo">
                                    <MdAttachMoney size={25} />
                                    <h2>Estadísticas de Ventas</h2>
                                </div>
                                <table className="tabla-ventas">
                                    <tbody>
                                        <tr>
                                            <td>Hoy</td>
                                            <td>{ventasData.hoy}</td>
                                        </tr>
                                        <tr>
                                            <td>Esta semana</td>
                                            <td>{ventasData.semana}</td>
                                        </tr>
                                        <tr>
                                            <td>Este mes</td>
                                            <td>{ventasData.mes}</td>
                                        </tr>
                                        <tr>
                                            <td>Todo el tiempo</td>
                                            <td>{ventasData.todoElTiempo}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="icono-titulo">
                                    <MdAttachMoney size={25} />
                                    <h2>Lista de Órdenes de Ventas</h2>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th># Orden</th>
                                            <th>Menú</th>
                                            <th>Nombre de Plato</th>
                                            <th>Cantidad</th>
                                            <th>Estado</th>
                                            <th>Total (COP)</th>
                                            <th>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordenesPaginadas.map((orden, index) => (
                                            <tr key={index}>
                                                <td>{orden['Numero de Orden']}</td>
                                                <td>{orden['Menu']}</td>
                                                <td>{orden['Nombre del Plato']}</td>
                                                <td>{orden['Cantidad']}</td>
                                                <td>{orden['Estado']}</td>
                                                <td>{orden['Total (COP)']}</td>
                                                <td>{orden['Fecha']}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {renderPagination(ventasData.ordenes.length, ordenesPage, handleOrdenesPageChange)}

                                <div className="icono-titulo">
                                    <MdAttachMoney size={25} />
                                    <h2>Detalles de Mesas</h2>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nombre del Staff</th>
                                            <th>ID de la Mesa</th>
                                            <th>Nombre del Plato</th>
                                            <th>Total (COP)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mesaPaginadas.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>{detalle.staff_name}</td>
                                                <td>{detalle.mesaID}</td>
                                                <td>{detalle.menuItemName}</td>
                                                <td>{detalle.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {renderPagination(mesaDetalles.length, mesaPage, handleMesaPageChange)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ventas;
