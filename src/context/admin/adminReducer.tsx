import {
  OBTENER_SOLICITANTES,
  FILTRAR_SOLICITANTES,
  LIMPIAR_SOLICITANTES,
  COLOCAR_GIF_CARGANDO,
  LIMPIAR_DATOS_SOLICITANTES,
  OBTENER_SOLICITANTES_ESPECIFICOS,
  COLOCAR_GIF_CARGANDOMODAL,
  APLICAR_ESTADO_USR,
  LIMPIAR_ESTADO_USR,
  DESBLOQUEAR_USUARIO,
  BLOQUEAR_USUARIO,
  LIMPIAR_DATOS_MAESTROS,
  OBTENER_CANTIDAD_PENDIENTES,
  OBTENER_LISTA_CAMPOS_PENDIENTES_APRB,
} from '../types';

// eslint-disable-next-line
export default (state: any, action: any) => {
  switch (action.type) {
    case OBTENER_SOLICITANTES:
      return {
        ...state,
        datosAdmin: action.payload,
        cargando: false,
        cargandoModal: false,
      };

    case OBTENER_SOLICITANTES_ESPECIFICOS:
      return {
        ...state,
        datosMaestrosUSR: action.payload,
        cargando: false,
        cargandoModal: false,
      };

    case OBTENER_LISTA_CAMPOS_PENDIENTES_APRB:
      return {
        ...state,
        listaPendientes: action.payload,
        cargando: false,
        cargandoModal: false,
      };

    case OBTENER_CANTIDAD_PENDIENTES:
      return {
        ...state,
        cantidadPendientes: action.payload.msg,
        cargando: false,
        cargandoModal: false,
      };

    case FILTRAR_SOLICITANTES:
      return {
        ...state,
        /* APlicamos un filtro para mostrar solo los que cumplan con el
        nombre de la empresa que el usuario esté escribiendo en la barra de busqueda */
        filtro: state.datosAdmin.filter((datos: any) => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return datos.nombre_empresa.match(regex);
        }),
      };

    case APLICAR_ESTADO_USR:
      return {
        ...state,
        /* Aplicamos un filtro para buscar con el uuid los datos del usuario
        al que se le hizo click, luego solo mostramos su estado de usuario */
        estadoUsr: state.datosAdmin.filter((item: any) => {
          return item.uuid === action.payload;
        })[0].estado,
        uuid: action.payload,
      };

    case DESBLOQUEAR_USUARIO:
      return {
        ...state,
        /* Hacemos un map en el array de los solicitantes para buscar el que concuerde con el uuid del usuario a desbloquear, luego lo ponemos como desbloqueado */
        /* Esto lo realizamos asi para no tener que hacer otra petición a la API de obtener todos los solicitantes nuevamente */
        datosAdmin: state.datosAdmin.map((item: any) => {
          if (item.uuid === action.payload) {
            item.estado = 'Desbloqueado';
          }
          return item;
        }),
        estadoUsr: 'Desbloqueado',
      };

    case BLOQUEAR_USUARIO:
      return {
        ...state,
        /* Hacemos un map en el array de los solicitantes para buscar el que concuerde con el uuid del usuario a desbloquear, luego lo ponemos como Bloqueado */
        /* Esto lo realizamos así para no tener que hacer otra petición a la API de obtener todos los solicitantes nuevamente*/
        datosAdmin: state.datosAdmin.map((item: any) => {
          if (item.uuid === action.payload) {
            item.estado = 'Bloqueado';
          }
          return item;
        }),
        estadoUsr: 'Bloqueado',
      };

    case LIMPIAR_ESTADO_USR:
      return {
        ...state,
        estadoUsr: null,
      };

    case LIMPIAR_SOLICITANTES:
      return {
        ...state,
        filtro: [],
      };

    case LIMPIAR_DATOS_MAESTROS:
      return {
        ...state,
        datosMaestrosUSR: [],
      };

    case LIMPIAR_DATOS_SOLICITANTES:
      return {
        ...state,
        datosAdmin: [],
        filtro: [],
        cargando: false,
        cargandoModal: false,
        estadoUsr: null,
        cantidadPendientes: 0,
      };

    case COLOCAR_GIF_CARGANDO:
      return {
        ...state,
        cargando: true,
      };

    case COLOCAR_GIF_CARGANDOMODAL:
      return {
        ...state,
        cargandoModal: true,
      };

    default:
      return state;
  }
};
