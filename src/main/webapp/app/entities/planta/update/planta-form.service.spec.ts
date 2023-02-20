import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../planta.test-samples';

import { PlantaFormService } from './planta-form.service';

describe('Planta Form Service', () => {
  let service: PlantaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantaFormService);
  });

  describe('Service methods', () => {
    describe('createPlantaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlantaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            estado: expect.any(Object),
            uso: expect.any(Object),
            ubicacion: expect.any(Object),
          })
        );
      });

      it('passing IPlanta should create a new form with FormGroup', () => {
        const formGroup = service.createPlantaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            estado: expect.any(Object),
            uso: expect.any(Object),
            ubicacion: expect.any(Object),
          })
        );
      });
    });

    describe('getPlanta', () => {
      it('should return NewPlanta for default Planta initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPlantaFormGroup(sampleWithNewData);

        const planta = service.getPlanta(formGroup) as any;

        expect(planta).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlanta for empty Planta initial value', () => {
        const formGroup = service.createPlantaFormGroup();

        const planta = service.getPlanta(formGroup) as any;

        expect(planta).toMatchObject({});
      });

      it('should return IPlanta', () => {
        const formGroup = service.createPlantaFormGroup(sampleWithRequiredData);

        const planta = service.getPlanta(formGroup) as any;

        expect(planta).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlanta should not enable id FormControl', () => {
        const formGroup = service.createPlantaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlanta should disable id FormControl', () => {
        const formGroup = service.createPlantaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
