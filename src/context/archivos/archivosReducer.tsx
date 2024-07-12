/* Types de este context */
import {
  OBTENER_ARCHIVOS,
  ELIMINAR_ARCHIVO,
  SUBIR_ARCHIVO,
  COLOCAR_CARGANDO_ARCHIVOS,
  LIMPIAR_ARCHIVOS,
  QUITAR_CARGANDO_ARCHIVOS,
} from '../types';

// eslint-disable-next-line
export default (state: any, action: any) => {
  switch (action.type) {
    case OBTENER_ARCHIVOS:
      return {
        ...state,
        archivos: action.payload.msg[0],
        cantidadArchivosBD: action.payload.msg[1],
        cargando: false,
      };

    case COLOCAR_CARGANDO_ARCHIVOS:
      return {
        ...state,
        cargando: true,
      };

    case QUITAR_CARGANDO_ARCHIVOS:
      return {
        ...state,
        cargando: false,
      };

    case LIMPIAR_ARCHIVOS:
      return {
        ...state,
        archivos: [],
        cantidadArchivosBD: 0,
      };

    case ELIMINAR_ARCHIVO:
      return {
        ...state,
        archivos: state.archivos.filter(
          (archivo: any) => archivo.id !== action.payload
        ),
        cantidadArchivosBD: state.cantidadArchivosBD - 1,
        cargando: false,
      };

    case SUBIR_ARCHIVO:
      return {};

    default:
      return state;
  }
};
