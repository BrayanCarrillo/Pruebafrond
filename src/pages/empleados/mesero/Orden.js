import React, { useState, useEffect } from 'react';
import { AiFillControl } from "react-icons/ai";
import { MdRestaurant } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Orden.css'; // Importa tus estilos CSS aquí

function MenuComponent() {
  const [categoriasPlatos, setCategoriasPlatos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [platosSeleccionados, setPlatosSeleccionados] = useState([]);
  const [mesaID, setMesaID] = useState('');
  const [totalCompra, setTotalCompra] = useState(0);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      obtenerCategoriasPlatos();
      obtenerMesas();
    }, 2000); // Actualiza cada 10 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  const obtenerCategoriasPlatos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categorias-platos');
      // Filtrar categorías y platos activos
      const categoriasActivas = response.data.categorias.filter(categoria => categoria.activate === 1);
      categoriasActivas.forEach(categoria => {
        categoria.items = categoria.items.filter(item => item.activate === 1);
      });
      setCategoriasPlatos(categoriasActivas);
    } catch (error) {
      console.error('Error al obtener categorías y platos:', error);
    }
  };

  const obtenerMesas = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/obtener-mesas');
      // Filtrar mesas activas
      const mesasActivas = response.data.mesas.filter(mesa => mesa.activate === 1);
      setMesas(mesasActivas);
    } catch (error) {
      console.error('Error al obtener las mesas:', error);
    }
  };

  const seleccionarPlato = (plato) => {
    const platoExistente = platosSeleccionados.find(item => item.itemID === plato.itemID);
    if (platoExistente) {
      const nuevosPlatos = platosSeleccionados.map(item =>
        item.itemID === plato.itemID ? { ...item, quantity: item.quantity + 1 } : item
      );
      setPlatosSeleccionados(nuevosPlatos);
    } else {
      setPlatosSeleccionados([...platosSeleccionados, { ...plato, quantity: 1 }]);
    }
    calcularTotalPedido([...platosSeleccionados, { ...plato, quantity: 1 }]);
  };

  const eliminarPlato = (plato) => {
    const nuevosPlatos = platosSeleccionados.filter(item => item !== plato);
    setPlatosSeleccionados(nuevosPlatos);
    calcularTotalPedido(nuevosPlatos);
  };

  const calcularTotalPedido = (platos) => {
    const total = platos.reduce((acumulador, plato) => acumulador + (plato.quantity * plato.price), 0);
    setTotalCompra(total);
  };

  const enviarOrden = async () => {
    try {
      if (mesaID === '' || platosSeleccionados.length === 0) {
        console.error('Por favor, selecciona una mesa y al menos un plato para enviar la orden.');
        return;
      }

      const ordenData = {
        mesaID: parseInt(mesaID), // Asegurarse de convertir a entero si es necesario
        items: platosSeleccionados.map(plato => ({
          itemID: plato.itemID,
          quantity: plato.quantity,
          menuID: plato.menuID
        }))
      };

      const response = await axios.post('http://127.0.0.1:8000/api/insertar-orden', ordenData);
      console.log('Respuesta del servidor:', response.data);

      // Limpiar platos seleccionados y mesa después de enviar la orden
      setPlatosSeleccionados([]);
      setMesaID('');
      setTotalCompra(0);

      // Aquí puedes manejar la respuesta del servidor según tus necesidades
      alert('Orden enviada correctamente!');
    } catch (error) {
      console.error('Error al enviar la orden:', error);
      alert('Error al enviar la orden. Por favor, inténtalo de nuevo.');
    }
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
                <AiFillControl size={20} /> {/* Icono de cubiertos */}
                <Link to="/PanelPedro" className="nav-link">Panel de control</Link>
              </div>
            </li>
            <li>
              <div className="iconosbarra">
                <MdRestaurant size={20} /> {/* Icono de restaurante */}
                <Link to="/Orden" className="nav-link">Orden</Link>
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
          <div className="categorias">
            <h2>Categorías</h2>
            {categoriasPlatos.map(categoria => (
              <div
                key={categoria.menuID}
                className={categoria.menuID === categoriaActiva ? 'categoria-card categoria-activa' : 'categoria-card'}
                onClick={() => setCategoriaActiva(categoria.menuID === categoriaActiva ? null : categoria.menuID)}
              >
                <h3 className="categoria-titulo">{categoria.menuName}</h3>
                {categoria.menuID === categoriaActiva && categoria.items.length > 0 && (
                  <ul className="categoria-items">
                    {categoria.items.map(item => (
                      <li key={item.itemID}>
                        {item.menuItemName} - Precio: ${item.price}
                        <button className="plato-btn" onClick={() => seleccionarPlato(item)}>Seleccionar</button>
                      </li>
                    ))}
                  </ul>
                )}
                {categoria.menuID === categoriaActiva && categoria.items.length === 0 && (
                  <p>No hay platos disponibles en esta categoría.</p>
                )}
              </div>
            ))}
          </div>
          <div className="lista-ordenes">
            <h2 className="titulo">Platos Seleccionados</h2>
            <table>
              <thead>
                <tr>
                  <th>Plato</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Mesa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {platosSeleccionados.map(plato => (
                  <tr key={plato.itemID}>
                    <td>{plato.menuItemName}</td>
                    <td>${plato.price}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={plato.quantity}
                        onChange={(e) => {
                          const cantidad = parseInt(e.target.value);
                          const nuevosPlatos = platosSeleccionados.map(item =>
                            item.itemID === plato.itemID ? { ...item, quantity: cantidad } : item
                          );
                          setPlatosSeleccionados(nuevosPlatos);
                          calcularTotalPedido(nuevosPlatos);
                        }}
                      />
                    </td>
                    <td>${plato.quantity * plato.price}</td>
                    <td>
                      <select
                        className="mesa-seleccionar"
                        value={mesaID}
                        onChange={(e) => setMesaID(e.target.value)}
                      >
                        <option value="">Seleccione una mesa</option>
                        {mesas.map(mesa => (
                          <option key={mesa.mesaID} value={mesa.mesaID}>Mesa {mesa.mesaID}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="iconosbarra">
                        <button className="edit-btn" onClick={() => eliminarPlato(plato)}>Cancelar</button>
                        <button className="delete-btn" onClick={enviarOrden}>Enviar Orden</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <strong>Total de la Compra:</strong> ${totalCompra}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuComponent;
