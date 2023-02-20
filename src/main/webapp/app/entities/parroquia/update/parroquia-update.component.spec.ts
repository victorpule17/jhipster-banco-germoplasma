import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParroquiaFormService } from './parroquia-form.service';
import { ParroquiaService } from '../service/parroquia.service';
import { IParroquia } from '../parroquia.model';
import { ICanton } from 'app/entities/canton/canton.model';
import { CantonService } from 'app/entities/canton/service/canton.service';

import { ParroquiaUpdateComponent } from './parroquia-update.component';

describe('Parroquia Management Update Component', () => {
  let comp: ParroquiaUpdateComponent;
  let fixture: ComponentFixture<ParroquiaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parroquiaFormService: ParroquiaFormService;
  let parroquiaService: ParroquiaService;
  let cantonService: CantonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParroquiaUpdateComponent],
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
      .overrideTemplate(ParroquiaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParroquiaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parroquiaFormService = TestBed.inject(ParroquiaFormService);
    parroquiaService = TestBed.inject(ParroquiaService);
    cantonService = TestBed.inject(CantonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Canton query and add missing value', () => {
      const parroquia: IParroquia = { id: 456 };
      const canton: ICanton = { id: 95796 };
      parroquia.canton = canton;

      const cantonCollection: ICanton[] = [{ id: 79333 }];
      jest.spyOn(cantonService, 'query').mockReturnValue(of(new HttpResponse({ body: cantonCollection })));
      const additionalCantons = [canton];
      const expectedCollection: ICanton[] = [...additionalCantons, ...cantonCollection];
      jest.spyOn(cantonService, 'addCantonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parroquia });
      comp.ngOnInit();

      expect(cantonService.query).toHaveBeenCalled();
      expect(cantonService.addCantonToCollectionIfMissing).toHaveBeenCalledWith(
        cantonCollection,
        ...additionalCantons.map(expect.objectContaining)
      );
      expect(comp.cantonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parroquia: IParroquia = { id: 456 };
      const canton: ICanton = { id: 31191 };
      parroquia.canton = canton;

      activatedRoute.data = of({ parroquia });
      comp.ngOnInit();

      expect(comp.cantonsSharedCollection).toContain(canton);
      expect(comp.parroquia).toEqual(parroquia);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParroquia>>();
      const parroquia = { id: 123 };
      jest.spyOn(parroquiaFormService, 'getParroquia').mockReturnValue(parroquia);
      jest.spyOn(parroquiaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parroquia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parroquia }));
      saveSubject.complete();

      // THEN
      expect(parroquiaFormService.getParroquia).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(parroquiaService.update).toHaveBeenCalledWith(expect.objectContaining(parroquia));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParroquia>>();
      const parroquia = { id: 123 };
      jest.spyOn(parroquiaFormService, 'getParroquia').mockReturnValue({ id: null });
      jest.spyOn(parroquiaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parroquia: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parroquia }));
      saveSubject.complete();

      // THEN
      expect(parroquiaFormService.getParroquia).toHaveBeenCalled();
      expect(parroquiaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IParroquia>>();
      const parroquia = { id: 123 };
      jest.spyOn(parroquiaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parroquia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parroquiaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCanton', () => {
      it('Should forward to cantonService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cantonService, 'compareCanton');
        comp.compareCanton(entity, entity2);
        expect(cantonService.compareCanton).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
