import React from 'react';

const CargandoModal = () => {
  return (
    <div className='d-flex align-items-center' style={{ height: '50vh' }}>
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

export default CargandoModal;
