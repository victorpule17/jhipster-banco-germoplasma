import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UbicacionFormService } from './ubicacion-form.service';
import { UbicacionService } from '../service/ubicacion.service';
import { IUbicacion } from '../ubicacion.model';
import { IParroquia } from 'app/entities/parroquia/parroquia.model';
import { ParroquiaService } from 'app/entities/parroquia/service/parroquia.service';

import { UbicacionUpdateComponent } from './ubicacion-update.component';

describe('Ubicacion Management Update Component', () => {
  let comp: UbicacionUpdateComponent;
  let fixture: ComponentFixture<UbicacionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ubicacionFormService: UbicacionFormService;
  let ubicacionService: UbicacionService;
  let parroquiaService: ParroquiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UbicacionUpdateComponent],
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
      .overrideTemplate(UbicacionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UbicacionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ubicacionFormService = TestBed.inject(UbicacionFormService);
    ubicacionService = TestBed.inject(UbicacionService);
    parroquiaService = TestBed.inject(ParroquiaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Parroquia query and add missing value', () => {
      const ubicacion: IUbicacion = { id: 456 };
      const parroquia: IParroquia = { id: 49035 };
      ubicacion.parroquia = parroquia;

      const parroquiaCollection: IParroquia[] = [{ id: 43601 }];
      jest.spyOn(parroquiaService, 'query').mockReturnValue(of(new HttpResponse({ body: parroquiaCollection })));
      const additionalParroquias = [parroquia];
      const expectedCollection: IParroquia[] = [...additionalParroquias, ...parroquiaCollection];
      jest.spyOn(parroquiaService, 'addParroquiaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ubicacion });
      comp.ngOnInit();

      expect(parroquiaService.query).toHaveBeenCalled();
      expect(parroquiaService.addParroquiaToCollectionIfMissing).toHaveBeenCalledWith(
        parroquiaCollection,
        ...additionalParroquias.map(expect.objectContaining)
      );
      expect(comp.parroquiasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ubicacion: IUbicacion = { id: 456 };
      const parroquia: IParroquia = { id: 89197 };
      ubicacion.parroquia = parroquia;

      activatedRoute.data = of({ ubicacion });
      comp.ngOnInit();

      expect(comp.parroquiasSharedCollection).toContain(parroquia);
      expect(comp.ubicacion).toEqual(ubicacion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUbicacion>>();
      const ubicacion = { id: 123 };
      jest.spyOn(ubicacionFormService, 'getUbicacion').mockReturnValue(ubicacion);
      jest.spyOn(ubicacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ubicacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ubicacion }));
      saveSubject.complete();

      // THEN
      expect(ubicacionFormService.getUbicacion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ubicacionService.update).toHaveBeenCalledWith(expect.objectContaining(ubicacion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUbicacion>>();
      const ubicacion = { id: 123 };
      jest.spyOn(ubicacionFormService, 'getUbicacion').mockReturnValue({ id: null });
      jest.spyOn(ubicacionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ubicacion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ubicacion }));
      saveSubject.complete();

      // THEN
      expect(ubicacionFormService.getUbicacion).toHaveBeenCalled();
      expect(ubicacionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUbicacion>>();
      const ubicacion = { id: 123 };
      jest.spyOn(ubicacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ubicacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ubicacionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareParroquia', () => {
      it('Should forward to parroquiaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(parroquiaService, 'compareParroquia');
        comp.compareParroquia(entity, entity2);
        expect(parroquiaService.compareParroquia).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
