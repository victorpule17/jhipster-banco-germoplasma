import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CantonFormService } from './canton-form.service';
import { CantonService } from '../service/canton.service';
import { ICanton } from '../canton.model';
import { IProvincia } from 'app/entities/provincia/provincia.model';
import { ProvinciaService } from 'app/entities/provincia/service/provincia.service';

import { CantonUpdateComponent } from './canton-update.component';

describe('Canton Management Update Component', () => {
  let comp: CantonUpdateComponent;
  let fixture: ComponentFixture<CantonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cantonFormService: CantonFormService;
  let cantonService: CantonService;
  let provinciaService: ProvinciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CantonUpdateComponent],
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
      .overrideTemplate(CantonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CantonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cantonFormService = TestBed.inject(CantonFormService);
    cantonService = TestBed.inject(CantonService);
    provinciaService = TestBed.inject(ProvinciaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Provincia query and add missing value', () => {
      const canton: ICanton = { id: 456 };
      const provincia: IProvincia = { id: 98425 };
      canton.provincia = provincia;

      const provinciaCollection: IProvincia[] = [{ id: 71169 }];
      jest.spyOn(provinciaService, 'query').mockReturnValue(of(new HttpResponse({ body: provinciaCollection })));
      const additionalProvincias = [provincia];
      const expectedCollection: IProvincia[] = [...additionalProvincias, ...provinciaCollection];
      jest.spyOn(provinciaService, 'addProvinciaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ canton });
      comp.ngOnInit();

      expect(provinciaService.query).toHaveBeenCalled();
      expect(provinciaService.addProvinciaToCollectionIfMissing).toHaveBeenCalledWith(
        provinciaCollection,
        ...additionalProvincias.map(expect.objectContaining)
      );
      expect(comp.provinciasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const canton: ICanton = { id: 456 };
      const provincia: IProvincia = { id: 23351 };
      canton.provincia = provincia;

      activatedRoute.data = of({ canton });
      comp.ngOnInit();

      expect(comp.provinciasSharedCollection).toContain(provincia);
      expect(comp.canton).toEqual(canton);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICanton>>();
      const canton = { id: 123 };
      jest.spyOn(cantonFormService, 'getCanton').mockReturnValue(canton);
      jest.spyOn(cantonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ canton });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: canton }));
      saveSubject.complete();

      // THEN
      expect(cantonFormService.getCanton).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cantonService.update).toHaveBeenCalledWith(expect.objectContaining(canton));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICanton>>();
      const canton = { id: 123 };
      jest.spyOn(cantonFormService, 'getCanton').mockReturnValue({ id: null });
      jest.spyOn(cantonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ canton: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: canton }));
      saveSubject.complete();

      // THEN
      expect(cantonFormService.getCanton).toHaveBeenCalled();
      expect(cantonService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICanton>>();
      const canton = { id: 123 };
      jest.spyOn(cantonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ canton });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cantonService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProvincia', () => {
      it('Should forward to provinciaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(provinciaService, 'compareProvincia');
        comp.compareProvincia(entity, entity2);
        expect(provinciaService.compareProvincia).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
