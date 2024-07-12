import React, { Fragment } from 'react';
import './App.css';
import Login from './components/pages/external/Login';
import Form from './components/pages/external/Form';
import Register from './components/pages/external/Register';
import Notfound from './components/pages/external/Notfound';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import Admin from './components/pages/internal/Admin';
import Defaultpage from './components/pages/Defaultpage';
import AlertaState from './context/alerta/AlertaState';
import AutenticacionState from './context/autenticacion/AutenticacionState';
import Alertas from './components/layout/Alertas';
import RutaPrivada from './utils/RutaPrivada';
import EstadosFormulario from './context/formulario/FormularioState';
import AdminState from './context/admin/AdminState';
import ArchivosState from './context/archivos/ArchivosState';
import CamposReqAprb from './components/pages/internal/CamposReqAprb';

/* cargarUsuario(); */

const App = () => {
  return (
    /* Context para manejar las alertas del usuario */
    <AlertaState>
      {/* Context para manejar la autenticación del usuario */}
      <AutenticacionState>
        {/* Context o Estados del formulario */}
        <EstadosFormulario>
          {/* Context o Estados de administrador */}
          <AdminState>
            {/* Context o estados de los archivos del usuario */}
            <ArchivosState>
              {/* Pata rediriguir automáticamente */}
              {/* Se tenía browserRouter antes, pero se quito porque no permite escribir manualmente el URL, da error */}
              <HashRouter>
                <Fragment>
                  {/* Para que aparezcan las alertas dentro de los componentes */}
                  <Alertas />
                  {/* Para definir las rutas de la aplicación */}
                  <Routes>
                    {/* ---------------- Externas ------------- */}
                    {/* Para que inicie sesión el solicitante o admin */}
                    <Route
                      path='/login'
                      element={
                        <Login htmlTitle='Iniciar sesión - Portal proveedores' />
                      }
                    />
                    {/* Para registrar prospecto */}
                    <Route
                      path='/register'
                      element={
                        <Register htmlTitle='Registro - Portal proveedores' />
                      }
                    />
                    {/* Formulario del solicitante */}
                    {/* Ruta progegida - debes estar autenticado para poder entrar */}
                    <Route
                      path='/form'
                      element={
                        <RutaPrivada
                          component={Form}
                          htmlTitle='Formulario - Portal proveedores'
                        />
                      }
                    />
                    {/* ---------------- Internas ------------- */}
                    {/* Para administradores */}
                    {/* Ruta protegida - debes estar autenticado para poder entrar */}
                    <Route
                      path='/admin'
                      element={
                        <RutaPrivada
                          component={Admin}
                          htmlTitle='Administrador - Portal proveedores'
                        />
                      }
                    />
                    {/* Pagina principal al iniciar sesión */}
                    {/* Ruta protegida - debes estar autenticado para poder entrar */}
                    {/* Ruta para solicitantes o administradores */}
                    <Route
                      path='/defaultpage'
                      element={
                        <RutaPrivada
                          component={Defaultpage}
                          htmlTitle='Página principal - Portal proveedores'
                        />
                      }
                    />
                    <Route
                      path='/camposreqaprb'
                      element={
                        <RutaPrivada
                          component={CamposReqAprb}
                          htmlTitle='Campos que requieren aprobación - Portal proveedores'
                        />
                      }
                    />
                    {/* ---------------- Internas y externas ------------- */}
                    {/* Para cuando no encontremos ninguna ruta */}
                    <Route
                      path='*'
                      element={
                        <Notfound htmlTitle='No encontrada - Portal proveedores' />
                      }
                    />
                  </Routes>
                </Fragment>
              </HashRouter>
            </ArchivosState>
          </AdminState>
        </EstadosFormulario>
      </AutenticacionState>
    </AlertaState>
  );
};

export default App;
