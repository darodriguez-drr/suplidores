/* Módulos necesarios para el funcionamiento */
import { useContext, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import AutenticacionContext from '../context/autenticacion/autenticacionContext';
import Cargando from '../components/layout/Cargando';

/* Estándar para ruta privada en React */
const RutaPrivada = ({ component: Component, htmlTitle }: any) => {
  /* Para usar el context de autenticación */
  const autenticacionContext = useContext(AutenticacionContext);
  const { cargarUsuario, estaAutenticado, cargando }: any =
    autenticacionContext;

  /* Función para cargar el usuario */
  const cargarUsuarioF = useCallback(
    async () => {
      await cargarUsuario();
    },
    //eslint-disable-next-line
    []
  );

  /* Para que corramos efectos al entrar a este componente */
  useEffect(
    () => {
      async function esperarDatos() {
        await cargarUsuarioF();
      }

      esperarDatos();
    },
    //eslint-disable-next-line
    []
  );

  /* Para que se actualice el componente cuando el estado de cargardo o estaAutenticado cambie */
  useEffect(() => {}, [cargando, estaAutenticado]);

  /* Si esta autenticado lo mandamos a la ruta solicitada */
  if (estaAutenticado === true) return <Component key={1} props={htmlTitle} />;

  /* Si no está autenticado lo mandamos al login */
  if (estaAutenticado === false) return <Navigate key={2} to='/login' />;

  /* Si no se sabe si está autenticado o no le ponemos el gif de cargando a lo que cargamos el usuario */
  if (estaAutenticado === null) return <Cargando key={3} />;

  /* Si ninguna se cumple devuelve cargando */
  if (cargando) return <Cargando key={4} />;

  /* Necesario devolver null en caso de que ninguna de las anteriores se cumpla, esto por la forma que está implementado este custom hook*/
  return null;
};

export default RutaPrivada;
