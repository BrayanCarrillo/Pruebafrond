import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa herramientas de enrutamiento de React Router
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa estilos de Bootstrap
import './App.css'; // Importa estilos específicos de la aplicación
import Inicio from './pages/inicio';
import Login from './pages/Login';
import Panel from './pages/admin/panel';
import AdminUsuarios from './pages/admin/adminusuarios';
import Ajustes from './pages/admin/Ajustes';
import Categoria from './pages/admin/Categoria';
import Mesa from './pages/admin/Mesa';
import Ventas from './pages/admin/Ventas';
import Paneljuan from './pages/empleados/cocina/Paneljuan';
import Panelcocina from './pages/empleados/cocina/Panelcocina';
import Ajustesjuan from './pages/empleados/cocina/Ajustesjuan';
import PanelPedro from './pages/empleados/mesero/PanelPedro';
import Orden from './pages/empleados/mesero/Orden';
import AjustesPedro from './pages/empleados/mesero/AjustesPedro';
import Avanzado from './pages/admin/avanzado'; // Importa el componente avanzado
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente para rutas protegidas
import { AuthProvider } from './context/AuthContext'; // Importa el contexto de autenticación

/**
 * Componente principal de la aplicación que configura las rutas y el contexto de autenticación.
 */
function App() {
  return (
    <AuthProvider> {/* Proveedor de contexto de autenticación */}
      <Router> {/* Envoltorio de enrutador para manejar las rutas de la aplicación */}
        {/* Suspense muestra un fallback mientras los componentes se cargan de forma asíncrona */}
        <Suspense fallback={<div className="loading">Loading...</div>}> 
          <Routes> {/* Contenedor para definir las rutas de la aplicación */}
            {/* Rutas públicas */}
            <Route exact path="/" element={<Inicio />} />
            <Route path="/Login" element={<Login />} />

            {/* Rutas protegidas que requieren autenticación */}
            <Route path="/panel" element={<ProtectedRoute element={<Panel />} />} />
            <Route path="/adminusuarios" element={<ProtectedRoute element={<AdminUsuarios />} />} />
            <Route path="/Ajustes" element={<ProtectedRoute element={<Ajustes />} />} />
            <Route path="/Categoria" element={<ProtectedRoute element={<Categoria />} />} />
            <Route path="/Mesa" element={<ProtectedRoute element={<Mesa />} />} />
            <Route path="/Ventas" element={<ProtectedRoute element={<Ventas />} />} />
            <Route path="/Paneljuan" element={<ProtectedRoute element={<Paneljuan />} />} />
            <Route path="/Panelcocina" element={<ProtectedRoute element={<Panelcocina />} />} />
            <Route path="/Ajustesjuan" element={<ProtectedRoute element={<Ajustesjuan />} />} />
            <Route path="/PanelPedro" element={<ProtectedRoute element={<PanelPedro />} />} />
            <Route path="/Orden" element={<ProtectedRoute element={<Orden />} />} />
            <Route path="/AjustesPedro" element={<ProtectedRoute element={<AjustesPedro />} />} />
            <Route path="/avanzado" element={<ProtectedRoute element={<Avanzado />} />} /> 

            {/* Rutas que no requieren autenticación */}
            <Route path="/inicio" element={<Inicio />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App; // Exporta el componente principal
