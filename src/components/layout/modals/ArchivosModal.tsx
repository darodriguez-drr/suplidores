/* Módulos importantes */
import ArchivosContext from '../../../context/archivos/archivosContext';
import { useContext } from 'react';
import AlertaContext from '../../../context/alerta/alertaContext';
import AutenticacionContext from '../../../context/autenticacion/autenticacionContext';

/* Modal que muestra los datos maestros del solicitante */
const ArchivosModal = (archivos: any) => {
  /* Destructurando */
  const { nombre_archivo, extencion_archivo, fecha_modificacion, id } =
    archivos.archivo;

  /* Context con los estados de los archivos del usuario */
  const archivosContext = useContext(ArchivosContext);
  const { borrarArchivos, descargarArchivos }: any = archivosContext;

  /* Context con las alertas que mostramos en la pantalla */
  const alertaContext = useContext(AlertaContext);
  const { activarAlerta }: any = alertaContext;

  /* Context con los estados de los usuarios */
  const autenticacionContext = useContext(AutenticacionContext);
  const { perfil }: any = autenticacionContext;

  const borraArchivos = async (id: string) => {
    /* Para tomar el valor de cuando hay en error al eliminar el archivo, el valor de la respuesta obtenida en estos casos viene en promise, por lo que usamos .then para obtener ese valor */
    borrarArchivos(id).then((res: any) => {
      if (res === 'Error al eliminar el archivo') {
        activarAlerta(res, 'danger');
      }
    });
  };

  /* Para llamar a la función que realmente descarga el archivo, lo hacemos de esta manera y no llamando a la función del context directamente, para poder hacer otras funciones */
  const descargaArchivos = async (
    id: string,
    nombre_archivo: string,
    extencion_archivo: string
  ) => {
    let mimetype = '';
    /* Lo hacemos de esta manera para poder mostrar una notificación con lo que haya sucedido */
    descargarArchivos(id).then((res: any) => {
      /* Tipo de Blob, debemos saber la extención del archivo para determinar el tipo de Blob */
      switch (extencion_archivo) {
        case 'png':
          mimetype = 'image/png';
          break;

        case 'jpg':
          mimetype = 'image/jpg';
          break;

        case 'jpeg':
          mimetype = 'image/jpeg';
          break;

        case 'pdf':
          mimetype = 'application/pdf';
          break;

        case 'xls':
          mimetype = 'application/vnd.ms-excel';
          break;

        case 'doc':
          mimetype = 'application/msword';
          break;

        case 'xlsx':
          mimetype =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;

        case 'docx':
          mimetype =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
      }

      const pngBlob = new Blob([res], { type: mimetype });

      /* Esto es para que el navegador descargue el archivo automáticamente */
      const url = window.URL.createObjectURL(pngBlob);
      const tempLink = document.createElement('a');
      tempLink.href = url;

      /* Esto es para asignar el nombre del archivo con el nombre que tiene en el servidor o con el nombre que fue subido */
      tempLink.setAttribute('download', nombre_archivo);

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);

      if (res) {
        activarAlerta('El archivo ha sido descargado', 'success');
      }
    });
  };
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xxl-12'>
            <div className='border border-solid p-3 rounded mb-3 d-flex justify-content-between'>
              <div>
                {' '}
                <b>
                  <i>Nombre: </i>
                </b>
                {nombre_archivo} |{' '}
                <b>
                  <i>Extensión:</i>{' '}
                </b>
                {extencion_archivo} |{' '}
                <b>
                  <i>Fecha de subida:</i>{' '}
                </b>
                {fecha_modificacion.substring(0, 10)} |{' '}
                <b>
                  <i>Hora subida:</i>{' '}
                </b>
                {fecha_modificacion.substring(11, 19)}
              </div>
              {perfil === 'Admin' ? (
                <button
                  className='border-0 bg-transparent'
                  onClick={() => {
                    descargaArchivos(id, nombre_archivo, extencion_archivo);
                  }}
                >
                  <i className='fa-solid fa-download text-secondary'></i>
                </button>
              ) : (
                /*          <button
                  className='border-0 bg-transparent'
                  data-bs-target='#seguroDeseaBorrarArchivo'
                  data-bs-toggle='modal'
                >
                  <i className='fa-solid fa-trash text-danger fa-xl'></i>
                </button> */
                <button
                  className='border-0 bg-transparent'
                  onClick={() => {
                    borraArchivos(id);
                  }}
                >
                  <i className='fa-solid fa-trash text-danger fa-xl'></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal de confirmación de borrado de archivos */}
      <div
        className='modal fade'
        id='seguroDeseaBorrarArchivo'
        data-bs-backdrop='static'
        aria-hidden='true'
        aria-labelledby='seguroDeseaBorrarArchivo2'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='seguroDeseaBorrarArchivo2'>
                Confirmación de eliminación de archivos
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
                className='btn btn-danger'
                data-bs-target='#modalArchivos'
                data-bs-toggle='modal'
                onClick={() => {
                  /*   borraArchivos(id); */
                }}
              >
                Eliminar
              </button>
              <button
                className='btn btn-primary'
                data-bs-target='#modalArchivos'
                data-bs-toggle='modal'
              >
                Volver atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArchivosModal;
