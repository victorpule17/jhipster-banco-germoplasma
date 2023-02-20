import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ubicacion.test-samples';

import { UbicacionFormService } from './ubicacion-form.service';

describe('Ubicacion Form Service', () => {
  let service: UbicacionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbicacionFormService);
  });

  describe('Service methods', () => {
    describe('createUbicacionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUbicacionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            callePrincipal: expect.any(Object),
            calleSecundaria: expect.any(Object),
            latitud: expect.any(Object),
            altitud: expect.any(Object),
            longitud: expect.any(Object),
            parroquia: expect.any(Object),
          })
        );
      });

      it('passing IUbicacion should create a new form with FormGroup', () => {
        const formGroup = service.createUbicacionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            callePrincipal: expect.any(Object),
            calleSecundaria: expect.any(Object),
            latitud: expect.any(Object),
            altitud: expect.any(Object),
            longitud: expect.any(Object),
            parroquia: expect.any(Object),
          })
        );
      });
    });

    describe('getUbicacion', () => {
      it('should return NewUbicacion for default Ubicacion initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUbicacionFormGroup(sampleWithNewData);

        const ubicacion = service.getUbicacion(formGroup) as any;

        expect(ubicacion).toMatchObject(sampleWithNewData);
      });

      it('should return NewUbicacion for empty Ubicacion initial value', () => {
        const formGroup = service.createUbicacionFormGroup();

        const ubicacion = service.getUbicacion(formGroup) as any;

        expect(ubicacion).toMatchObject({});
      });

      it('should return IUbicacion', () => {
        const formGroup = service.createUbicacionFormGroup(sampleWithRequiredData);

        const ubicacion = service.getUbicacion(formGroup) as any;

        expect(ubicacion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUbicacion should not enable id FormControl', () => {
        const formGroup = service.createUbicacionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUbicacion should disable id FormControl', () => {
        const formGroup = service.createUbicacionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
