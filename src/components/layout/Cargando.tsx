import React from 'react';

/* Para mostrar un gif de cargando */
const Cargando = () => {
  return (
    <div className='vh-100 d-flex align-items-center'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-sm-12 col-md-12 col-xl-12'>
            <div className='text-center d-flex justify-content-center'>
              <div className='d-flex justify-content-center'>
                <div
                  className='spinner-border'
                  style={{ width: '6rem', height: '6rem' }}
                  role='status'
                >
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cargando;
