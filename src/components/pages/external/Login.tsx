/* Módulos importantes */
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AutenticacionContext from '../../../context/autenticacion/autenticacionContext';
import AlertaContext from '../../../context/alerta/alertaContext';
import Cargando from '../../layout/Cargando';

/* Pantalla de inicio de sesión  */
const Login = ({ htmlTitle }: any) => {
  /* Titulo dinámico pasado por props */
  const title = document.querySelector('title');

  /* Si el titulo no está definido colocar el titulo que viene del prop */
  title!.textContent = htmlTitle;

  const navigate = useNavigate();

  /* Context con los estados de los usuarios */
  const autenticacionContext = useContext(AutenticacionContext);
  const {
    iniciarSesion,
    estaAutenticado,
    error,
    limpiarErrores,
    cargando,
    cargarUsuario,
  }: any = autenticacionContext;

  /* Context con las alertas que mostramos en la pantalla */
  const alertaContext = useContext(AlertaContext);
  const { activarAlerta, alertas }: any = alertaContext;

  /* Para cargar el usuario de manera asíncrona */
  const llamarCargarUsuario = async () => {
    await cargarUsuario();
  };

  useEffect(
    () => {
      llamarCargarUsuario().then(() => {});
    },
    /* Para desactivar advertencia */
    //eslint-disable-next-line
    []
  );

  /* Esto hook recarga la página cada vez que las dependencias cambian */
  useEffect(
    () => {
      if (estaAutenticado) {
        /* Si las credenciales estan correctas se redirigue al usuario a la página del formulario */
        navigate('/defaultpage');
      }
      /* Si las credenciales están incorrectas */
      if (error === 'Unauthorized') {
        activarAlerta('Credenciales incorrectas', 'danger');
      }
      limpiarErrores();
    },
    // Dependencias para useEffect, cada vez que estas cambien se actualiza los datos que esten en el componente
    // eslint-disable-next-line
    [error, estaAutenticado, cargando]
  );

  /* Variables para los inputs de este formulario */
  const [datosInicioSesion, aplicarDatosInicioSesion] = useState({
    username: '',
    password: '',
  });

  /* Para facilicar el acceso a los estados del registro */
  const { username, password } = datosInicioSesion;

  /* Esta función es llamada al escribir en los inputs para colocar lo que escribimis
     en el estado datosRegistro */
  const cambioEnInput = (e: any) => {
    aplicarDatosInicioSesion({
      ...datosInicioSesion,
      [e.target.name]: e.target.value,
    });
  };

  /* Esta función es llamada al dar click Completar el registro */
  const enviar = (e: any) => {
    e.preventDefault();
    /* Si el usuario o la contraseña está vacío muestra error */
    if (username === '' || password === '') {
      activarAlerta(
        /* Mensaje a ser mostrado en la alerta */
        ' Favor, completa todos los campos',
        'warning'
      );
    } else {
      /* Si no hay error hacemos la petición a la API para crear el usuario */
      iniciarSesion({ username, password });
    }
  };

  /* Para mostrar y ocultar la contraseña */
  var tipo: any = document.getElementById('password');
  var icono: any = document.getElementById('iconEye');
  const mostrarIcon = document.getElementById('basic-addon1');

  /* Para detectar cuando el el mouse se deja presionado sobre el ojo de mostrar la contraseña */
  mostrarIcon?.addEventListener('mousedown', () => {
    tipo.type = 'text';
    icono.className = 'bi bi-eye-slash';
  });

  /* Para detectar cuando se suelta el botón del mouse del ojo que permite mostrar la contraseña */
  mostrarIcon?.addEventListener('mouseup', () => {
    tipo.type = 'password';
    icono.className = 'bi bi-eye';
  });

  /* Para detectar cuando se haga mousedown y luego rapidamente se haga un mouseleave, lo que hace que el mouseup no corra y el icono el campo se quede tipo text */
  mostrarIcon?.addEventListener('mouseleave', () => {
    tipo.type = 'password';
    icono.className = 'bi bi-eye';
  });

  /*   if (estaAutenticado) {
    return <Navigate to='/form' />;
  } else */ if (cargando) {
    return <Cargando />;
  } else {
    return (
      <div className='vh-100 d-flex align-items-center mt-5 mt-sm-0 mt-md-0 mt-xl-0 mt-xxl-0'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-12 col-lg-10'>
              <div className='wrap d-md-flex'>
                <div className='text-wrap p-4 p-lg-5 text-center d-flex align-items-center order-md-last rounded-end'>
                  <div className='text w-100'>
                    <img
                      src='/Logo-Rica.png'
                      alt='Grupo Rica Logo'
                      width='20%'
                    />
                    <h2>Bienvenido al portal de proveedores</h2>
                    <p>¿No tienes una cuenta?</p>
                    <Link
                      to='/register'
                      className='btn btn-white btn-outline-white'
                    >
                      Regístrate
                    </Link>
                  </div>
                </div>
                <div className='login-wrap p-4 p-lg-5 rounded-start'>
                  <div className='d-flex'>
                    <div className='w-100'>
                      <h3 className='mb-4'>Iniciar sesión</h3>
                    </div>
                    {/*    <div className='w-100'></div> */}
                  </div>
                  <form action='#' className='signin-form'>
                    <div className='form-group mb-3'>
                      <label className='label' htmlFor='username'>
                        Correo o RNC
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Favor de escribir el Correo o RNC'
                        required
                        id='username'
                        name='username'
                        value={username}
                        onChange={cambioEnInput}
                        autoComplete='given-email'
                      />
                    </div>
                    <div className='form-group mb-3'>
                      <label className='label' htmlFor='password'>
                        Contraseña
                      </label>
                      <div className='input-group mb-3'>
                        <input
                          type='password'
                          className='form-control'
                          placeholder='Favor de escribir la Contraseña'
                          required
                          id='password'
                          name='password'
                          value={password}
                          onChange={cambioEnInput}
                        />
                        <span
                          className='input-group-text border-0'
                          style={{
                            borderRadius: '0px 50px 50px 0px',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          }}
                          id='basic-addon1'
                        >
                          <i className='bi bi-eye' id='iconEye'></i>
                        </span>
                      </div>
                    </div>
                    <div className='form-group pt-4'>
                      {alertas.length === 0 ? (
                        <button
                          type='submit'
                          onClick={enviar}
                          className='form-control btn btn-primary submit px-3'
                        >
                          Iniciar sesión
                        </button>
                      ) : (
                        <button
                          type='submit'
                          disabled
                          onClick={enviar}
                          className='form-control btn btn-primary submit px-3'
                        >
                          Iniciar sesión
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Login;
