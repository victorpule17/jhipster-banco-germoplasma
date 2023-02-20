import { IUbicacion, NewUbicacion } from './ubicacion.model';

export const sampleWithRequiredData: IUbicacion = {
  id: 82458,
};

export const sampleWithPartialData: IUbicacion = {
  id: 19752,
  altitud: 'Canarias engineer',
};

export const sampleWithFullData: IUbicacion = {
  id: 52717,
  callePrincipal: 'Aldea',
  calleSecundaria: 'port Loan innovative',
  latitud: 'up',
  altitud: 'Navarra',
  longitud: 'Buckinghamshire Morado auxiliary',
};

export const sampleWithNewData: NewUbicacion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
