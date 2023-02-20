import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParroquia } from '../parroquia.model';

@Component({
  selector: 'jhi-parroquia-detail',
  templateUrl: './parroquia-detail.component.html',
})
export class ParroquiaDetailComponent implements OnInit {
  parroquia: IParroquia | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parroquia }) => {
      this.parroquia = parroquia;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
