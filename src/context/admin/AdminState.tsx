/* Módulos importantes */
import { useReducer } from 'react';
import AdminContext from './adminContext';
import adminReducer from './adminReducer';
import axios from 'axios';
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

/* Estado inicial de los estados */
const AdminState = (props: any) => {
  const initialState: any = {
    datosAdmin: [],
    filtro: [],
    datosMaestrosUSR: [],
    cargando: false,
    cargandoModal: false,
    estadoUsr: null,
    uuid: null,
    cantidadPendientes: 0,
    listaPendientes: [],
  };

  const [state, dispath] = useReducer(adminReducer, initialState);

  /* Ruta de la API */
  const urlAdmin = '/api/admin';
  const urlAdminbloqueo = '/api/admin/bloqueo';
  const urlAdmindesbloqueo = '/api/admin/desbloqueo';
  const urlAdminCorreo = '/api/correo';

  /* Coloca el estado cargando en true, para que podamos mostrar el loading */
  const colocarLoadingGif = () => dispath({ type: COLOCAR_GIF_CARGANDO });
  const colocarLoadingGifModal = () =>
    dispath({ type: COLOCAR_GIF_CARGANDOMODAL });

  /* Obtener a los solicitantes */
  const obtenerDatosMaestrosUSR = async (uuid: any) => {
    try {
      colocarLoadingGifModal();
      const res = await axios.get(`${urlAdmin}/${uuid}`);
      dispath({
        type: OBTENER_SOLICITANTES_ESPECIFICOS,
        payload: res.data,
      });
    } catch (error) {}
  };

  const obtenerCantidadPendientes = async () => {
    try {
      const res = await axios.get(`${urlAdmin}/cantidadpendiaprobacion`);
      dispath({
        type: OBTENER_CANTIDAD_PENDIENTES,
        payload: res.data,
      });
    } catch (error) {}
  };

  /* Obtener a los solicitantes */
  const obtenerSolicitantes = async () => {
    try {
      const res = await axios.get(urlAdmin);
      await obtenerCantidadPendientes();
      dispath({
        type: OBTENER_SOLICITANTES,
        payload: res.data,
      });
    } catch (error) {}
  };

  /* Para obtener el listado de solicitantes con campos pendientes por aprobar */
  const obtenerListaCamposPendientesAprb = async () => {
    try {
      colocarLoadingGif();
      const res = await axios.get(`${urlAdmin}/listadopendiaprobacion`);
      /*    await obtenerCantidadPendientes(); */
      dispath({
        type: OBTENER_LISTA_CAMPOS_PENDIENTES_APRB,
        payload: res.data,
      });
    } catch (error) {}
  };

  // Filtrar los solicitantes
  const filtrarSolicitantes = (data: any) => {
    dispath({
      type: FILTRAR_SOLICITANTES,
      payload: data,
    });
  };

  // Limpiar filtro
  const limpiarFiltro = (data: any) => {
    dispath({
      type: LIMPIAR_SOLICITANTES,
      payload: data,
    });
  };

  // Limpiar filtro
  const limpiarDatosSol = () => {
    dispath({
      type: LIMPIAR_DATOS_SOLICITANTES,
    });
  };

  // Limpiar estado
  const limpiarEstado = () => {
    dispath({
      type: LIMPIAR_ESTADO_USR,
    });
  };

  // Limpiar estado
  const limpiarDatosMaestros = () => {
    dispath({
      type: LIMPIAR_DATOS_MAESTROS,
    });
  };

  /* Buscar el estado del usuario del solicitante */
  const obtenerEstado = async (uuid: any) => {
    dispath({
      type: APLICAR_ESTADO_USR,
      payload: uuid,
    });
  };

  /* Desbloquear usuario */
  const desbloquearUsuario = async () => {
    try {
      await axios.patch(`${urlAdmindesbloqueo}/${state.uuid}`);
      dispath({
        type: DESBLOQUEAR_USUARIO,
        payload: state.uuid,
      });
    } catch (error) {}
  };

  /* Bloquear usuario */
  const bloquearUsuario = async () => {
    try {
      await axios.patch(`${urlAdminbloqueo}/${state.uuid}`);
      dispath({
        type: BLOQUEAR_USUARIO,
        payload: state.uuid,
      });
    } catch (error) {}
  };

  /* Para reiniciar clave del usuario */
  const reiniciarClave = async () => {
    try {
      const res = await axios.patch(`${urlAdminCorreo}/${state.uuid}`);
      return res.data.msg;
    } catch (error) {}
  };

  /* Estados y funciones de este context */
  return (
    <AdminContext.Provider
      value={{
        datosAdmin: state.datosAdmin,
        filtro: state.filtro,
        datosMaestrosUSR: state.datosMaestrosUSR,
        cargando: state.cargando,
        cargandoModal: state.cargandoModal,
        estadoUsr: state.estadoUsr,
        uuid: state.uuid,
        cantidadPendientes: state.cantidadPendientes,
        listaPendientes: state.listaPendientes,
        obtenerSolicitantes,
        filtrarSolicitantes,
        limpiarFiltro,
        limpiarDatosSol,
        colocarLoadingGif,
        obtenerDatosMaestrosUSR,
        obtenerEstado,
        limpiarEstado,
        bloquearUsuario,
        desbloquearUsuario,
        limpiarDatosMaestros,
        reiniciarClave,
        obtenerListaCamposPendientesAprb,
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminState;
