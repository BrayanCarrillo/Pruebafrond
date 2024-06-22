import React from "react";
import './AjustesPedro.css';
import { AiFillControl } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { Link } from 'react-router-dom';
import { MdRestaurant } from "react-icons/md";
function AjustesPedro (){
    return(
    <div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Administración del Menú</title>
  <header className="navbar">
    <h1>Placeres del mar | OrdenBrivs</h1>
  </header>
  <div className="container">
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
            <MdRestaurant size={20} /> {/* Icono de cubiertos */}
          <Link to="/Orden" className="nav-link">Orden</Link>

          </div>
            </li>
            <li>
            <div className="iconosbarra">
            <IoMdSettings size={20} /> {/* Icono de cubiertos */}
          <Link to="/AjustesPedro" className="nav-link">Ajustes</Link>

          </div>
            </li>
            <li>
            <div className="iconosbarra">
            <IoMdSettings size={20} /> {/* Icono de cubiertos */}
          <Link to="/inicio" className="nav-link">Cerrar Sesión</Link>

          </div>
            </li>
      
      </ul>
    </div>
    <div className="content">
    <div className="page-title">
      <h1>Cambiar Contraseña</h1>
    </div>
    <div className="menu-list">
    <div className="input-container">
      <label htmlFor="new-password">Nueva Contraseña:</label>
      <input type="password" id="new-password" name="new-password" placeholder="Escribe tu nueva contraseña" />
        <button className="add-category-btn">Cambiar Contraseña</button>
      </div>
    </div>
    </div>
  </div>
</div>

    );
}

export default AjustesPedro;