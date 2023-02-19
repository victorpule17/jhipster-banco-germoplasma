import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: 27363,
};

export const sampleWithPartialData: IRegion = {
  id: 78962,
  regionName: 'Coche',
};

export const sampleWithFullData: IRegion = {
  id: 18782,
  regionName: 'Algodón 1080p',
};

export const sampleWithNewData: NewRegion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
