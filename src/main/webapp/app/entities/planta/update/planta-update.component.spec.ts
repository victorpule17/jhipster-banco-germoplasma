import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlantaFormService } from './planta-form.service';
import { PlantaService } from '../service/planta.service';
import { IPlanta } from '../planta.model';
import { IUbicacion } from 'app/entities/ubicacion/ubicacion.model';
import { UbicacionService } from 'app/entities/ubicacion/service/ubicacion.service';

import { PlantaUpdateComponent } from './planta-update.component';

describe('Planta Management Update Component', () => {
  let comp: PlantaUpdateComponent;
  let fixture: ComponentFixture<PlantaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let plantaFormService: PlantaFormService;
  let plantaService: PlantaService;
  let ubicacionService: UbicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlantaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PlantaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlantaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    plantaFormService = TestBed.inject(PlantaFormService);
    plantaService = TestBed.inject(PlantaService);
    ubicacionService = TestBed.inject(UbicacionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ubicacion query and add missing value', () => {
      const planta: IPlanta = { id: 456 };
      const ubicacion: IUbicacion = { id: 65430 };
      planta.ubicacion = ubicacion;

      const ubicacionCollection: IUbicacion[] = [{ id: 75888 }];
      jest.spyOn(ubicacionService, 'query').mockReturnValue(of(new HttpResponse({ body: ubicacionCollection })));
      const additionalUbicacions = [ubicacion];
      const expectedCollection: IUbicacion[] = [...additionalUbicacions, ...ubicacionCollection];
      jest.spyOn(ubicacionService, 'addUbicacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ planta });
      comp.ngOnInit();

      expect(ubicacionService.query).toHaveBeenCalled();
      expect(ubicacionService.addUbicacionToCollectionIfMissing).toHaveBeenCalledWith(
        ubicacionCollection,
        ...additionalUbicacions.map(expect.objectContaining)
      );
      expect(comp.ubicacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const planta: IPlanta = { id: 456 };
      const ubicacion: IUbicacion = { id: 523 };
      planta.ubicacion = ubicacion;

      activatedRoute.data = of({ planta });
      comp.ngOnInit();

      expect(comp.ubicacionsSharedCollection).toContain(ubicacion);
      expect(comp.planta).toEqual(planta);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlanta>>();
      const planta = { id: 123 };
      jest.spyOn(plantaFormService, 'getPlanta').mockReturnValue(planta);
      jest.spyOn(plantaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: planta }));
      saveSubject.complete();

      // THEN
      expect(plantaFormService.getPlanta).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(plantaService.update).toHaveBeenCalledWith(expect.objectContaining(planta));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlanta>>();
      const planta = { id: 123 };
      jest.spyOn(plantaFormService, 'getPlanta').mockReturnValue({ id: null });
      jest.spyOn(plantaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planta: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: planta }));
      saveSubject.complete();

      // THEN
      expect(plantaFormService.getPlanta).toHaveBeenCalled();
      expect(plantaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlanta>>();
      const planta = { id: 123 };
      jest.spyOn(plantaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ planta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(plantaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUbicacion', () => {
      it('Should forward to ubicacionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ubicacionService, 'compareUbicacion');
        comp.compareUbicacion(entity, entity2);
        expect(ubicacionService.compareUbicacion).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
