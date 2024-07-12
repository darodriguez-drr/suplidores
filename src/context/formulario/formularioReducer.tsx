import {
  OBTENER_DATOS_FORMULARIO,
  ENVIAR_DATOS_FORMULARIO,
  ACTUALIZAR_DATOS_FORMULARIO,
  LIMPIAR_FORMULARIO,
  OBTENER_DATOS_FORMULARIO_ERROR,
  COLOCAR_GIF_CARGANDO,
  OBTENER_DATOS_Y_ACTUALIZAR_FORMULARIO,
  OBTENER_RNC,
  OBTENER_PREGUNTAS_FORMULARIO,
  OBTENER_OPCIONES_PREGUNTAS_FORMULARIO,
  FORM_ESTADO,
} from '../types';

// eslint-disable-next-line
export default (state: any, action: any) => {
  switch (action.type) {
    case OBTENER_DATOS_FORMULARIO:
      return {
        ...state,
        datos: action.payload,
        actualizar: false,
        cargando: false,
      };

    case OBTENER_DATOS_Y_ACTUALIZAR_FORMULARIO:
      return {
        ...state,
        datos: action.payload,
        actualizar: true,
        cargando: false,
      };

    case OBTENER_PREGUNTAS_FORMULARIO:
      return {
        ...state,
        preguntas: action.payload,
      };

    case OBTENER_OPCIONES_PREGUNTAS_FORMULARIO:
      return {
        ...state,
        opcionesPreguntas: action.payload,
      };

    case ENVIAR_DATOS_FORMULARIO:
      return {
        ...state,
        datos: action.payload,
        actualizar: true,
        cargando: false,
      };

    case ACTUALIZAR_DATOS_FORMULARIO:
      return {
        ...state,
        datos: action.payload,
        actualizar: true,
        cargando: false,
      };

    case OBTENER_DATOS_FORMULARIO_ERROR:
      return {
        ...state,
        datos: [],
        cargando: false,
      };

    case OBTENER_RNC:
      return {
        ...state,
        rnc: action.payload,
        cargando: false,
      };

    case FORM_ESTADO:
      return {
        ...state,
        formEstado: action.payload,
      };

    case LIMPIAR_FORMULARIO:
      return {
        ...state,
        datos: [],
        preguntas: [],
        opcionesPreguntas: [],
        rnc: null,
        actualizar: null,
      };

    case COLOCAR_GIF_CARGANDO:
      return {
        ...state,
        cargando: true,
      };
    default:
      return state;
  }
};
