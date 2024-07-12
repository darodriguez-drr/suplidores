import {
  REGISTRO_EXITO,
  REGISTRO_FALLO,
  CARGAR_USUARIO,
  AUTENTICACION_ERROR,
  AUTENTICACION_EXITO,
  COLOCAR_GIF_CARGANDO,
  CERRAR_SESION,
  LIMPIAR_ERRORES,
} from '../types';
import Cookies from 'js-cookie';

// eslint-disable-next-line
export default (state: any, action: any) => {
  switch (action.type) {
    case CARGAR_USUARIO:
      return {
        ...state,
        estaAutenticado: true,
        cargando: false,
        token: action.payload.msg,
        usuario: action.payload.usuario,
        perfil: action.payload.perfil,
      };

    case AUTENTICACION_EXITO:
      return {
        ...state,
        estaAutenticado: true,
        cargando: false,
        token: action.payload.token,
        usuario: action.payload.usuario,
        perfil: action.payload.perfil,
      };

    case COLOCAR_GIF_CARGANDO:
      return {
        ...state,
        cargando: true,
      };

    case REGISTRO_EXITO:
      return {
        ...state,
        error: action.payload,
      };

    case REGISTRO_FALLO:
      return {
        ...state,
        error: action.payload,
      };

    case AUTENTICACION_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case CERRAR_SESION:
      Cookies.remove('PortalProveedores');
      return {
        ...state,
        estaAutenticado: false,
        cargando: false,
        error: null,
        usuario: null,
        token: null,
        perfil: null,
      };

    case LIMPIAR_ERRORES:
      return {
        ...state,
        estaAutenticado: null,
        cargando: false,
        error: null,
        usuario: null,
        token: null,
        perfil: null,
      };
    default:
      return state;
  }
};
