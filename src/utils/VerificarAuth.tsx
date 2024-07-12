/* Módulos importantes para el funcionamiento de este componente */
import React, { useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AutenticacionContext from '../context/autenticacion/autenticacionContext';

/* Ruta para solicitar token */
const apiUrl = '/api/form';

/* Configuración de AXIOS */
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/* Función con la que hacemos la petición a la API */
const VerificarToken: any = async () => {
  const autenticacionContext = useContext(AutenticacionContext);
  const { cargarUsuario }: any = autenticacionContext;
  const token = await axios.get(apiUrl, config);

  if (token.data.msg !== '') {
    if (Cookies.get('PortalProveedores') !== '') {
      cargarUsuario();
      return true;
    }
  } else {
    return false;
  }
};

export default VerificarToken;
