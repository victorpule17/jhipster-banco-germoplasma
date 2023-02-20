import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlanta } from '../planta.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../planta.test-samples';

import { PlantaService } from './planta.service';

const requireRestSample: IPlanta = {
  ...sampleWithRequiredData,
};

describe('Planta Service', () => {
  let service: PlantaService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlanta | IPlanta[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlantaService);
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

    it('should create a Planta', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const planta = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(planta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Planta', () => {
      const planta = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(planta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Planta', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Planta', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Planta', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlantaToCollectionIfMissing', () => {
      it('should add a Planta to an empty array', () => {
        const planta: IPlanta = sampleWithRequiredData;
        expectedResult = service.addPlantaToCollectionIfMissing([], planta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(planta);
      });

      it('should not add a Planta to an array that contains it', () => {
        const planta: IPlanta = sampleWithRequiredData;
        const plantaCollection: IPlanta[] = [
          {
            ...planta,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlantaToCollectionIfMissing(plantaCollection, planta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Planta to an array that doesn't contain it", () => {
        const planta: IPlanta = sampleWithRequiredData;
        const plantaCollection: IPlanta[] = [sampleWithPartialData];
        expectedResult = service.addPlantaToCollectionIfMissing(plantaCollection, planta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(planta);
      });

      it('should add only unique Planta to an array', () => {
        const plantaArray: IPlanta[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const plantaCollection: IPlanta[] = [sampleWithRequiredData];
        expectedResult = service.addPlantaToCollectionIfMissing(plantaCollection, ...plantaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const planta: IPlanta = sampleWithRequiredData;
        const planta2: IPlanta = sampleWithPartialData;
        expectedResult = service.addPlantaToCollectionIfMissing([], planta, planta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(planta);
        expect(expectedResult).toContain(planta2);
      });

      it('should accept null and undefined values', () => {
        const planta: IPlanta = sampleWithRequiredData;
        expectedResult = service.addPlantaToCollectionIfMissing([], null, planta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(planta);
      });

      it('should return initial array if no Planta is added', () => {
        const plantaCollection: IPlanta[] = [sampleWithRequiredData];
        expectedResult = service.addPlantaToCollectionIfMissing(plantaCollection, undefined, null);
        expect(expectedResult).toEqual(plantaCollection);
      });
    });

    describe('comparePlanta', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlanta(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlanta(entity1, entity2);
        const compareResult2 = service.comparePlanta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlanta(entity1, entity2);
        const compareResult2 = service.comparePlanta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlanta(entity1, entity2);
        const compareResult2 = service.comparePlanta(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
