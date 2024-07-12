import { ACTIVAR_ALERTA, REMOVER_ALERTA } from '../types';

// eslint-disable-next-line
export default (state: any, action: any) => {
  switch (action.type) {
    case ACTIVAR_ALERTA:
      return [...state, action.payload];

    case REMOVER_ALERTA:
      return state.filter((alerta: any) => alerta.id !== action.payload);
    default:
      return state;
  }
};
