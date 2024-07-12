/* Módulos importantes para el funcionamiento */
import BarraNav from '../../layout/BarraNav';
import { useContext, useEffect } from 'react';
import AdminContext from '../../../context/admin/adminContext';
import Cargando from '../../layout/Cargando';
import ListaPendientesItem from '../../layout/ListaPendientesItem';

const CamposReqAprb = () => {
  /* Context con los estados de los administradores */
  const adminContext = useContext(AdminContext);
  const {
    obtenerListaCamposPendientesAprb,
    cargando,
    listaPendientes,
    cantidadPendientes,
  }: any = adminContext;

  /* Para esperar a los datos */
  const llamarFunc = async () => {
    obtenerListaCamposPendientesAprb();
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

  if (cargando) {
    return <Cargando />;
  }
  if ([...listaPendientes].length > 0 && cargando !== true) {
    return (
      <>
        <BarraNav htmltext='Monitor del Portal' icon='fa-pager' />
        <div className='container'>
          <div className='row'>
            <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12'>
              <div className='container mt-5'>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='card'>
                      <div className='card-header text-white bg-primary'>
                        <h3 className='text-center text-white bg-primary'>
                          Lista de campos que requieren aprobación (
                          {cantidadPendientes})
                          <i className='fa-solid fa-check ps-2'></i>
                        </h3>
                      </div>
                      <div className='card-body rounded'>
                        <ul className='list-group'>
                          {[...listaPendientes].length > 0 ? (
                            listaPendientes.map((item: any) => (
                              <ListaPendientesItem key={item.uuid} {...item} />
                            ))
                          ) : (
                            <h4>No hay campos pendientes de aprobación</h4>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default CamposReqAprb;
