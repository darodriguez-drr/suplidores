import React, { useReducer } from 'react';
import AlertaContext from './alertaContext';
import alertaReducer from './alertaReducer';
import * as uuid from 'uuid';
import { ACTIVAR_ALERTA, REMOVER_ALERTA } from '../types';

const AlertState = (props: any) => {
  const initialState: any = [];

  const [state, dispath] = useReducer(alertaReducer, initialState);

  // Set alert
  const activarAlerta = (msg: string, type: any, timeout = 5000) => {
    const id = uuid.v4();
    dispath({
      type: ACTIVAR_ALERTA,
      payload: { msg, type, id },
    });

    setTimeout(() => {
      dispath({ type: REMOVER_ALERTA, payload: id });
    }, timeout);
  };

  return (
    <AlertaContext.Provider
      value={{
        alertas: state,
        activarAlerta,
      }}>
      {props.children}
    </AlertaContext.Provider>
  );
};

export default AlertState;
