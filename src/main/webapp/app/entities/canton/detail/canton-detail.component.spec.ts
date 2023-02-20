import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CantonDetailComponent } from './canton-detail.component';

describe('Canton Management Detail Component', () => {
  let comp: CantonDetailComponent;
  let fixture: ComponentFixture<CantonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CantonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ canton: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CantonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CantonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load canton on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.canton).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
