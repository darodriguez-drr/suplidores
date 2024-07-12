const ListaPendientesItem = (listaPendientes: any) => {
  /* Extraer campos del array */
  const { respuesta_anterior, respuesta_valor, fecha_creacion } =
    listaPendientes;

  return (
    <>
      <h4 className='mt-3'>{listaPendientes.usuario.nombre_empresa}</h4>
      <li className='list-group-item rounded'>
        <b>Campo:</b> {listaPendientes.preguntas.descripcion} |{' '}
        <b>Valor Anterior:</b> {respuesta_anterior} | <b>Nuevo Valor:</b>{' '}
        {respuesta_valor} | <b>Fecha:</b> {fecha_creacion}
        <div className='text-center mt-2'>
          <button className='me-3 btn'>
            <i className='fa-solid fa-check text-success pe-1'></i>
            Aprobar
          </button>
          <button className='me-3 btn'>
            <i className='fa-solid fa-xmark text-danger pe-1'></i>
            No aprobar
          </button>
        </div>
      </li>
    </>
  );
};

export default ListaPendientesItem;
