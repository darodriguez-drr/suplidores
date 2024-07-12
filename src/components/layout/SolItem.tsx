/* Módulos importantes para el funcionamiento de este componente */
import { useContext } from 'react';
import AdminContext from '../../context/admin/adminContext';
import ArchivosModal from '../layout/modals/ArchivosModal';
import ArchivosContext from '../../context/archivos/archivosContext';
import Cargando from '../layout/Cargando';

const SolItem = ({ datosAdmin, index }: any) => {
  /* Context con los estados de los usuarios */
  const adminContext = useContext(AdminContext);
  const { obtenerDatosMaestrosUSR, obtenerEstado }: any = adminContext;

  /* Context con los estados de los archivos del usuario */
  const archivosContext = useContext(ArchivosContext);
  const {
    archivos,
    buscarArchivos,
    cargando,
    limpiarArchivos,
    cantidadArchivosBD,
  }: any = archivosContext;

  /* func. ver datos */
  const verDatos = (uuid: any) => {
    obtenerDatosMaestrosUSR(uuid);
  };

  return (
    <>
      <div className='container-fluid pt-3'>
        <div className='row'>
          <div className='col col-sm-12 col-md-12 col-lg-12 col-xxl-12'>
            <div
              className='border p-3 d-flex justify-content-between bg-primary'
              style={{ borderRadius: '40px', height: '70px' }}
            >
              <div className='d-flex align-items-center'>
                <div
                  className='border rounded-circle'
                  style={{ backgroundColor: '#eee' }}
                >
                  <i className='fa-solid fa-user p-3'></i>
                </div>
                <h5 className='mb-0 ps-2 text-white'>
                  {datosAdmin.nombre_empresa}
                </h5>
              </div>

              <div className='d-flex'>
                {/* Datos */}
                <button
                  onClick={() => {
                    verDatos(datosAdmin.uuid);
                  }}
                  className='border-0 px-4 text-white'
                  style={{ backgroundColor: 'transparent' }}
                  type='button'
                  data-bs-toggle='modal'
                  data-bs-target='#exampleModal'
                  data-bs-placement='top'
                  title='Datos del solicitante'
                >
                  <i className='fa-solid fa-circle-info pe-1 fa-xl'></i>
                </button>

                {/* Archivos */}
                <button
                  className='border-0 px-4 text-white ms-1'
                  style={{ backgroundColor: 'transparent' }}
                  data-bs-placement='top'
                  title='Archivos'
                  data-bs-toggle='modal'
                  data-bs-target='#modalArchivosAdm'
                  onClick={() => buscarArchivos(datosAdmin.uuid)}
                >
                  <i className='fa-solid fa-file pe-1 fa-xl'></i>
                </button>

                {/* Correo */}
                <button
                  className='border-0 px-4 text-white ms-1'
                  style={{ backgroundColor: 'transparent' }}
                  data-bs-placement='top'
                  title='Correo individual'
                  onClick={() =>
                    (window.location.href = `mailto:${datosAdmin.email}`)
                  }
                >
                  <i className='fa-solid fa-envelope pe-1 fa-xl'></i>
                  {/*     Enviar correo */}
                </button>

                {/* Administrar usuario */}
                <button
                  onClick={() => {
                    obtenerEstado(datosAdmin.uuid);
                  }}
                  className='border-0 px-4 text-white ms-1'
                  style={{ backgroundColor: 'transparent' }}
                  data-bs-toggle='modal'
                  data-bs-placement='top'
                  title='Adm. de usuario'
                  type='button'
                  data-bs-target='#admUSRModal'
                >
                  <i className='fa-solid fa-user-gear pe-1 fa-xl'></i>
                  {/*     ADM. USR */}
                </button>
                {/* Crear en SAP */}
                {/*           <button
                  className='border-0 px-4'
                  style={{ backgroundColor: 'transparent', color: '#5dbf5d' }}
                  data-bs-toggle='modal'
                  data-bs-target='#modalCrearEnSap'
                  data-bs-placement='top'
                  title='Crear en SAP'
                >
                  <i className='fa-solid fa-user-plus pe-1 fa-xl'></i>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className='modal fade'
        id='modalCrearEnSap'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='modalCrearEnSap'>
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
              Está seguro de que desea crear al proveedor en SAP?
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-success'
                data-bs-dismiss='modal'
              >
                Crear
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

      {/* Modal de archivos subidos, esta vista es para el adminstrador*/}
      <div
        className='modal fade'
        id='modalArchivosAdm'
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
                      {/*             <h3 className='text-center mb-3'>Archivos del usuario</h3> */}
                      {cargando ? (
                        <Cargando />
                      ) : [...archivos].length === 0 ? (
                        <div className='col text-center'>
                          <h3 className='text-center pt-4'>
                            Lista de archivos subidos {cantidadArchivosBD}
                          </h3>
                          <i className='pb-2'>Límite de archivos: 6</i>
                          <br />
                          <i className='fa-solid fa-triangle-exclamation me-1'></i>
                          <i className='text-center text-muted mx-auto'>
                            No hay archivos subidos
                          </i>
                        </div>
                      ) : (
                        <>
                          <h3 className='text-center pt-4'>
                            Lista de archivos subidos ({cantidadArchivosBD})
                          </h3>
                          <i className='pb-2 text-right'>
                            Límite de archivos: 6
                          </i>
                          {[...archivos].map((archivo: any) => (
                            <ArchivosModal key={archivo.id} archivo={archivo} />
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
};

export default SolItem;
