import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICanton } from '../canton.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../canton.test-samples';

import { CantonService } from './canton.service';

const requireRestSample: ICanton = {
  ...sampleWithRequiredData,
};

describe('Canton Service', () => {
  let service: CantonService;
  let httpMock: HttpTestingController;
  let expectedResult: ICanton | ICanton[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CantonService);
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

    it('should create a Canton', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const canton = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(canton).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Canton', () => {
      const canton = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(canton).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Canton', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Canton', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Canton', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCantonToCollectionIfMissing', () => {
      it('should add a Canton to an empty array', () => {
        const canton: ICanton = sampleWithRequiredData;
        expectedResult = service.addCantonToCollectionIfMissing([], canton);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(canton);
      });

      it('should not add a Canton to an array that contains it', () => {
        const canton: ICanton = sampleWithRequiredData;
        const cantonCollection: ICanton[] = [
          {
            ...canton,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCantonToCollectionIfMissing(cantonCollection, canton);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Canton to an array that doesn't contain it", () => {
        const canton: ICanton = sampleWithRequiredData;
        const cantonCollection: ICanton[] = [sampleWithPartialData];
        expectedResult = service.addCantonToCollectionIfMissing(cantonCollection, canton);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(canton);
      });

      it('should add only unique Canton to an array', () => {
        const cantonArray: ICanton[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cantonCollection: ICanton[] = [sampleWithRequiredData];
        expectedResult = service.addCantonToCollectionIfMissing(cantonCollection, ...cantonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const canton: ICanton = sampleWithRequiredData;
        const canton2: ICanton = sampleWithPartialData;
        expectedResult = service.addCantonToCollectionIfMissing([], canton, canton2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(canton);
        expect(expectedResult).toContain(canton2);
      });

      it('should accept null and undefined values', () => {
        const canton: ICanton = sampleWithRequiredData;
        expectedResult = service.addCantonToCollectionIfMissing([], null, canton, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(canton);
      });

      it('should return initial array if no Canton is added', () => {
        const cantonCollection: ICanton[] = [sampleWithRequiredData];
        expectedResult = service.addCantonToCollectionIfMissing(cantonCollection, undefined, null);
        expect(expectedResult).toEqual(cantonCollection);
      });
    });

    describe('compareCanton', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCanton(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCanton(entity1, entity2);
        const compareResult2 = service.compareCanton(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCanton(entity1, entity2);
        const compareResult2 = service.compareCanton(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCanton(entity1, entity2);
        const compareResult2 = service.compareCanton(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
