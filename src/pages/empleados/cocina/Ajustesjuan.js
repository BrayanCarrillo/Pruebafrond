import React from "react";
import './Ajustesjuan.css';
import { AiFillControl } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MdRestaurant } from "react-icons/md";
function Ajustesjuan (){
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
          <Link to="/Paneljuan" className="nav-link">Panel de control</Link>

          </div>
            </li>
            <li>
            <div className="iconosbarra">
            <MdRestaurant size={20} /> {/* Icono de cubiertos */}
          <Link to="/Panelcocina" className="nav-link">Cocina</Link>

          </div>
            </li>
            <li>
            <div className="iconosbarra">
            <IoMdSettings size={20} /> {/* Icono de cubiertos */}
          <Link to="/Ajustesjuan" className="nav-link">Ajustes</Link>

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

export default Ajustesjuan;