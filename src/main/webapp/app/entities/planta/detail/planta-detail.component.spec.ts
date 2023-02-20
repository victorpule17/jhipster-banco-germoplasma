import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PlantaDetailComponent } from './planta-detail.component';

describe('Planta Management Detail Component', () => {
  let comp: PlantaDetailComponent;
  let fixture: ComponentFixture<PlantaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlantaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ planta: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PlantaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PlantaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load planta on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.planta).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
