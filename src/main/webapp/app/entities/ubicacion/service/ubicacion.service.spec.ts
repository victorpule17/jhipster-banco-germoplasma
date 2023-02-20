import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUbicacion } from '../ubicacion.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ubicacion.test-samples';

import { UbicacionService } from './ubicacion.service';

const requireRestSample: IUbicacion = {
  ...sampleWithRequiredData,
};

describe('Ubicacion Service', () => {
  let service: UbicacionService;
  let httpMock: HttpTestingController;
  let expectedResult: IUbicacion | IUbicacion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UbicacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Ubicacion', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ubicacion = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ubicacion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ubicacion', () => {
      const ubicacion = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ubicacion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ubicacion', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ubicacion', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Ubicacion', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUbicacionToCollectionIfMissing', () => {
      it('should add a Ubicacion to an empty array', () => {
        const ubicacion: IUbicacion = sampleWithRequiredData;
        expectedResult = service.addUbicacionToCollectionIfMissing([], ubicacion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ubicacion);
      });

      it('should not add a Ubicacion to an array that contains it', () => {
        const ubicacion: IUbicacion = sampleWithRequiredData;
        const ubicacionCollection: IUbicacion[] = [
          {
            ...ubicacion,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUbicacionToCollectionIfMissing(ubicacionCollection, ubicacion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ubicacion to an array that doesn't contain it", () => {
        const ubicacion: IUbicacion = sampleWithRequiredData;
        const ubicacionCollection: IUbicacion[] = [sampleWithPartialData];
        expectedResult = service.addUbicacionToCollectionIfMissing(ubicacionCollection, ubicacion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ubicacion);
      });

      it('should add only unique Ubicacion to an array', () => {
        const ubicacionArray: IUbicacion[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ubicacionCollection: IUbicacion[] = [sampleWithRequiredData];
        expectedResult = service.addUbicacionToCollectionIfMissing(ubicacionCollection, ...ubicacionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ubicacion: IUbicacion = sampleWithRequiredData;
        const ubicacion2: IUbicacion = sampleWithPartialData;
        expectedResult = service.addUbicacionToCollectionIfMissing([], ubicacion, ubicacion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ubicacion);
        expect(expectedResult).toContain(ubicacion2);
      });

      it('should accept null and undefined values', () => {
        const ubicacion: IUbicacion = sampleWithRequiredData;
        expectedResult = service.addUbicacionToCollectionIfMissing([], null, ubicacion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ubicacion);
      });

      it('should return initial array if no Ubicacion is added', () => {
        const ubicacionCollection: IUbicacion[] = [sampleWithRequiredData];
        expectedResult = service.addUbicacionToCollectionIfMissing(ubicacionCollection, undefined, null);
        expect(expectedResult).toEqual(ubicacionCollection);
      });
    });

    describe('compareUbicacion', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUbicacion(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUbicacion(entity1, entity2);
        const compareResult2 = service.compareUbicacion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUbicacion(entity1, entity2);
        const compareResult2 = service.compareUbicacion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUbicacion(entity1, entity2);
        const compareResult2 = service.compareUbicacion(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
