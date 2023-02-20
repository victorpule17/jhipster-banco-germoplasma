import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParroquia } from '../parroquia.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../parroquia.test-samples';

import { ParroquiaService } from './parroquia.service';

const requireRestSample: IParroquia = {
  ...sampleWithRequiredData,
};

describe('Parroquia Service', () => {
  let service: ParroquiaService;
  let httpMock: HttpTestingController;
  let expectedResult: IParroquia | IParroquia[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParroquiaService);
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

    it('should create a Parroquia', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const parroquia = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(parroquia).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Parroquia', () => {
      const parroquia = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(parroquia).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Parroquia', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Parroquia', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Parroquia', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addParroquiaToCollectionIfMissing', () => {
      it('should add a Parroquia to an empty array', () => {
        const parroquia: IParroquia = sampleWithRequiredData;
        expectedResult = service.addParroquiaToCollectionIfMissing([], parroquia);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parroquia);
      });

      it('should not add a Parroquia to an array that contains it', () => {
        const parroquia: IParroquia = sampleWithRequiredData;
        const parroquiaCollection: IParroquia[] = [
          {
            ...parroquia,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addParroquiaToCollectionIfMissing(parroquiaCollection, parroquia);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Parroquia to an array that doesn't contain it", () => {
        const parroquia: IParroquia = sampleWithRequiredData;
        const parroquiaCollection: IParroquia[] = [sampleWithPartialData];
        expectedResult = service.addParroquiaToCollectionIfMissing(parroquiaCollection, parroquia);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parroquia);
      });

      it('should add only unique Parroquia to an array', () => {
        const parroquiaArray: IParroquia[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const parroquiaCollection: IParroquia[] = [sampleWithRequiredData];
        expectedResult = service.addParroquiaToCollectionIfMissing(parroquiaCollection, ...parroquiaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parroquia: IParroquia = sampleWithRequiredData;
        const parroquia2: IParroquia = sampleWithPartialData;
        expectedResult = service.addParroquiaToCollectionIfMissing([], parroquia, parroquia2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parroquia);
        expect(expectedResult).toContain(parroquia2);
      });

      it('should accept null and undefined values', () => {
        const parroquia: IParroquia = sampleWithRequiredData;
        expectedResult = service.addParroquiaToCollectionIfMissing([], null, parroquia, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parroquia);
      });

      it('should return initial array if no Parroquia is added', () => {
        const parroquiaCollection: IParroquia[] = [sampleWithRequiredData];
        expectedResult = service.addParroquiaToCollectionIfMissing(parroquiaCollection, undefined, null);
        expect(expectedResult).toEqual(parroquiaCollection);
      });
    });

    describe('compareParroquia', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareParroquia(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareParroquia(entity1, entity2);
        const compareResult2 = service.compareParroquia(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareParroquia(entity1, entity2);
        const compareResult2 = service.compareParroquia(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareParroquia(entity1, entity2);
        const compareResult2 = service.compareParroquia(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
