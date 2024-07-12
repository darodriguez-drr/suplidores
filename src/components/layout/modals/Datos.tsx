/* Módulos importantes para el funcionamiento */
import { useContext } from 'react';
import AdminContext from '../../../context//admin/adminContext';
import CargandoModal from '../CargandoModal';

/* Modal que muestra los datos maestros del solicitante */
const Datos = (arr: any) => {
  /* Context con los estados de los usuarios */
  const adminContext = useContext(AdminContext);
  const { cargandoModal }: any = adminContext;
  return (
    <>
      {cargandoModal ? (
        <CargandoModal />
      ) : (
        <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
          <form className='form-floating mb-2'>
            <input
              type='email'
              className='form-control'
              id='floatingInputValue'
              placeholder='name@example.com'
              value={arr.arr.respuesta_valor}
              aria-label='readonly input example'
              readOnly
            />
            <label htmlFor='floatingInputValue'>
              {arr.arr.preguntas.descripcion}
            </label>
          </form>
        </div>
      )}
    </>
  );
};

export default Datos;
