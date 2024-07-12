/* Módulos importantes */
import React, { useReducer } from 'react';
import FormularioContext from './formularioContext';
import formularioReducer from './formularioReducer';
import axios from 'axios';
import {
  OBTENER_DATOS_FORMULARIO,
  ENVIAR_DATOS_FORMULARIO,
  ACTUALIZAR_DATOS_FORMULARIO,
  LIMPIAR_FORMULARIO,
  OBTENER_DATOS_FORMULARIO_ERROR,
  COLOCAR_GIF_CARGANDO,
  OBTENER_PREGUNTAS_FORMULARIO,
  OBTENER_OPCIONES_PREGUNTAS_FORMULARIO,
  OBTENER_RNC,
  OBTENER_DATOS_Y_ACTUALIZAR_FORMULARIO,
  FORM_ESTADO,
} from '../types';

/* Declarando los estados del formulario y su valor inicial */
const EstadosFormulario = (props: any) => {
  const initialState = {
    datos: [],
    preguntas: [],
    opcionesPreguntas: [],
    error: null,
    cargando: true,
    rnc: null,
    actualizar: null,
    formEstado: null,
  };

  /* Utilizando el reducer para hacer el cambio a los estados */
  const [state, dispath] = useReducer(formularioReducer, initialState);

  /* Rutas o endpoins utilizados */
  const url = '/api/form';
  const urlRnc = '/api/form/rnc';
  const urlEstado = '/api/form/formestado';
  const urlPreguntas = '/api/form/preguntas';
  const urlopcionesPreguntas = '/api/form/opcionespreguntas';

  /* Configuración de AXIOS */
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  /* Coloca el estado cargando en true, para que podamos mostrar el loading */
  const colocarLoadingGif = () => dispath({ type: COLOCAR_GIF_CARGANDO });

  /* Limpiar los datos del formulario */
  const limpiarDatos = async () => {
    dispath({
      type: LIMPIAR_FORMULARIO,
    });
  };

  /* Obtener las preguntas del formulario */
  const obtenerDatosPreguntas = async () => {
    try {
      const datos = await axios.get(urlPreguntas, config);

      if (datos.data.preguntas.length > 0) {
        dispath({
          type: OBTENER_PREGUNTAS_FORMULARIO,
          payload: datos.data.preguntas,
        });
      }
    } catch (error) {}
  };

  /* Obtener las opciones campo select del formulario */
  const obtenerDatosOpcionesPreg = async () => {
    try {
      const datos = await axios.get(urlopcionesPreguntas, config);
      if (datos.data.opcionesPreguntas.length > 0) {
        dispath({
          type: OBTENER_OPCIONES_PREGUNTAS_FORMULARIO,
          payload: datos.data.opcionesPreguntas,
        });
      }
    } catch (error) {}
  };

  /* Obtener el estado del formulario */
  const obtenerFormEstado = async () => {
    try {
      colocarLoadingGif();
      const estado = await axios.get(urlEstado, config);

      if (estado.data.msg) {
        dispath({
          type: FORM_ESTADO,
          payload: estado.data.msg,
        });
      }
    } catch (error) {}
  };

  /* Obtener los datos del formulario */
  const obtenerDatos = async () => {
    colocarLoadingGif();
    try {
      await obtenerDatosPreguntas();
      await obtenerDatosOpcionesPreg();
      await obtenerFormEstado();
      const datos = await axios.get(url, config);
      if (datos.data.buscarResUSR.length === 0) {
        dispath({
          type: OBTENER_DATOS_FORMULARIO,
          payload: datos.data.buscarResUSR,
        });
      } else {
        dispath({
          type: OBTENER_DATOS_Y_ACTUALIZAR_FORMULARIO,
          payload: datos.data.buscarResUSR,
        });
      }
    } catch (error) {
      dispath({
        type: OBTENER_DATOS_FORMULARIO_ERROR,
      });
    }
  };

  /* Obtener el RNC del usuario */
  const obtenerRnc = async () => {
    /* Para poner el gif  de cargando */
    colocarLoadingGif();
    try {
      const rnc = await axios.get(urlRnc, config);
      dispath({
        type: OBTENER_RNC,
        payload: rnc.data.msg,
      });
    } catch (error) {}
  };

  /* Enviar los datos del formulario */
  const anadirDatos = async (anadirDatos: any) => {
    /* Para poner el gif  de cargando */
    colocarLoadingGif();

    /* Limpiar los datos del formulario */
    limpiarDatos();

    /* Para llegar los campos select nuevamente */
    await obtenerDatosPreguntas();
    await obtenerDatosOpcionesPreg();

    /* Creando el formdata donde pondremos los datos, aunque la API recibe JSON tenemos que enviarlo tipo form data, si enviamos JSON no lo recibe bien en
       el REQ.BODY */
    var formdata = new FormData();
    try {
      /* Para agregar cada una de las respuestas al formulario */
      for (let x = 1; x <= [...anadirDatos].length; x++) {
        formdata.append(
          `pregunta_id${x}`,
          `${
            [...anadirDatos].find((a: any) => a.pregunta_id === x)
              .respuesta_valor
          }`
        );
      }

      const datos = await axios.post(url, formdata, config);
      dispath({
        type: ENVIAR_DATOS_FORMULARIO,
        payload: datos.data.buscarResUSR,
      });
    } catch (error) {
      console.log('Hubo un error');
      /*    dispath({
        type: OBTENER_DATOS_FORMULARIO_ERROR,
      }); */
    }
  };

  /* Actualizar los datos del formulario */
  const actualizarDatos = async (recibirDatos: any) => {
    /* Para poner el gif  de cargando */
    colocarLoadingGif();
    /* Limpiar los datos del formulario */
    limpiarDatos();

    /* Para llenar los select nuevamente */
    await obtenerDatosPreguntas();
    await obtenerDatosOpcionesPreg();

    /* Creando el formdata donde pondremos los datos, aunque la API recibe JSON tenemos que enviarlo tipo form data, si enviamos JSON no lo recibe bien en
       el REQ.BODY */
    var formdata = new FormData();
    try {
      /* Para agregar cada una de las respuestas al formulario */
      for (let x = 1; x <= [...recibirDatos].length; x++) {
        formdata.append(
          `pregunta_id${x}`,
          `${
            [...recibirDatos].find((a: any) => a.pregunta_id === x)
              .respuesta_valor
          }`
        );
      }
      /* Enviar solicitud */
      const datos = await axios.patch(url, formdata, config);
      /* Enviamos lo que recibimos al reducer para que lo ponga en el formulario */
      dispath({
        type: ACTUALIZAR_DATOS_FORMULARIO,
        payload: datos.data.buscarResUSR,
      });
    } catch (error) {
      console.log('Hubo un error');
    }
  };

  return (
    <FormularioContext.Provider
      value={{
        datos: state.datos,
        preguntas: state.preguntas,
        opcionesPreguntas: state.opcionesPreguntas,
        error: state.error,
        rnc: state.rnc,
        cargando: state.cargando,
        formEstado: state.formEstado,
        actualizar: state.actualizar,
        obtenerDatos,
        obtenerDatosPreguntas,
        obtenerDatosOpcionesPreg,
        anadirDatos,
        obtenerRnc,
        actualizarDatos,
        limpiarDatos,
        colocarLoadingGif,
        obtenerFormEstado,
      }}
    >
      {props.children}
    </FormularioContext.Provider>
  );
};

export default EstadosFormulario;
