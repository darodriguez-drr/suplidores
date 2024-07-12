/* Módulos importantes */
import { Link } from 'react-router-dom';

const Notfound = ({ htmlTitle }: any) => {
  const title = document.querySelector('title');

  title!.textContent = htmlTitle;
  return (
    <div className='vh-100 d-flex align-items-center'>
      <div className='d-flex align-items-center justify-content-center vh-100 w-100'>
        <div className='text-center'>
          <h1 className='display-1 fw-bold'>404</h1>
          <p className='fs-3'>
            {' '}
            <span className='text-danger'>opps!</span> página no encontrada
          </p>
          <p className='lead'>La página que estás buscando no existe.</p>
          <Link to='/login' className='btn btn-primary'>
            Página principal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
