import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParroquiaDetailComponent } from './parroquia-detail.component';

describe('Parroquia Management Detail Component', () => {
  let comp: ParroquiaDetailComponent;
  let fixture: ComponentFixture<ParroquiaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParroquiaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parroquia: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParroquiaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParroquiaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parroquia on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parroquia).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
