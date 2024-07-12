/* Módulos importantes para el funcionamiento del Context */
import { useReducer } from 'react';
import AutenticacionContext from './autenticacionContext';
import autenticacionReducer from './autenticacionReducer';
import axios from 'axios';
import Cookies from 'js-cookie';

/* Importando types para utilizar en este context */
import {
  AUTENTICACION_EXITO,
  AUTENTICACION_ERROR,
  CERRAR_SESION,
  LIMPIAR_ERRORES,
  CARGAR_USUARIO,
  REGISTRO_EXITO,
  REGISTRO_FALLO,
  COLOCAR_GIF_CARGANDO,
} from '../types';

/* Todos los estados */
const AutenticacionState = (props: any) => {
  const initialState = {
    estaAutenticado: null,
    cargando: false,
    error: null,
    usuario: null,
    token: null,
    perfil: null,
  };

  /* Para usar el Reducer */
  const [state, dispath] = useReducer(autenticacionReducer, initialState);

  /* Todas las rutas necesarios para hacer request a API */
  const urlAuth = '/api/auth';
  const urlRegistro = '/api/user';
  /* Ruta para solicitar uuid */
  const apiUrl = '/api/form';

  /* Coloca el estado cargando en true, para que podamos mostrar el loading */
  const colocarLoadingGif = () => dispath({ type: COLOCAR_GIF_CARGANDO });

  /* Función para registrar usuario */
  const registrar = async (formData: any) => {
    /* Configuración de AXIOS */
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    /* Para hacer la petición a la URL de registro */
    try {
      const res = await axios.post(urlRegistro, formData, config);
      if (res.data.msg === 'El correo ya esta registrado en el sistema') {
        dispath({
          type: REGISTRO_FALLO,
          payload: res.data.msg,
        });
      }
      if (res.data.msg === 'El RNC ya esta registrado en el sistema') {
        dispath({
          type: REGISTRO_FALLO,
          payload: res.data.msg,
        });
      }
      if (
        res.data.msg !== '' &&
        res.data.msg !== 'El correo ya esta registrado en el sistema' &&
        res.data.msg !== 'El RNC ya esta registrado en el sistema'
      ) {
        dispath({
          type: REGISTRO_EXITO,
          payload: res.data,
        });
      }
      // If everything goes all right it calls loadUser, to authenticate the user with that token
      /*    loadUser(); */
    } catch (error: any) {
      if (error.response.data.errors.length > 0) {
        dispath({
          type: REGISTRO_FALLO,
          payload: error.response.data.errors[0].msg,
        });
      }
    }
  };

  /* Para el inicio de sesión */
  const iniciarSesion = async (data: any) => {
    /* Configuración par AXIOS */
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    /* Para autenticar al usuario enviamos un post con los datos a la API */
    try {
      const res = await axios.post(urlAuth, data, config);
      dispath({
        type: AUTENTICACION_EXITO,
        payload: res.data,
      });
      cargarUsuario();
    } catch (error: any) {
      if (error.response.data) {
        dispath({
          type: AUTENTICACION_ERROR,
          payload: error.response.data,
        });
      } else {
        dispath({
          type: AUTENTICACION_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

  /* Cerrar sesión */
  const cerrarSesion = async () => {
    /* Configuración par AXIOS */
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      await axios.delete(urlAuth, config);
      dispath({
        type: CERRAR_SESION,
      });
    } catch (error) {
      console.log('ERROR CERRAR SESION');
    }
  };

  /* Para cargar el usuario, sus datos y para saber si esta autenticado */
  const cargarUsuario = async () => {
    colocarLoadingGif();

    try {
      var token = await axios.get(apiUrl);
      if (token.data.msg !== 'No esta autenticado, acceso denegado') {
        if (Cookies.get('PortalProveedores') !== '') {
          var token2 = await axios.get('api/form/autorizar');
          dispath({
            type: CARGAR_USUARIO,
            payload: token2.data,
          });
        }
      } else {
        dispath({
          type: CERRAR_SESION,
        });
      }
    } catch (error) {
      dispath({
        type: CERRAR_SESION,
      });
    }
  };

  /* Limpiar errores */
  const limpiarErrores = () => {
    dispath({
      type: LIMPIAR_ERRORES,
    });
  };

  return (
    <AutenticacionContext.Provider
      // All the states and functions available in this Context
      value={{
        token: state.token,
        estaAutenticado: state.estaAutenticado,
        cargando: state.cargando,
        error: state.error,
        usuario: state.usuario,
        perfil: state.perfil,
        registrar,
        iniciarSesion,
        cerrarSesion,
        limpiarErrores,
        cargarUsuario,
        colocarLoadingGif,
      }}>
      {/* Esto es para que se comparta todos estos estados en los componentes que esten por debajo a este */}
      {props.children}
    </AutenticacionContext.Provider>
  );
};

export default AutenticacionState;
