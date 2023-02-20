import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../parroquia.test-samples';

import { ParroquiaFormService } from './parroquia-form.service';

describe('Parroquia Form Service', () => {
  let service: ParroquiaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParroquiaFormService);
  });

  describe('Service methods', () => {
    describe('createParroquiaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createParroquiaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombreParroquia: expect.any(Object),
            canton: expect.any(Object),
          })
        );
      });

      it('passing IParroquia should create a new form with FormGroup', () => {
        const formGroup = service.createParroquiaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombreParroquia: expect.any(Object),
            canton: expect.any(Object),
          })
        );
      });
    });

    describe('getParroquia', () => {
      it('should return NewParroquia for default Parroquia initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createParroquiaFormGroup(sampleWithNewData);

        const parroquia = service.getParroquia(formGroup) as any;

        expect(parroquia).toMatchObject(sampleWithNewData);
      });

      it('should return NewParroquia for empty Parroquia initial value', () => {
        const formGroup = service.createParroquiaFormGroup();

        const parroquia = service.getParroquia(formGroup) as any;

        expect(parroquia).toMatchObject({});
      });

      it('should return IParroquia', () => {
        const formGroup = service.createParroquiaFormGroup(sampleWithRequiredData);

        const parroquia = service.getParroquia(formGroup) as any;

        expect(parroquia).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IParroquia should not enable id FormControl', () => {
        const formGroup = service.createParroquiaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewParroquia should disable id FormControl', () => {
        const formGroup = service.createParroquiaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
