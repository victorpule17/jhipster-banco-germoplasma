import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../canton.test-samples';

import { CantonFormService } from './canton-form.service';

describe('Canton Form Service', () => {
  let service: CantonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CantonFormService);
  });

  describe('Service methods', () => {
    describe('createCantonFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCantonFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombreCanton: expect.any(Object),
            provincia: expect.any(Object),
          })
        );
      });

      it('passing ICanton should create a new form with FormGroup', () => {
        const formGroup = service.createCantonFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombreCanton: expect.any(Object),
            provincia: expect.any(Object),
          })
        );
      });
    });

    describe('getCanton', () => {
      it('should return NewCanton for default Canton initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCantonFormGroup(sampleWithNewData);

        const canton = service.getCanton(formGroup) as any;

        expect(canton).toMatchObject(sampleWithNewData);
      });

      it('should return NewCanton for empty Canton initial value', () => {
        const formGroup = service.createCantonFormGroup();

        const canton = service.getCanton(formGroup) as any;

        expect(canton).toMatchObject({});
      });

      it('should return ICanton', () => {
        const formGroup = service.createCantonFormGroup(sampleWithRequiredData);

        const canton = service.getCanton(formGroup) as any;

        expect(canton).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICanton should not enable id FormControl', () => {
        const formGroup = service.createCantonFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCanton should disable id FormControl', () => {
        const formGroup = service.createCantonFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
