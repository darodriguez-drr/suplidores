/* Módulos importantes para el funcionamiento */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AutenticacionContext from '../../context/autenticacion/autenticacionContext';
import FormularioContext from '../../context/formulario/formularioContext';
import AdminContext from '../../context/admin/adminContext';

/* Barra de navegación */
const BarraNav = ({ htmltext, icon }: any) => {
  /* Para usar los estados del context  */
  const autenticacionContext = useContext(AutenticacionContext);
  const { cerrarSesion, usuario, colocarLoadingGif }: any =
    autenticacionContext;

  /* Context con los estados de los administradores */
  const adminContext = useContext(AdminContext);
  const { limpiarDatosSol }: any = adminContext;

  /* Context con los estados de los usuarios */
  const formularioContext = useContext(FormularioContext);
  const { limpiarDatos }: any = formularioContext;

  /* Para redireccionar */
  const navigate = useNavigate();

  /* Función para cerrar sesión, con esto limpiamos diferentes estados */
  const cerrarSesionbtn = async (e: any) => {
    e.preventDefault();
    colocarLoadingGif();
    await cerrarSesion();
    await limpiarDatos();
    await limpiarDatosSol();
    navigate('/login');
  };

  /* Barra de navegación */
  return (
    <>
      <nav id='navbar' className='navbar navbar-expand-lg navbar-dark'>
        <div className='container-fluid'>
          <div>
            {/* Para colocar el botón de volver hacía atrás si está en /form */}
            {useLocation().pathname === '/form' ? (
              <Link to='/defaultpage'>
                <i className='fa-solid fa-angle-left text-white pe-3'></i>
              </Link>
            ) : (
              <Link to='/'></Link>
            )}
            {/* Para colocar el botón de volver hacía atrás si está en /admin */}
            {useLocation().pathname === '/admin' ? (
              <Link to='/defaultpage'>
                <i className='fa-solid fa-angle-left text-white pe-3'></i>
              </Link>
            ) : (
              <Link to='/'></Link>
            )}

            {/* Link para abrir menu  */}
            {useLocation().pathname === '/admin' ? (
              <Link
                style={{ color: 'white' }}
                to='#'
                data-bs-target='#sidebar'
                data-bs-toggle='collapse'
                className='me-2 text-decoration-none'
              >
                <i className='fa fa-navicon fa-lg py-2 p-1'></i>
              </Link>
            ) : (
              <Link to='/'></Link>
            )}
            {useLocation().pathname === '/camposreqaprb' ? (
              <Link to='/admin'>
                <i className='fa-solid fa-angle-left text-white pe-3'></i>
              </Link>
            ) : (
              <Link to='/'></Link>
            )}

            {/* Icono de página administrador del portal */}
            {/*        {icon && <i className={`fa-solid ${icon} text-white`}></i>} */}
            <p className='navbar-brand text-white ps-1 m-0'>{htmltext}</p>
          </div>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse flex-grow-0' id='navbarNav'>
            {/* Para mostrar imagen y nombre de quien está autenticado, esto es mostrado solo al usuario que no es adminstrador */}
            {useLocation().pathname === '/form' ? (
              <>
                {usuario && (
                  <ul className='navbar-nav text-secondary align-items-center'>
                    <li className='nav-item'>
                      <div
                        className='border rounded-circle'
                        style={{ backgroundColor: '#eee' }}
                      >
                        <i className='fa-solid fa-user p-3'></i>
                      </div>
                    </li>
                    <li className='nav-item'>
                      <Link
                        className='nav-link text-white'
                        aria-current='page'
                        to='#'
                      >
                        <b>{usuario}</b>
                      </Link>
                    </li>
                    <div className='d-flex align-items-center me-3'></div>
                    <div className='vr me-3'></div>
                    <button
                      className='btn btn-danger'
                      data-bs-toggle='modal'
                      data-bs-target='#staticBackdrop'
                    >
                      Cerrar sesión
                    </button>
                  </ul>
                )}
              </>
            ) : (
              <div></div>
            )}
            {/* Para colocar el botón de volver hacía atrás si está en /admin */}
            {useLocation().pathname === '/defaultpage' ? (
              <>
                {usuario && (
                  <ul className='navbar-nav text-secondary align-items-center'>
                    <li className='nav-item'>
                      <div
                        className='border rounded-circle'
                        style={{ backgroundColor: '#eee' }}
                      >
                        <i className='fa-solid fa-user p-3'></i>
                      </div>
                    </li>
                    <li className='nav-item'>
                      <Link
                        className='nav-link text-white'
                        aria-current='page'
                        to='#'
                      >
                        <b>{usuario}</b>
                      </Link>
                    </li>
                    <div className='d-flex align-items-center me-3'></div>
                    <div className='vr me-3'></div>
                    <button
                      className='btn btn-danger'
                      data-bs-toggle='modal'
                      data-bs-target='#staticBackdrop'
                    >
                      Cerrar sesión
                    </button>
                  </ul>
                )}
              </>
            ) : (
              <div></div>
            )}

            <form className='d-flex'>
              <>
                {/*       <div className='d-flex align-items-center me-3'></div>
              <div className='vr me-3'></div>
              <button className='btn btn-danger me-2' onClick={cerrarSesionbtn}>
                Cerrar sesión
              </button> */}
                {/*   <Link className='btn btn-outline-info' to='/admin'>
                Vista de archivos
              </Link> */}
              </>
            </form>
          </div>
        </div>

        {/* Modal de confirmación para cerrar sesión, la utilizamos también aquí para poder habilitar el cerrado de sesión desde la barra de navegación, pero también se encuentra
        en Admin.tsx, para cuando se quiera cerrar sesión desde el side bar */}
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
      </nav>
    </>
  );
};

export default BarraNav;
