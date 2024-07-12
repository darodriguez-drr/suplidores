/* Módulos importantes para el funcionamiento */
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraNav from '../../layout/BarraNav';
import FormularioContext from '../../../context/formulario/formularioContext';
import Cargando from '../../layout/Cargando';
import AlertaContext from '../../../context/alerta/alertaContext';
import validator from 'validator';
import AutenticacionContext from '../../../context/autenticacion/autenticacionContext';

/* Formulario */
const Form = (htmlTitle: any) => {
  /* Titulo dinámico pasado por props */
  const title = document.querySelector('title');

  /* Si el titulo no está definido colocar el titulo que viene del prop */
  title!.textContent = htmlTitle.props;

  /* Context con los estados de los usuarios */
  const formularioContext = useContext(FormularioContext);
  const {
    obtenerDatos,
    datos,
    rnc,
    anadirDatos,
    actualizarDatos,
    cargando,
    actualizar,
    obtenerRnc,
    opcionesPreguntas,
  }: any = formularioContext;

  /* Context con las alertas que mostramos en la pantalla */
  const alertaContext = useContext(AlertaContext);
  const { activarAlerta, alertas }: any = alertaContext;

  /* Para usar los estados del context  */
  const autenticacionContext = useContext(AutenticacionContext);
  const { perfil }: any = autenticacionContext;

  /* Estados en el formulario */
  const [datosFrm, colocarDatos]: any = useState([]);

  /* Para tomar solo los valores de campo select que correspondan a la pregunta 4 */
  /* Para pregunta tipo suplidor */
  const arrPregunta4 = [...opcionesPreguntas]
    .filter((x) => {
      return x.pregunta_id === 4;
    })
    /* Hacemos un map para tomar solo la descripción y colocarla en el tipo select */
    .map((x) => {
      return x.descripcion;
    });

  /* Para las otras preguntas tipo select */
  const arrOtrasPreguntas = [...opcionesPreguntas]
    .filter((x) => {
      return x.pregunta_id === 26;
    })
    /* Hacemos un map para tomar solo la descripción y colocarla en el tipo select */
    .map((x) => {
      return x.descripcion;
    });

  /* Para pregunta monedas */
  const monedas = [...opcionesPreguntas]
    .filter((x) => {
      return x.pregunta_id === 21;
    })
    /* Hacemos un map para tomar solo la descripción y colocarla en el tipo select */
    .map((x) => {
      return x.descripcion;
    });

  /* Para condicones de crédito */
  const condicionesCreditos = [...opcionesPreguntas]
    .filter((x) => {
      return x.pregunta_id === 19;
    })
    /* Hacemos un map para tomar solo la descripción y colocarla en el tipo select */
    .map((x) => {
      return x.descripcion;
    });

  /* Para formas de pago */
  const formasDePago = [...opcionesPreguntas]
    .filter((x) => {
      return x.pregunta_id === 20;
    })
    /* Hacemos un map para tomar solo la descripción y colocarla en el tipo select */
    .map((x) => {
      return x.descripcion;
    });

  /* Variable usada como indicador para saber si el usuario cuenta o no con datos maestros, si tiene datos se hace update, si no tiene se hace insert */
  let respuestaVacia = 0;

  /* Para redireccionar */
  const navigate = useNavigate();

  /* Para esperar a los datos */
  const llamarFunc = async () => {
    /* Para redireccionar al usuario autenticado a la pantalla de debe visualizar, si el usuario es admin no puede entrar al formulario de los prospectos o proveedores */
    if (perfil === 'Prospecto' || perfil === 'Proveedor') {
      await obtenerDatos();
      await obtenerRnc();
    } else {
      navigate('/admin');
    }
  };

  /* Llamar al func. con la que actualizamos los datos */
  const llamarFuncActualizar = async () => {
    await actualizarDatos([...datosFrm]);
  };

  /* Llamar al func. con la que añadimos los datos */
  const llamarFuncAnadir = async () => {
    await anadirDatos([...datosFrm]);
  };

  /* Esto es para que lo primero que hagamos al llegar al formulario es cargar los datos maestros */
  useEffect(
    () => {
      llamarFunc().then(() => {});
    },
    //eslint-disable-next-line
    []
  );

  /* Esto es para que cuando carguen los datos maestros se renderice la pantalla, para poder mostrar lo que vino */
  useEffect(() => {
    if (datos.length === 0) {
      const colocarDatosCreado: any = [];

      /* Esto es para crear el objeto con las respuestas vacias, lo necesitamos así si no nos viene nada de la base de datos
         , asi podemos tener el objeto a como debe quedar para leer los campos en el formulario y podemos llenar valores dafault como el RNC*/
      /* Esto es basicamente para colocar valores default */
      for (let x = 1; x <= 41; x++) {
        /* NOTA */
        /* SI AGREGAMOS UN VALOR AQUI SE DEBE AGREGAR TAMBIEN EN IF DE ESTE FOR QUE CONTIENE LAS OTRAS PREGUNTAS(QUE NO SON TIPO SELECT), PARA QUE NO SE REPITAN LAS RESPUESTAS EN DATOSADMIN */
        /* Para que distribuidor sea la opción default */
        if (x === 4) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'DISTRIBUIDOR',
          });
        }
        /* Esto es para aplicar el RNC con el que el usuario se registro */
        /* Para poner el RNC con el que se registro el usuario */
        if (x === 16) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: rnc,
          });
        }

        /* Select de condiciones de crédito */
        if (x === 19) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'Crédito a 15 Días',
          });
        }
        if (x === 20) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'Transferencia',
          });
        }
        /* Los siguientes son para valores Default de los select, para que si no viene nada de la base de datos le pongamos este default a todos */
        /* Esto aplica para las preguntas select en específico */
        if (x === 21) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'DOP',
          });
        }
        if (x === 26) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 27) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 29) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 31) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 32) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 33) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 34) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 35) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 36) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 37) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 38) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 39) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 40) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }
        if (x === 41) {
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: 'SI',
          });
        }

        /* NOTA */
        /* SI AGREGAMOS UN NUMERO DE PREGUNTA AQUI SIGNIFICA QUE YA HA SIDO AGREGADO ARRIBA Y PARA FIN DE EXITAR QUE SE REPITA LA PREGUNTA ID, SE AGREGA A ESTE IF PARA QUE SEA IGNORADA Y SOLO SE AGREGUE A DATOSADMIN UNA VEZ */
        /* Si no es campo select y tampoco es el campo de RNC, se agrega un string vacío */
        if (
          x !== 4 &&
          x !== 16 &&
          x !== 19 &&
          x !== 20 &&
          x !== 21 &&
          x !== 26 &&
          x !== 27 &&
          x !== 29 &&
          x !== 31 &&
          x !== 32 &&
          x !== 33 &&
          x !== 34 &&
          x !== 35 &&
          x !== 36 &&
          x !== 37 &&
          x !== 38 &&
          x !== 39 &&
          x !== 40 &&
          x !== 41
        ) {
          /* Esto aplica para todas las otras preguntas */
          colocarDatosCreado.push({
            pregunta_id: x,
            respuesta_valor: '',
          });
        }
      }

      /* Colocamos el objeto con las preguntas vacias que ya fuimos colocando, excepto la del RNC, esto hace que los campos salgan en el formulario
         como lo definimos */
      colocarDatos(colocarDatosCreado);
    } else {
      /* Este es para cuando ya el usuario si cuenta con datos maestros */
      colocarDatos(datos);
    }

    /* Renderizamos el formulario si los estados datos o cargando cambian de valor */
    //eslint-disable-next-line
  }, [datos, cargando]);

  /* Para la validación de correo */
  const [message, setMessage] = useState('');
  /* Para la validación de teléfono */
  const [telefonoE, setTelefono] = useState('');
  /* Para la validación de Fax */
  const [faxE, setfax] = useState('');
  const validateEmail = (e: any) => {
    const email = e.target.value;

    if (validator.isEmail(email)) {
      setMessage('Email correcto!');
    } else {
      setMessage('Favor, ingresa un email correcto');
    }
  };

  /* Función para validar el teléfono */
  const validateTelefono = (e: any) => {
    const telefono = e.target.value;

    if (validator.isMobilePhone(telefono, 'es-DO')) {
      setTelefono('Teléfono correcto!');
    } else {
      setTelefono('Favor, ingresa un teléfono correcto sin guiones(-)');
    }
  };

  /* Función para validar el fax */
  const validateFax = (e: any) => {
    const fax = e.target.value;

    if (validator.isMobilePhone(fax, 'es-DO')) {
      setfax('Fax correcto!');
    } else {
      setfax('Favor, ingresa un Fax correcto');
    }
  };

  /* Para cambios en los campos del formulario */
  const cambioCampo = (pregunta_id: number, respuesta_valor: string) => {
    try {
      const listas = [...datosFrm];
      const lista: any = listas.find((a) => a.pregunta_id === pregunta_id);
      lista.respuesta_valor = respuesta_valor ? respuesta_valor : '';
      colocarDatos(listas);
    } catch (error) {}
  };

  /* Para cuando queremos guardar los datos en la base de datos */
  const enviar = async (e: any) => {
    e.preventDefault();
    respuestaVacia = 0;
    for (let y = 1; y < [...datosFrm].length; y++) {
      if (
        [...datosFrm].find((a: any) => a.pregunta_id === y).respuesta_valor ===
        ''
      ) {
        respuestaVacia = 1;
      }
    }

    /* Si quieres guardar los datos maestros y todos los campos no están llenos */
    if (respuestaVacia === 1) {
      activarAlerta('Favor, completa todos los campos', 'danger');
    }

    /* Para encontrar la respuesta o texto que esté en el campo de correo y validarlo al momento de enviar los datos del formulario*/
    const email = datosFrm.find(
      (a: any) => a.pregunta_id === 12
    )?.respuesta_valor;

    /* Para encontrar la respuesta o texto que esté en el campo de teléfono y validarlo al momento de enviar los datos del formulario */
    const telefono = datosFrm.find(
      (a: any) => a.pregunta_id === 10
    )?.respuesta_valor;

    /* Para encontrar la respuesta o texto que esté en el campo de fax y validarlo al momento de enviar los datos del formulario */
    const fax = datosFrm.find(
      (a: any) => a.pregunta_id === 11
    )?.respuesta_valor;

    if (respuestaVacia !== 1) {
      /* Si las respuestas no están vacías validamos correo, teléfono y fax */
      if (validator.isEmail(email)) {
        if (validator.isMobilePhone(telefono, 'es-DO') !== false) {
          if (validator.isMobilePhone(fax, 'es-DO') !== false) {
            /* Esto es para cuando el usuario si posee datos maestros, entonces hacemos un update */
            if (actualizar === true) {
              llamarFuncActualizar();
            } else {
              /* Esto es para cuando el usuario no posee datos maestros, estonces hacemos un insert */
              llamarFuncAnadir();
            }
          } else {
            setfax('Favor, ingresa un Fax correcto');
            activarAlerta('Favor, ingresa un Fax correcto', 'danger');
          }
        } else {
          /* En caso de que el número esté incorrecto */
          setTelefono('Favor, ingresa un teléfono correcto sin guiones(-)');
          activarAlerta(
            'Favor, ingresa un teléfono correcto sin guiones(-)',
            'danger'
          );
        }
      } else {
        setMessage('Favor, ingresa un email correcto');
        activarAlerta('Favor, ingresa un email correcto', 'danger');
      }
    }
  };

  /* Para mostrar gif de cargando si todavia no tenemos los datos */
  if (cargando) {
    return <Cargando />;
  }

  /* Cargamos el formulario con los datos ya cargado */
  if ([...datosFrm].length > 0 && cargando !== true)
    return (
      <>
        <BarraNav htmltext='Formulario' icon='fa-table-list' />
        <div
          className='container border rounded-4 my-4 p-4'
          style={{ backgroundColor: '#f8f9fd' }}
        >
          <div className='row'>
            <div className='col-2 col-sm-2 col-md-2 col-xl-2 text-right d-flex flex-column align-items-center justify-content-evenly'>
              <img
                src='/logo-mejorado.png'
                alt='Grupo Rica Logo'
                width='70px'
                className=''
              />
            </div>
            <div className='col-8 col-sm-8 col-md-8 col-xl-8'>
              <h5 className='text-center mb-0 pt-4'>GRUPO CORPORATIVO RICA</h5>
              <p className='text-center pt-3 pb-0 mb-0'>
                DIRECCION CORPORATIVA DE COMPRAS Y ADUANAS
              </p>
              <p className='text-center'>
                FORMULARIO PARA CREACION DE NUEVO SUPLIDOR
              </p>
            </div>
            <div className='col-2 col-sm-2 col-md-2 col-xl-2 d-flex flex-column align-items-center justify-content-evenly text-start'>
              <img
                src='/ccdt.png'
                alt='Grupo Rica Logo'
                width='70px'
                className=''
              />
            </div>
          </div>
          <h6 className='py-3' style={{ paddingLeft: '15px' }}>
            INFORMACION DEL SUPLIDOR:
          </h6>
          <form onSubmit={enviar} className='needs-validation'>
            <div className='container'>
              <div className='row'>
                <div className='col-12 col-sm-12 col-md-6 col-xl-6'>
                  <div className='row g-3 align-items-center'>
                    <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                      <label htmlFor='pregunta_1' className='col-form-label'>
                        RAZON SOCIAL:
                      </label>
                    </div>
                    <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                      <input
                        type='text'
                        id='pregunta_1'
                        name='pregunta_1'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 1)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(1, e.target.value);
                        }}
                        className='form-control'
                        required
                      />
                      <div className='valid-feedback'>Looks good!</div>
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                      <label htmlFor='pregunta_2' className='col-form-label'>
                        NOMBRE COMERCIAL:
                      </label>
                    </div>
                    <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                      <input
                        type='text'
                        id='pregunta_2'
                        name='pregunta_2'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 2)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(2, e.target.value);
                        }}
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-auto'>
                      <label htmlFor='pregunta_3' className='col-form-label'>
                        ESTA SU EMPRESA VINCULADA A OTRA QUE YA PRESTE SERVICIOS
                        AL GRUPO RICA? DE SER SI, FAVOR DE ESPECIFICAR CUAL:
                      </label>
                    </div>
                    <div className='col-auto w-100'>
                      <input
                        type='text'
                        id='pregunta_3'
                        name='pregunta_3'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 3)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(3, e.target.value);
                        }}
                        className='form-control'
                        required
                      />
                    </div>
                  </div>
                  <div className='py-4'>
                    <label htmlFor='pregunta_4' className='col-form-label'>
                      TIPO DE SUPLIDOR:
                    </label>

                    <select
                      className='form-select'
                      id='pregunta_4'
                      name='pregunta_4'
                      value={
                        datosFrm.find((a: any) => a.pregunta_id === 4)
                          ?.respuesta_valor
                      }
                      onChange={(e) => {
                        cambioCampo(
                          4,
                          e.target.options[e.target.selectedIndex].value
                        );
                      }}
                      required
                    >
                      {arrPregunta4.map((tipsup: any) => (
                        <option
                          value={tipsup}
                          key={`0${arrPregunta4.indexOf(tipsup)}${
                            [...datosFrm].find((a: any) => a.pregunta_id === 4)
                              ?.pregunta_id
                          }`}
                        >
                          {tipsup}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* SEGUNDO */}
                <div className='col-12 col-sm-12 col-md-6 col-xl-6'>
                  <div className='row g-3 align-items-center'>
                    <div className='col-12 col-sm-12 col-md-2 col-lg-2 col-xxl-2'>
                      <label htmlFor='pregunta_18' className='col-form-label'>
                        COD:
                      </label>
                    </div>
                    <div className='col-12 col-sm-12 col-md-10 col-lg-10 col-xxl-10'>
                      <input
                        type='number'
                        id='pregunta_18'
                        name='pregunta_18'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 18)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(18, e.target.value);
                        }}
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-12 col-sm-12 col-md-2 col-lg-2 col-xxl-2'>
                      <label htmlFor='pregunta_17' className='col-form-label'>
                        FECHA:
                      </label>
                    </div>
                    <div className='col-12 col-sm-12 col-md-10 col-lg-10 col-xxl-10'>
                      <input
                        type='date'
                        id='pregunta_17'
                        name='pregunta_17'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 17)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(17, e.target.value);
                        }}
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                      <p className='my-auto'>RNC-CEDULA / TAX ID, SSN:</p>
                    </div>
                    <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                      <span className='badge rounded-pill bg-secondary w-100 fs-5'>
                        {
                          datosFrm.find((a: any) => a.pregunta_id === 16)
                            ?.respuesta_valor
                        }
                      </span>
                      {/*    <p className='badge bg-secondary text-wrap w-100 font-monospace'>
                      {
                        datosFrm.find((a: any) => a.pregunta_id === 16)
                          ?.respuesta_valor
                      }
                    </p> */}
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-auto'>
                      <label htmlFor='pregunta_15' className='col-form-label'>
                        PROPIETARIO / SOCIO MAYORITARIO:
                      </label>
                    </div>
                    <div className='col'>
                      <input
                        type='text'
                        id='pregunta_15'
                        name='pregunta_15'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 15)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(15, e.target.value);
                        }}
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-auto'>
                      <label htmlFor='pregunta_14' className='col-form-label'>
                        ESTA VINCULADO/A A ALGUN EMPLEADO DEL GRUPO RICA? DE SER
                        SI, FAVOR DE ESPECIFICAR A QUIEN:
                      </label>
                    </div>
                    <div className='col-auto w-100'>
                      <input
                        type='text'
                        id='pregunta_14'
                        name='pregunta_14'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 14)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(14, e.target.value);
                        }}
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-auto'>
                      <label htmlFor='pregunta_13' className='col-form-label'>
                        INICIO DE OPERACIONES:
                      </label>
                    </div>
                    <div className='col'>
                      <input
                        type='date'
                        id='pregunta_13'
                        name='pregunta_13'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 13)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(13, e.target.value);
                        }}
                        className='form-control'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-12 col-sm-12 col-md-12 col-xl-12'>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-auto'>
                      <label htmlFor='pregunta_5' className='col-form-label'>
                        ACTIVIDAD DE LA EMPRESA
                      </label>
                    </div>
                    <div className='col-auto w-100'>
                      <input
                        type='text'
                        id='pregunta_5'
                        name='pregunta_5'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 5)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(5, e.target.value);
                        }}
                        className='form-control'
                        aria-describedby='passwordHelpInline'
                      />
                    </div>
                  </div>
                  <div className='row g-3 align-items-center pt-3'>
                    <div className='col-auto'>
                      <label htmlFor='pregunta_6' className='col-form-label'>
                        PRODUCTOS O SERVICIOS QUE OFRECE (especificar marcas de
                        productos)
                      </label>
                    </div>
                    <div className='col-auto w-100'>
                      <input
                        type='text'
                        id='pregunta_6'
                        name='pregunta_6'
                        value={
                          datosFrm.find((a: any) => a.pregunta_id === 6)
                            ?.respuesta_valor
                        }
                        onChange={(e) => {
                          cambioCampo(6, e.target.value);
                        }}
                        className='form-control'
                        aria-describedby='passwordHelpInline'
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12 col-sm-6 col-md-6 col-xl-6'>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-auto'>
                          <label
                            htmlFor='pregunta_7'
                            className='col-form-label'
                          >
                            DIRECCION DE LA OFICINA
                          </label>
                        </div>
                        <div className='col-auto w-100'>
                          <textarea
                            /* type='text' */
                            id='pregunta_7'
                            name='pregunta_7'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 7)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(7, e.target.value);
                            }}
                            className='form-control'
                            rows={8}
                            required={true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-12 col-sm-6 col-md-6 col-xl-6'>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                          <label
                            htmlFor='pregunta_8'
                            className='col-form-label'
                          >
                            CONTACTO EN PAGOS:
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                          <input
                            type='text'
                            id='pregunta_8'
                            name='pregunta_8'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 8)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(8, e.target.value);
                            }}
                            className='form-control'
                          />
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                          <label
                            htmlFor='pregunta_9'
                            className='col-form-label'
                          >
                            VENDEDOR:
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                          <input
                            type='text'
                            id='pregunta_9'
                            name='pregunta_9'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 9)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(9, e.target.value);
                            }}
                            className='form-control'
                            required
                          />
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                          <label
                            htmlFor='pregunta_10'
                            className='col-form-label'
                          >
                            TELEFONO:
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                          <input
                            type='tel'
                            id='pregunta_10'
                            name='pregunta_10'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 10)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(10, e.target.value);
                              validateTelefono(e);
                            }}
                            className='form-control'
                            required
                          />
                          {telefonoE ===
                          'Favor, ingresa un teléfono correcto sin guiones(-)' ? (
                            <div className='text-danger'>{telefonoE}</div>
                          ) : telefonoE === 'Teléfono correcto!' ? (
                            <div className='text-success'>{telefonoE}</div>
                          ) : (
                            <p></p>
                          )}
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                          <label
                            htmlFor='pregunta_11'
                            className='col-form-label'
                          >
                            FAX:
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                          <input
                            type='text'
                            id='pregunta_11'
                            name='pregunta_11'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 11)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(11, e.target.value);
                              validateFax(e);
                            }}
                            className='form-control'
                          />
                          {faxE === 'Favor, ingresa un Fax correcto' ? (
                            <div className='text-danger'>{faxE}</div>
                          ) : faxE === 'Fax correcto!' ? (
                            <div className='text-success'>{faxE}</div>
                          ) : (
                            <p></p>
                          )}
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                          <label
                            htmlFor='pregunta_12'
                            className='col-form-label'
                          >
                            EMAIL:
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                          <input
                            type='email'
                            id='pregunta_12'
                            name='pregunta_12'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 12)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(12, e.target.value);
                              validateEmail(e);
                            }}
                            className='form-control'
                            required
                          />
                          {message === 'Favor, ingresa un email correcto' ? (
                            <div className='text-danger'>{message}</div>
                          ) : message === 'Email correcto!' ? (
                            <div className='text-success'>{message}</div>
                          ) : (
                            <p></p>
                          )}
                        </div>
                      </div>
                    </div>
                    <h6 className='pt-4'>INFORMACION PARA PAGOS</h6>
                    <div className='col-12 col-sm-6 col-md-6 col-xl-6'>
                      <div className='row g-3 align-items-center'>
                        <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                          <label
                            htmlFor='pregunta_19'
                            className='col-form-label'
                          >
                            CONDICIONES DE CREDITO:
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                          <select
                            className='form-select'
                            id='pregunta_19'
                            name='pregunta_19'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 19)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                19,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {condicionesCreditos.map(
                              (condicionesCredito: any) => (
                                <option
                                  value={condicionesCredito}
                                  key={`0${condicionesCreditos.indexOf(
                                    condicionesCredito
                                  )}${
                                    [...datosFrm].find(
                                      (a: any) => a.pregunta_id === 19
                                    )?.pregunta_id
                                  }`}
                                >
                                  {condicionesCredito}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-4'>
                          <label
                            htmlFor='pregunta_20'
                            className='col-form-label'
                          >
                            FORMA DE PAGO:
                          </label>
                        </div>

                        <div className='col-12 col-sm-12 col-md-8 col-lg-8 col-xxl-8'>
                          <select
                            className='form-select'
                            id='pregunta_20'
                            name='pregunta_20'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 20)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                20,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {formasDePago.map((formaDePago: any) => (
                              <option
                                value={formaDePago}
                                key={`0${formasDePago.indexOf(formaDePago)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 20
                                  )?.pregunta_id
                                }`}
                              >
                                {formaDePago}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-9'>
                          <label
                            htmlFor='pregunta_21'
                            className='col-form-label'
                          >
                            MONEDA:
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-3'>
                          <select
                            className='form-select'
                            id='pregunta_21'
                            name='pregunta_21'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 21)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                21,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {monedas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${monedas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 21
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='col-12 col-sm-6 col-md-6 col-xl-6'>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-auto me-auto'>
                          <label
                            htmlFor='pregunta_22'
                            className='col-form-label'
                          >
                            SI ES POR TRANSFERENCIA: (Banco, Cuenta, Nombre,
                            Swift, ABA, Transit, Routing)
                          </label>
                        </div>
                        <div className='col-auto w-100'>
                          <input
                            type='text'
                            id='pregunta_22'
                            name='pregunta_22'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 22)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(22, e.target.value);
                            }}
                            className='form-control'
                          />
                        </div>
                      </div>
                      <h6 className='pt-4'>
                        Referencias comerciales (de clientes actuales)
                      </h6>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-auto'>
                          <label
                            htmlFor='pregunta_23'
                            className='col-form-label'
                          >
                            1)
                          </label>
                        </div>
                        <div className='col'>
                          <input
                            type='text'
                            id='pregunta_23'
                            name='pregunta_23'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 23)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(23, e.target.value);
                            }}
                            className='form-control'
                          />
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-auto'>
                          <label
                            htmlFor='pregunta_24'
                            className='col-form-label'
                          >
                            2)
                          </label>
                        </div>
                        <div className='col'>
                          <input
                            type='text'
                            id='pregunta_24'
                            name='pregunta_24'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 24)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(24, e.target.value);
                            }}
                            className='form-control'
                          />
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-auto'>
                          <label
                            htmlFor='pregunta_25'
                            className='col-form-label'
                          >
                            3)
                          </label>
                        </div>
                        <div className='col'>
                          <input
                            type='text'
                            id='pregunta_25'
                            name='pregunta_25'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 25)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(25, e.target.value);
                            }}
                            className='form-control'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-12 col-sm-12 col-md-12 col-xl-12'>
                      <h6 className='text-center py-4'>
                        AUTOEVALUACION PROVEEDORES DE MATERIAS PRIMAS, EMPAQUES
                        Y QUIMICOS
                      </h6>
                      <p className='px-0'>SISTEMA DE CALIDAD E INOCUIDAD </p>
                      <div className='row g-3 align-items-center'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_26'
                            className='col-form-label'
                          >
                            1.La empresa cuenta con una certificación de calidad
                            ?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_26'
                            name='pregunta_26'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 26)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                26,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 26
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_27'
                            className='col-form-label'
                          >
                            2.Tiene implantado un sistema de inocuidad de
                            alimentos?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_27'
                            name='pregunta_27'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 27)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                27,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 27
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='col-12 col-sm-12 col-md-12 col-xl-12'>
                        <div className='row g-3 align-items-center mt-3'>
                          <div className='col-auto ps-0'>
                            <label
                              className='col-form-label'
                              htmlFor='pregunta_28'
                            >
                              3. Indicar posiciones dentro del organigrama de su
                              empresa que trabajan en temas de seguridad de
                              alimentos: higiene, seguridad, plagas y químicos
                            </label>
                          </div>
                          <div className='col-auto w-100 ps-0'>
                            <textarea
                              /* type='text' */
                              id='pregunta_28'
                              required
                              name='pregunta_28'
                              value={
                                datosFrm.find((a: any) => a.pregunta_id === 28)
                                  ?.respuesta_valor
                              }
                              onChange={(e) => {
                                cambioCampo(28, e.target.value);
                              }}
                              className='form-control'
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_29'
                            className='col-form-label'
                          >
                            4. En caso de que la pregunta 1 y/o 2 sean
                            negativas. ¿Tiene programado la implantación de un
                            sistema de calidad y/ o inocuidad?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_29'
                            name='pregunta_29'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 29)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                29,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 29
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='col-12 col-sm-12 col-md-12 col-xl-12'>
                        <div className='row g-3 align-items-center pt-3'>
                          <div className='col-auto ps-0'>
                            <label
                              htmlFor='pregunta_30'
                              className='col-form-label'
                            >
                              5 ¿En caso de ser afirmativa la pregunta no. 4
                              especificar plazo para implementación
                            </label>
                          </div>
                          <div className='col-auto w-100 ps-0'>
                            <input
                              /* type='text' */
                              id='pregunta_30'
                              name='pregunta_30'
                              value={
                                datosFrm.find((a: any) => a.pregunta_id === 30)
                                  ?.respuesta_valor
                              }
                              onChange={(e) => {
                                cambioCampo(30, e.target.value);
                              }}
                              className='form-control'
                              type='text'
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_31'
                            className='col-form-label'
                          >
                            6 ¿La empresa cuenta con un manual de BPM (Buenas
                            Prácticas de Manufactura) y/o manual de Buenas
                            Prácticas de Almacenamiento?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_31'
                            name='pregunta_31'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 31)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                31,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 31
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_32'
                            className='col-form-label'
                          >
                            7 ¿La empresa cuenta con una política de inocuidad
                            de alimentos ?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_32'
                            name='pregunta_32'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 32)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                32,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 32
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_33'
                            className='col-form-label'
                          >
                            8 ¿La empresa tiene elaborado un plan de HACCP para
                            el/ los productos que nos suple?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_33'
                            name='pregunta_33'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 33)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                33,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 33
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_34'
                            className='col-form-label'
                          >
                            9 ¿Cuenta con especificaciones técnicas de los
                            productos que comercializa y/o fabrica?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_34'
                            name='pregunta_34'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 34)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                34,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 34
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_35'
                            className='col-form-label'
                          >
                            10 ¿Evalúan a sus proveedores antes de adquirir
                            nuevos suministros y los revalúan periódicamente?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_35'
                            name='pregunta_35'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 35)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                35,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 35
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_36'
                            className='col-form-label'
                          >
                            11 ¿Cuenta con un método de identificación y
                            trazabilidad de los productos?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_36'
                            name='pregunta_36'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 36)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                36,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 36
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_37'
                            className='col-form-label'
                          >
                            12 ¿Cuentan con un procedimiento de resolución de
                            reclamaciones y no conformidades formuladas por los
                            clientes ?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_37'
                            name='pregunta_37'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 37)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                37,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 37
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_38'
                            className='col-form-label'
                          >
                            13 ¿Asegura la adecuada manipulación,
                            almacenamiento, embalaje, conservación y entrega de
                            sus productos ?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_38'
                            name='pregunta_38'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 38)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                38,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 38
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_39'
                            className='col-form-label'
                          >
                            14 ¿La empresa realiza inspección de los vehículos
                            de transporte y lleva registros para verificar la
                            higiene y ausencia de plagas de los mismos?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            id='pregunta_39'
                            name='pregunta_39'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 39)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                39,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                            className='form-select'
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 39
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_40'
                            className='col-form-label'
                          >
                            15 ¿La empresa cuenta con un programa de control de
                            plagas?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_40'
                            name='pregunta_40'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 40)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                40,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 40
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='row g-3 align-items-center pt-3'>
                        <div className='col-12 col-sm-12 col-md-10 col-xl-10'>
                          <label
                            htmlFor='pregunta_41'
                            className='col-form-label'
                          >
                            16 ¿La empresa suministra certificados de calidad de
                            los lotes despachados y cartas de garantía de sus
                            productos?
                          </label>
                        </div>
                        <div className='col-12 col-sm-12 col-md-2 col-xl-2'>
                          <select
                            className='form-select'
                            id='pregunta_41'
                            name='pregunta_41'
                            value={
                              datosFrm.find((a: any) => a.pregunta_id === 41)
                                ?.respuesta_valor
                            }
                            onChange={(e) => {
                              cambioCampo(
                                41,
                                e.target.options[e.target.selectedIndex].value
                              );
                            }}
                          >
                            {arrOtrasPreguntas.map((tipsup: any) => (
                              <option
                                value={tipsup}
                                key={`0${arrOtrasPreguntas.indexOf(tipsup)}${
                                  [...datosFrm].find(
                                    (a: any) => a.pregunta_id === 41
                                  )?.pregunta_id
                                }`}
                              >
                                {tipsup}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col col-12 col-sm-12 col-md-2 col-lg-2 col-xxl-2 p-0 mx-auto pt-4'>
              {alertas.length === 0 ? (
                <button
                  className='btn btn-success w-100' /* onClick={enviar} */
                >
                  {actualizar === true ? 'Actualizar datos' : 'Guardar datos'}
                </button>
              ) : (
                <button className='btn btn-success w-100' disabled>
                  {actualizar === true ? 'Actualizar datos' : 'Guardar datos'}
                </button>
              )}
            </div>
          </form>
        </div>
      </>
    );
};

export default Form;
