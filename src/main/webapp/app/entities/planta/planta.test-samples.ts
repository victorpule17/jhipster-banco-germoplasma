import { IPlanta, NewPlanta } from './planta.model';

export const sampleWithRequiredData: IPlanta = {
  id: 48719,
};

export const sampleWithPartialData: IPlanta = {
  id: 92093,
  nombre: 'Borders Account',
};

export const sampleWithFullData: IPlanta = {
  id: 53207,
  nombre: 'Seguro optimize',
  estado: 'Cambridgeshire Pollo',
  uso: 'Gerente Canadian',
};

export const sampleWithNewData: NewPlanta = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
