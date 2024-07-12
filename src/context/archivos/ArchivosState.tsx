/* Módulos importantes */
import { useReducer } from 'react';
import ArchivosContext from './archivosContext';
import archivosReducer from './archivosReducer';
import axios from 'axios';
import {
  OBTENER_ARCHIVOS,
  ELIMINAR_ARCHIVO,
  COLOCAR_CARGANDO_ARCHIVOS,
  LIMPIAR_ARCHIVOS,
  QUITAR_CARGANDO_ARCHIVOS,
} from '../types';

/* Estado inicial de los estados */
const ArchivosState = (props: any) => {
  const initialState: any = {
    archivos: [],
    cantidadArchivosBD: 0,
    cargando: false,
  };

  const [state, dispath] = useReducer(archivosReducer, initialState);

  /* Ruta de la API */
  const urlArchivos = '/api/archivos';

  /* Para colocar el gif de cargando
   */
  const colocarLoadingGift = () => {
    dispath({
      type: COLOCAR_CARGANDO_ARCHIVOS,
    });
  };

  /* Para colocar el gif de cargando
   */
  const quitarLoadingGift = () => {
    dispath({
      type: QUITAR_CARGANDO_ARCHIVOS,
    });
  };

  /* Busca los archivos del usuario */
  const buscarArchivos = async (uuid: any) => {
    try {
      colocarLoadingGift();
      const res = await axios.get(`${urlArchivos}/cantidad/${uuid}`);

      dispath({
        type: OBTENER_ARCHIVOS,
        payload: res.data,
      });

      return res.data.msg;
    } catch (error) {
      console.log(error);
    }
  };

  /* sube los archivos del usuario */
  const subirArchivos = async () => {
    try {
      /*       colocarLoadingGift();

      const formData = new FormData();
      for (let index = 0; index < [...file].length; index++) {
        formData.append('file', file[index]);
        console.log(file[index]);
      }
      const res = await axios.post('http://localhost:3050/upload', formData); */
    } catch (error) {
      console.log(error);
    }
  };

  /* Borra los archivos, esto es para cuando se quiera eliminar un archivo */
  const borrarArchivos = async (id: any) => {
    colocarLoadingGift();

    try {
      const res = await axios.delete(`${urlArchivos}/eliminar/${id}`);

      if (res.status === 200) {
        dispath({ type: ELIMINAR_ARCHIVO, payload: id });
      }
    } catch (error: any) {
      quitarLoadingGift();
      return error.response.data.msg;
    }
  };

  /* Descarga archivos, esto es para cuando se quiera descargar un archivo */
  const descargarArchivos = async (id: any) => {
    colocarLoadingGift();

    /* Indicamos que el request es para descargar archivo, o tipo blob, para que podamos descargar */
    try {
      const res = await axios.get(`${urlArchivos}/descargar/${id}`, {
        responseType: 'blob',
      });

      if (res.status === 200) {
        dispath({ type: QUITAR_CARGANDO_ARCHIVOS });
      }
      return res.data;
    } catch (error: any) {
      quitarLoadingGift();
      return error.response.data.msg;
    }
  };

  /* Limpiar los archivos, esto es para cuando se cierra el modal*/
  const limpiarArchivos = () => {
    dispath({
      type: LIMPIAR_ARCHIVOS,
    });
  };

  /* Estados y funciones de este context */
  return (
    <ArchivosContext.Provider
      value={{
        archivos: state.archivos,
        cantidadArchivosBD: state.cantidadArchivosBD,
        cargando: state.cargando,
        buscarArchivos,
        limpiarArchivos,
        subirArchivos,
        borrarArchivos,
        descargarArchivos,
      }}
    >
      {props.children}
    </ArchivosContext.Provider>
  );
};

export default ArchivosState;
