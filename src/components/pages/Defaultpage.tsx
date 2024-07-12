/* Módulos importantes */
import { useContext, useState, useEffect } from 'react';
import BarraNav from '../layout/BarraNav';
import { Link } from 'react-router-dom';
import AutenticacionContext from '../../context/autenticacion/autenticacionContext';
import ArchivosContext from '../../context/archivos/archivosContext';
import Cargando from '../layout/Cargando';
import ArchivosModal from '../layout/modals/ArchivosModal';
import axios from 'axios';
import AlertaContext from '../../context/alerta/alertaContext';
import FormularioContext from '../../context/formulario/formularioContext';

const Defaultpage = (htmlTitle: any) => {
  /* Estado para los archivos */
  const [file, setFile]: any = useState();

  /* Context con los estados de los usuarios */
  const autenticacionContext = useContext(AutenticacionContext);
  const { perfil, token }: any = autenticacionContext;

  /* Context con las alertas que mostramos en la pantalla */
  const alertaContext = useContext(AlertaContext);
  const { activarAlerta, alertas }: any = alertaContext;

  /* Context con los estados de los usuarios */
  const formularioContext = useContext(FormularioContext);
  const { formEstado, obtenerFormEstado }: any = formularioContext;

  /* Context con los estados de los archivos del usuario */
  const archivosContext = useContext(ArchivosContext);
  const {
    archivos,
    buscarArchivos,
    cargando,
    limpiarArchivos,
    cantidadArchivosBD,
  }: any = archivosContext;

  /* Titulo dinámico pasado por props */
  const title = document.querySelector('title');

  /* Si el titulo no está definido colocar el titulo que viene del prop */
  title!.textContent = htmlTitle.props;

  const urlArchivos = '/api/archivos';

  /* Para subir archivos */
  const upload = async () => {
    if (file !== undefined) {
      if ([...file].length + cantidadArchivosBD > 6) {
        activarAlerta(
          `Solo se pueden subir un total de 6 archivos, has subido: ${cantidadArchivosBD} y quieres subir ${
            [...file].length
          }`,
          'danger'
        );
        return;
      } else {
        const formData = new FormData();
        for (let index = 0; index < [...file].length; index++) {
          formData.append('file', file[index]);
        }
        try {
          /* Para hacer la petición que sube los archivos */
          const res = await axios.post(`${urlArchivos}/subir`, formData);

          /* Dependiendo el estado de la respuesta mostramos el mensaje con un color diferente */
          switch (res.status) {
            case 200:
              activarAlerta(res.data.msg, 'success');
              await buscarArchivos(token);
              break;
            case 413:
              activarAlerta(res.data.msg, 'danger');
              await buscarArchivos(token);
              break;

            /* En caso de que no se hayan cumplido ninguno de los anteriores */
            default:
              activarAlerta('Error al subir el archivo', 'danger');
              break;
          }
        } catch (error: any) {
          activarAlerta(error.response.data.msg, 'danger');
        }
      }
    } else {
      activarAlerta('No has seleccionado ningún archivo', 'danger');
    }
  };

  let cargandoEstadoFrm = true;

  /* Para esperar que llegue el estado del formulario */
  const llamarFunc = async () => {
    await obtenerFormEstado();
    cargandoEstadoFrm = false;
  };

  /* Para obtener el estado del formulario del usuario autenticado */
  useEffect(
    () => {
      llamarFunc().then(() => {});
    },
    //eslint-disable-next-line
    []
  );

  /* Para mostrar gif de cargando si todavia no tenemos los datos */
  if (!cargandoEstadoFrm) {
    return <Cargando />;
  }

  if (formEstado !== null) {
    return (
      <>
        <BarraNav htmltext='Pantalla Principal' icon='fa-house' />
        <div
          className='container d-flex align-items-center justify-content-center'
          style={{ height: '90vh' }}
        >
          <div className='row'>
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='text-center'>
                <img src='/logo-mejorado.png' width={70} alt='Usuario' />
              </div>
              <h4 className='text-center pt-3 pb-3'>
                Bienvenido a la página principal
              </h4>
              <div className='text-center'>
                {/*     <p>Opciones disponibles:</p> */}
                {perfil === 'Admin' ? (
                  <Link to='/admin' className='btn btn-primary'>
                    <i className='fa-solid fa-desktop me-1'></i>
                    Visualizar monitor del portal
                  </Link>
                ) : (
                  <>
                    {' '}
                    {formEstado === 'Desbloqueado' ? (
                      <>
                        <Link
                          to='/form'
                          className='btn btn-primary mb-3 mb-sm-3 mb-md-0 mb-lg-0 mb-xl-0 mb-xxl-0'
                        >
                          <i className='fa-solid fa-database me-1'></i>
                          Visualizar o cambiar datos maestros
                        </Link>
                        <button
                          className='btn btn-primary ms-0 ms-0 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-2 ms-xxl-2'
                          data-bs-toggle='modal'
                          data-bs-target='#modalArchivos'
                          onClick={() => buscarArchivos(token)}
                        >
                          <i className='fa-solid fa-folder-open me-1'></i>
                          Visualizar o borrar archivos subidos
                        </button>
                      </>
                    ) : (
                      <>
                        {alertas.length > 0 ? (
                          <button
                            disabled
                            className='btn btn-primary mb-3 mb-sm-3 mb-md-0 mb-lg-0 mb-xl-0 mb-xxl-0'
                          >
                            <i className='fa-solid fa-database me-1'></i>
                            Visualizar o cambiar datos maestros
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              activarAlerta(
                                'El formulario está bloqueado debido a que tienes campos que requieren aprobación por parte del equipo de compras, no puedes acceder a esta opción',
                                'danger'
                              );
                            }}
                            className='btn btn-primary mb-3 mb-sm-3 mb-md-0 mb-lg-0 mb-xl-0 mb-xxl-0'
                          >
                            <i className='fa-solid fa-database me-1'></i>
                            Visualizar o cambiar datos maestros
                          </button>
                        )}
                        <button
                          className='btn btn-primary ms-0 ms-0 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-2 ms-xxl-2'
                          data-bs-toggle='modal'
                          data-bs-target='#modalArchivos'
                          onClick={() => buscarArchivos(token)}
                        >
                          <i className='fa-solid fa-folder-open me-1'></i>
                          Visualizar o borrar archivos subidos
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de archivos subidos*/}
        <div
          className='modal fade'
          id='modalArchivos'
          tabIndex={-1}
          data-bs-backdrop='static'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>
                  Archivos subidos
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                  onClick={() => {
                    limpiarArchivos();
                  }}
                ></button>
              </div>
              <div className='modal-body'>
                <div className='container'>
                  <div className='row'>
                    <div className='col col-sm-12 col-md-12 col-lg-12 col-xxl-12'>
                      <div className='row'>
                        <h3 className='text-center mb-3'>Subida de archivos</h3>
                        {cargando ? (
                          <Cargando />
                        ) : [...archivos].length === 0 ? (
                          <div className='col text-center'>
                            <div className='mb-3'>
                              <input
                                className='form-control h-100'
                                style={{ paddingLeft: '12px' }}
                                type='file'
                                onChange={(e) => {
                                  if (
                                    !e.target.files ||
                                    e.target.files.length === 0
                                  ) {
                                    return;
                                  } else {
                                    setFile(e.target.files);
                                  }
                                }}
                                multiple
                              />
                            </div>
                            <div className='w-100'>
                              {[...alertas].length > 0 ? (
                                <button
                                  className='btn btn-success w-100'
                                  type='button'
                                  onClick={upload}
                                  disabled
                                >
                                  Subir
                                </button>
                              ) : (
                                <button
                                  className='btn btn-success w-100'
                                  type='button'
                                  onClick={upload}
                                >
                                  Subir
                                </button>
                              )}
                            </div>
                            <h3 className='text-center pt-4'>
                              Lista de archivos subidos {cantidadArchivosBD}
                            </h3>
                            <i className='text-right'>Límite de archivos: 6</i>{' '}
                            <br />
                            <i className='fa-solid fa-triangle-exclamation me-1'></i>
                            <i className='text-center text-muted mx-auto'>
                              No hay archivos subidos
                            </i>
                          </div>
                        ) : (
                          <>
                            <div className='mb-3'>
                              <input
                                className='form-control h-100'
                                style={{ paddingLeft: '12px' }}
                                type='file'
                                onChange={(e) => {
                                  if (
                                    !e.target.files ||
                                    e.target.files.length === 0
                                  ) {
                                    return;
                                  } else {
                                    setFile(e.target.files);
                                  }
                                }}
                                multiple
                              />
                            </div>
                            <div className='w-100'>
                              {[...alertas].length > 0 ? (
                                <button
                                  className='btn btn-success w-100'
                                  type='button'
                                  onClick={upload}
                                  disabled
                                >
                                  Subir
                                </button>
                              ) : (
                                <button
                                  className='btn btn-success w-100'
                                  type='button'
                                  onClick={upload}
                                >
                                  Subir
                                </button>
                              )}
                            </div>

                            <h3 className='text-center pt-4'>
                              Lista de archivos subidos ({cantidadArchivosBD})
                            </h3>
                            <i className='pb-3 text-right'>
                              Límite de archivos: 6
                            </i>
                            {[...archivos].map((archivo: any) => (
                              <ArchivosModal
                                key={archivo.id}
                                archivo={archivo}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                  onClick={() => {
                    limpiarArchivos();
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Defaultpage;
