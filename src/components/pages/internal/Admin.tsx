/* Módulos importantes para el funcionamiento */
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import BarraNav from '../../layout/BarraNav';
import SolItem from '../../layout/SolItem';
import Datos from '../../layout/modals/Datos';
import AutenticacionContext from '../../../context/autenticacion/autenticacionContext';
import AdminContext from '../../../context/admin/adminContext';
import Cargando from '../../layout/Cargando';
import FormularioContext from '../../../context/formulario/formularioContext';
import CargandoModal from '../../layout/CargandoModal';
import AlertaContext from '../../../context/alerta/alertaContext';

/* Pantalla del administrador */
const Admin = (htmlTitle: any) => {
  /* Titulo dinámico pasado por props */
  const title = document.querySelector('title');

  /* Si el titulo no está definido colocar el titulo que viene del prop */
  title!.textContent = htmlTitle.props;

  /* Context con los estados de los administradores */
  const adminContext = useContext(AdminContext);
  const {
    obtenerSolicitantes,
    datosAdmin,
    datosMaestrosUSR,
    filtrarSolicitantes,
    limpiarFiltro,
    cargando,
    filtro,
    estadoUsr,
    limpiarEstado,
    bloquearUsuario,
    desbloquearUsuario,
    limpiarDatosSol,
    limpiarDatosMaestros,
    reiniciarClave,
    cantidadPendientes,
  }: any = adminContext;

  /* Para usar los estados del context  */
  const autenticacionContext = useContext(AutenticacionContext);
  const { cerrarSesion, usuario, colocarLoadingGif, perfil }: any =
    autenticacionContext;

  /* Context con los estados de los usuarios */
  const formularioContext = useContext(FormularioContext);
  const { limpiarDatos }: any = formularioContext;

  /* Context con las alertas que mostramos en la pantalla */
  const alertaContext = useContext(AlertaContext);
  const { activarAlerta }: any = alertaContext;

  /* Para redireccionar */
  const navigate = useNavigate();

  /* Para esperar a los datos */
  const llamarFunc = async () => {
    /* Para redireccionar al usuario autenticado a la pantalla que debe visualizar, si el usuario es prospecto o proveedor no puede entrar a la página de administración de los prospectos o proveedores */
    if (perfil === 'Admin') {
      await obtenerSolicitantes();
    } else {
      navigate('/form');
    }
  };

  /* Esto es para que lo primero que hagamos al llegar al formulario es cargar los datos maestros */
  useEffect(
    () => {
      llamarFunc().then(() => {});
    },
    /* Para desactivar advertencia */
    //eslint-disable-next-line
    []
  );

  // Función llamada al momento de escribir en la barra de búsqueda
  const buscarBarra = (e: any) => {
    const { value } = e.target;
    if (value !== '') {
      filtrarSolicitantes(value);
    } else {
      limpiarFiltro();
    }
  };

  /* Función para cerrar sesión, con esto limpiamos diferentes estados */
  const cerrarSesionbtn = async (e: any) => {
    e.preventDefault();
    colocarLoadingGif();
    await cerrarSesion();
    await limpiarDatos();
    await limpiarDatosSol();
    navigate('/login');
  };

  /* Función para reinicio de clave, no llamamos directamente a reiniciarClave
  Para poder usar lo que retorna y enviar una notificación al administrador si todo se ejecuto correctamente, sin tener que declarar un estado para las alertas dentro de context del Admin */
  const llamarReinicioClave = async () => {
    activarAlerta(await reiniciarClave(), 'success');
  };

  let correos = '';

  /* Para el envío de correos masivos */
  if ([...datosAdmin].length > 0) {
    datosAdmin.map((item: any) => {
      correos = correos + item.email + ';';
      return correos;
    });
  }

  /* Para mostrar gif de cargando si todavia no tenemos los datos */
  if (cargando) {
    return <Cargando />;
  }
  if ([...datosAdmin].length > 0 && cargando !== true)
    return (
      <>
        <BarraNav htmltext='Monitor del Portal' icon='fa-pager' />
        {/* Side menu con opciones de la página ADMIN */}
        <div className='container-fluid'>
          <div className='row flex-nowrap'>
            <div
              className='col-2 col-sm-2 col-auto px-0 collapse collapse-horizontal overflow-hidden'
              id='sidebar'
            >
              <div
                className='list-group border-0 text-center text-sm-start min-vh-100'
                id='sidebar-menu'
              >
                <div
                  className='pt-4'
                  /*    className='border rounded-circle mx-auto w-50'
                  style={{ backgroundColor: '#eee' }} */
                >
                  <img
                    src='/logo-mejorado.png'
                    width={70}
                    className='h-100'
                    alt='Usuario'
                  />
                </div>

                {usuario && (
                  <ul className='navbar-nav text-secondary align-items-center'>
                    <li className='nav-item'>
                      <Link className='nav-link' aria-current='page' to='#'>
                        <b>{usuario}</b>
                      </Link>
                    </li>
                    <div className='d-flex align-items-center me-3'></div>
                  </ul>
                )}
                <div className='text-left'>
                  {/* Correos masivos */}
                  <button
                    className='list-group-item border-top border-end-0 d-inline-block text-truncate w-100 text-left'
                    data-bs-parent='#sidebar'
                    onClick={() => (window.location.href = `mailto:${correos}`)}
                  >
                    <i className='fa-solid fa-envelopes-bulk'></i>
                    <span className='d-none d-sm-inline ps-1'>
                      Correos masivos
                    </span>
                  </button>
                  {/* Campos que requieren aprobación */}
                  <Link
                    to='/camposreqaprb'
                    className='list-group-item border-top border-end-0 d-inline-block text-truncate w-100 text-left d-flex align-items-center'
                    data-bs-parent='#sidebar'
                  >
                    <i className='fa-solid fa-check'></i>
                    <span className='d-none d-sm-inline ps-1'>
                      Campos que requieren aprb
                    </span>
                    <span className='badge bg-danger ms-1'>
                      {cantidadPendientes}
                    </span>
                  </Link>
                </div>
                <div className='pt-3'>
                  {/* Llama a un modal */}
                  <button
                    className='btn btn-danger'
                    data-bs-toggle='modal'
                    data-bs-target='#staticBackdrop'
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de solicitantes */}
            <main className='col-sm col border-start ps-md-2 pt-2'>
              <div className='row'>
                <div className='col-12'>
                  <div className='container-fluid'>
                    <div className='row'>
                      <div className='col col-sm-12 col-md-12 col-lg-12 col-xxl-12'>
                        <h3>Solicitantes</h3>
                        <form className='d-flex' role='search'>
                          <input
                            className='form-control me-2'
                            type='search'
                            placeholder='Buscar solicitante, por tipo de suplidor, por nombre o por RNC'
                            aria-label='Search'
                            onChange={buscarBarra}
                          />
                        </form>
                        {/* <button className='btn btn-primary'>Buscar</button> */}
                      </div>
                      {/* Para que cuando el filtro tenga datos mostrar los resultados basados en ese campo */}
                      {[...filtro].length > 0
                        ? filtro.map((item: any, index: any) => (
                            /* Solicitantes item */
                            <SolItem
                              key={item.uuid}
                              datosAdmin={item}
                              index={index}
                            />
                          ))
                        : datosAdmin.map((item: any, index: any) => (
                            /* Solicitantes item */
                            <SolItem
                              key={item.uuid}
                              datosAdmin={item}
                              index={index}
                            />
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Modal Datos Maestros*/}
        <div
          className='modal fade'
          id='exampleModal'
          tabIndex={-1}
          data-bs-backdrop='static'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Datos maestros
                </h5>
                <button
                  onClick={() => {
                    limpiarDatosMaestros();
                  }}
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body'>
                <div className='container'>
                  <div className='row'>
                    <div className='col col-sm-12 col-md-12 col-lg-12 col-xxl-12'>
                      <h3 className='text-center pb-3'>
                        Información del solicitante
                      </h3>
                      <div className='row'>
                        {[...datosMaestrosUSR].length > 0 ? (
                          datosMaestrosUSR.map((item: any, index: any) => (
                            <Datos
                              key={item.preguntas.pregunta_id}
                              arr={item}
                            />
                          ))
                        ) : (
                          <CargandoModal />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  onClick={() => {
                    limpiarDatosMaestros();
                  }}
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal administración de usuario */}
        <div
          className='modal fade'
          id='admUSRModal'
          tabIndex={-1}
          data-bs-backdrop='static'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Administrar usuario
                </h5>
                <button
                  onClick={() => {
                    limpiarEstado();
                  }}
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body'>
                <div className='container'>
                  <div className='row'>
                    <div className='col col-sm-12 col-md-12 col-lg-12 col-xxl-12'>
                      <h4 className='text-center'>Opciones de bloqueo</h4>
                      <div className='row'>
                        {/* Dependiendo si el estado del usuario es bloqueado o desbloqueado, se deshabilita o habilita este botón */}
                        {estadoUsr === 'Desbloqueado' ? (
                          <button className='btn btn-primary' disabled>
                            Desbloquear usuario
                          </button>
                        ) : (
                          <button
                            className='btn btn-primary'
                            onClick={() => {
                              desbloquearUsuario();
                            }}
                          >
                            Desbloquear usuario
                          </button>
                        )}
                        {/* Dependiendo si el estado del usuario es bloqueado o desbloqueado, se deshabilita o habilita este botón */}
                        {estadoUsr === 'Bloqueado' ? (
                          <button className='btn btn-primary mt-2' disabled>
                            Bloquear usuario
                          </button>
                        ) : (
                          <button
                            className='btn btn-primary mt-2'
                            onClick={() => {
                              bloquearUsuario();
                            }}
                          >
                            Bloquear usuario
                          </button>
                        )}
                        {/* Dependiendo el estado del usuario mostramos un texto verde o rojo, verde para desbloqueado y rojo para bloqueado */}
                        <i className='mt-1'>
                          El usuario actualmente se encuentra:
                          {estadoUsr === 'Desbloqueado' ? (
                            <i className='text-success'> {estadoUsr}</i>
                          ) : (
                            <i className='text-danger'> {estadoUsr}</i>
                          )}
                        </i>
                        <h4 className='pt-3 text-center'>
                          Reinicio de contraseña
                        </h4>
                        {/* Llama a otro modal para confirmar */}
                        <button
                          className='btn btn-primary '
                          data-bs-target='#exampleModalToggle2'
                          data-bs-toggle='modal'
                        >
                          Reiniciar contraseña
                        </button>
                        <i className='mt-1'>
                          Nota: Esta opción genera una contraseña automática la
                          cual se vuelve la contraseña actual del usuario y
                          luego es enviada al correo perteneciente al usuario.
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  onClick={() => {
                    limpiarEstado();
                  }}
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación de reinicio de clave del usuario */}
        <div
          className='modal fade'
          id='exampleModalToggle2'
          data-bs-backdrop='static'
          aria-hidden='true'
          aria-labelledby='exampleModalToggleLabel2'
          tabIndex={-1}
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalToggleLabel2'>
                  Confirmación de reinicio de contraseña
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body'>
                {' '}
                <div className='text-center'>
                  <img
                    src='/circle-exclamation-solid.svg'
                    width={90}
                    alt='Precaución'
                  />
                </div>
                <p className='text-center pt-3 mb-0'>Está seguro?</p>
              </div>
              <div className='modal-footer'>
                <button
                  className='btn btn-warning'
                  data-bs-target='#admUSRModal'
                  data-bs-toggle='modal'
                  onClick={() => {
                    llamarReinicioClave();
                  }}
                >
                  Reiniciar
                </button>
                <button
                  className='btn btn-primary'
                  data-bs-target='#admUSRModal'
                  data-bs-toggle='modal'
                >
                  Volver atrás
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación para cerrar sesión */}
        <div
          className='modal fade'
          id='staticBackdrop'
          data-bs-backdrop='static'
          data-bs-keyboard='false'
          tabIndex={-1}
          aria-labelledby='staticBackdropLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Confirmación
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body'>
                <div className='text-center'>
                  <img
                    src='/circle-exclamation-solid.svg'
                    width={90}
                    alt='Precaución'
                  />
                </div>
                <p className='text-center pt-3 mb-0'>
                  Está seguro de que desea cerrar sesión?
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-danger'
                  data-bs-dismiss='modal'
                  onClick={cerrarSesionbtn}
                >
                  Cerrar sesión
                </button>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*       <div className='container-fluid'>
        <div className='row'>
          <div className='col col-sm-12 col-md-12 col-lg-12 col-xxl-12'>
            <h3>Solicitantes</h3>
            <p>Buscador de solicitantes:</p>
            <form className='d-flex' role='search'>
              <input
                className='form-control me-2'
                type='search'
                placeholder='Buscar solicitante, por tipo de suplidor, por nombre o por RNC'
                aria-label='Search'
              />
            </form>
          </div>
          {arr.map((item, index) => (
            /* Solicitantes item 
            <SolItem sol={item} />
          ))}
        </div>
      </div> */}
      </>
    );
};

export default Admin;
