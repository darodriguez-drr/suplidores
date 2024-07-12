/* Módulos importantes para el funcionamiento */
import React, { useContext } from 'react';
import AlertaContext from '../../context/alerta/alertaContext';

/* Esto es para mostrar alertas o notificaciones en el las pantallas */
const Alertas = () => {
  /* Esto es para usar el Context de las alertas */
  const alertaContext = useContext(AlertaContext);
  const { alertas }: any = alertaContext;

  return (
    /* Muestra la alerta en caso de que hayan alertas para mostrar */
    alertas.length > 0 &&
    alertas.map((alerta: any) => (
      <div
        className='toast-container p-3 top-0 start-50 translate-middle-x position-fixed'
        key={alerta.id}>
        <div
          className={`toast shadow-none align-items-center text-bg-${alerta.type} border-0 fade show `}
          role='alert'
          aria-live='assertive'
          aria-atomic='true'>
          <div className='d-flex'>
            <div className='toast-body'>{alerta.msg}</div>
            <button
              type='button'
              className='btn-close btn-close-white me-2 my-auto ms-auto'
              style={{ paddingRight: '20px' }}
              data-bs-dismiss='toast'
              aria-label='Close'></button>
          </div>
        </div>
      </div>
      /*     <div
        key={alerta.id}
        className={`alert alert-${alerta.type} text-center fixed-top`}>
        <i className='fas fa-info-circle'> {alerta.msg}</i>
      </div> */
    ))
  );
};

export default Alertas;
