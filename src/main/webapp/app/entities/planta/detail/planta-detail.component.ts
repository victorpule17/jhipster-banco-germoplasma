import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlanta } from '../planta.model';

@Component({
  selector: 'jhi-planta-detail',
  templateUrl: './planta-detail.component.html',
})
export class PlantaDetailComponent implements OnInit {
  planta: IPlanta | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ planta }) => {
      this.planta = planta;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
