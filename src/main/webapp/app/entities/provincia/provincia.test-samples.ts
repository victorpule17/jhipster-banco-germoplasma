import { IProvincia, NewProvincia } from './provincia.model';

export const sampleWithRequiredData: IProvincia = {
  id: 78531,
};

export const sampleWithPartialData: IProvincia = {
  id: 15826,
  nombreProvincia: 'vortals Account',
};

export const sampleWithFullData: IProvincia = {
  id: 95461,
  nombreProvincia: 'jerarquía',
};

export const sampleWithNewData: NewProvincia = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
