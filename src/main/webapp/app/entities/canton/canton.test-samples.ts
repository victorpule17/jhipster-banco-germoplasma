import { ICanton, NewCanton } from './canton.model';

export const sampleWithRequiredData: ICanton = {
  id: 15069,
};

export const sampleWithPartialData: ICanton = {
  id: 21454,
  nombreCanton: 'hacking cross-platform',
};

export const sampleWithFullData: ICanton = {
  id: 83345,
  nombreCanton: 'Violeta compress',
};

export const sampleWithNewData: NewCanton = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
