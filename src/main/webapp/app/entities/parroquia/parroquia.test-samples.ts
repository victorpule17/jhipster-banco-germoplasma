import { IParroquia, NewParroquia } from './parroquia.model';

export const sampleWithRequiredData: IParroquia = {
  id: 52724,
};

export const sampleWithPartialData: IParroquia = {
  id: 12953,
};

export const sampleWithFullData: IParroquia = {
  id: 63838,
  nombreParroquia: 'Account program',
};

export const sampleWithNewData: NewParroquia = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
