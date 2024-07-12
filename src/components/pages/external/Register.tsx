/* Módulos importantes */
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AutenticacionContext from '../../../context/autenticacion/autenticacionContext';
import AlertaContext from '../../../context/alerta/alertaContext';

const Register = ({ htmlTitle }: any) => {
  /* Seleccionar el título del HTML */
  const title = document.querySelector('title');

  /* Para poner título de página dinamicamente */
  title!.textContent = htmlTitle;

  /* Pare rediriguir al usuario */
  const navigate = useNavigate();

  /* Context con los estados de los usuarios */
  const autenticacionContext = useContext(AutenticacionContext);
  const { cargarUsuario, estaAutenticado, registrar, error }: any =
    autenticacionContext;

  /* Context con las alertas que mostramos en la pantalla */
  const alertaContext = useContext(AlertaContext);
  const { activarAlerta, alertas }: any = alertaContext;

  /* Esto hook recarga la página cada vez que las dependencias cambian */
  useEffect(
    () => {
      cargarUsuario();
      if (estaAutenticado) {
        /* Si las credenciales estan correctas se redirigue al usuario a la página del formulario */
        navigate('/form');
      }
      if (error === 'El RNC ya esta registrado en el sistema') {
        activarAlerta(error, 'danger');
      }
      if (error === 'El correo ya esta registrado en el sistema') {
        activarAlerta(error, 'danger');
      }
      if (error === 'Favor, escribir un correo valido') {
        activarAlerta(error, 'danger');
      }
      if (
        error ===
        'Favor, escribir el RNC y el mismo no puede ser mas de 10 caracteres'
      ) {
        activarAlerta(error, 'danger');
      }
      if (error === 'Favor, escribir el nombre de la empresa') {
        activarAlerta(error, 'danger');
      }
      if (error === 'Favor, la contraseña debe tener al menos 8 caracteres') {
        activarAlerta(error, 'danger');
      }

      if (
        error !== null &&
        error !== 'El correo ya esta registrado en el sistema' &&
        error !== 'El RNC ya esta registrado en el sistema' &&
        error !== 'Favor, escribir un correo valido' &&
        error !== 'Favor, la contraseña debe tener al menos 8 caracteres' &&
        error !== 'Favor, escribir el nombre de la empresa' &&
        error !==
          'Favor, escribir el RNC y el mismo no puede ser mas de 10 caracteres'
      ) {
        activarAlerta('Usuario creado', 'success');
        navigate('/login');
      }
      /*  limpiarErrores(); */
    },
    // Dependencias para useEffect, cada vez que estas cambien se actualiza los datos que esten en el componente
    // eslint-disable-next-line
    [error, estaAutenticado]
  );

  /* Variables para los inputs de este formulario */
  const [datosRegistro, aplicarDatosRegistro] = useState({
    correo: '',
    correo2: '',
    rnc: '',
    nombre_empresa: '',
    contrasena: '',
    contrasena2: '',
  });

  /* Para facilicar el acceso a los estados del registro */
  const { correo, correo2, rnc, nombre_empresa, contrasena, contrasena2 } =
    datosRegistro;

  /* Esta función es llamada al escribir en los inputs para colocar lo que escribimis
     en el estado datosRegistro */
  const cambioEnInput = (e: any) => {
    /* Esto es para limitar el tamaño del campo RNC a 10 números, ya que solo permitimos el agregar números a este campo siempre y cuando el valor que esté en el input sea menor al 11 */
    if (e.target.name === 'rnc' && e.target.value.length < 11) {
      aplicarDatosRegistro({
        ...datosRegistro,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name !== 'rnc') {
      /* Para todo lo demás campos que no sean RNC */
      aplicarDatosRegistro({
        ...datosRegistro,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name === 'rnc' && e.target.value.length >= 10) {
      /* Para cuando el campo es RNC, pero sobrepasa los 10 números, mostramos una alerta */
      activarAlerta('El RNC no puede tener más de 10 números', 'warning');
    }
  };

  /* Esta función es llamada al dar click Completar el registro */
  const enviar = (e: any) => {
    e.preventDefault();
    // Esto es para validar que los campos no esten vacios
    if (
      correo === '' ||
      rnc === '' ||
      nombre_empresa === '' ||
      contrasena === '' ||
      contrasena2 === ''
    ) {
      activarAlerta(
        /* Mensaje a ser mostrado en la alerta */
        ' Favor, completa todos los campos',
        'warning'
      );
    } else if (correo !== correo2) {
      /* Verificamos si las contraseñas coinciden, si no coinciden enviamos alerta */
      activarAlerta('Los correos deben coincidir', 'warning');
    } else if (contrasena !== contrasena2) {
      /* Verificamos si las contraseñas coinciden, si no coinciden enviamos alerta */
      activarAlerta('Las contraseÑas deben ser iguales', 'warning');
    } else if (rnc.length > 10) {
      /* Verificamos si las contraseñas coinciden, si no coinciden enviamos alerta */
      activarAlerta('El RNC no puede tener más de 10 números', 'warning');
    } else {
      /* Si no hay error hacemos la petición a la API para crear el usuario */
      try {
        registrar({ correo, rnc, nombre_empresa, contrasena, contrasena2 });
      } catch (error) {}
    }
  };

  /* Visualización del componente */
  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col col-12 col-sm-12 col-md-12 col-lg-10 col-xxl-12'>
          <div className='login-wrap p-4 p-lg-5 rounded-start mx-auto'>
            <div className='d-flex'>
              <div className='w-100 text-center'>
                <img src='/Logo-Rica.png' alt='Grupo Rica Logo' width='20%' />
                <h3 className='mb-4'>Registro de prospecto</h3>
              </div>
              {/*    <div className='w-100'></div> */}
            </div>
            <form action='#' className='signin-form'>
              <div className='form-group mb-3'>
                <label className='label' htmlFor='correo'>
                  Correo
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Favor de escribir el Correo'
                  required
                  id='correo'
                  name='correo'
                  value={correo}
                  onChange={cambioEnInput}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </div>
              <div className='form-group mb-3'>
                <label className='label' htmlFor='correo2'>
                  Confirmar Correo
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Favor de escribir el Correo'
                  required
                  id='correo2'
                  name='correo2'
                  value={correo2}
                  onChange={cambioEnInput}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </div>
              <div className='form-group mb-3'>
                <label className='label' htmlFor='rnc'>
                  RNC
                </label>
                <input
                  type='number'
                  className='form-control'
                  placeholder='Favor de escribir el RNC'
                  required
                  id='rnc'
                  value={rnc}
                  name='rnc'
                  onChange={cambioEnInput}
                  maxLength={10}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </div>
              <div className='form-group mb-3'>
                <label className='label' htmlFor='nombre_empresa'>
                  Nombre de la empresa
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Favor de escribir el Nombre de la empresa'
                  required
                  id='nombre_empresa'
                  value={nombre_empresa}
                  name='nombre_empresa'
                  onChange={cambioEnInput}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </div>
              <div className='form-group mb-3'>
                <label className='label' htmlFor='contrasena'>
                  Contraseña
                </label>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Favor de escribir la Contraseña'
                  required
                  id='contrasena'
                  value={contrasena}
                  name='contrasena'
                  onChange={cambioEnInput}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </div>
              <div className='form-group mb-3'>
                <label className='label' htmlFor='contrasena2'>
                  Confirmar contraseña
                </label>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Favor de Confirmar Contraseña'
                  required
                  id='contrasena2'
                  value={contrasena2}
                  name='contrasena2'
                  onChange={cambioEnInput}
                  onPaste={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e: any) => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </div>
              <div className='form-group pt-4'>
                {alertas.length === 0 ? (
                  <button
                    type='submit'
                    onClick={enviar}
                    className='form-control btn btn-primary submit px-3'
                  >
                    Completar el registro
                  </button>
                ) : (
                  <button
                    type='submit'
                    onClick={enviar}
                    disabled
                    className='form-control btn btn-primary submit px-3'
                  >
                    Completar el registro
                  </button>
                )}
              </div>
              <div className='form-group d-md-flex'>
                <div className='w-50 text-left'>
                  {/*      <label className='checkbox-wrap checkbox-primary mb-0'>
                      Recuérdame
                      <input type='checkbox' checked />
                      <span className='checkmark'></span>
                    </label> */}
                </div>
                <div className='w-50 text-md-right'>
                  {/*     <a href='*'>Olvidaste tu contraseña</a> */}
                </div>
              </div>
            </form>
            <div className='text-center'>
              <Link to='/login' className=''>
                Volver a la página de inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
