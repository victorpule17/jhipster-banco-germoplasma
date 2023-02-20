import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CantonFormService, CantonFormGroup } from './canton-form.service';
import { ICanton } from '../canton.model';
import { CantonService } from '../service/canton.service';
import { IProvincia } from 'app/entities/provincia/provincia.model';
import { ProvinciaService } from 'app/entities/provincia/service/provincia.service';

@Component({
  selector: 'jhi-canton-update',
  templateUrl: './canton-update.component.html',
})
export class CantonUpdateComponent implements OnInit {
  isSaving = false;
  canton: ICanton | null = null;

  provinciasSharedCollection: IProvincia[] = [];

  editForm: CantonFormGroup = this.cantonFormService.createCantonFormGroup();

  constructor(
    protected cantonService: CantonService,
    protected cantonFormService: CantonFormService,
    protected provinciaService: ProvinciaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProvincia = (o1: IProvincia | null, o2: IProvincia | null): boolean => this.provinciaService.compareProvincia(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ canton }) => {
      this.canton = canton;
      if (canton) {
        this.updateForm(canton);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const canton = this.cantonFormService.getCanton(this.editForm);
    if (canton.id !== null) {
      this.subscribeToSaveResponse(this.cantonService.update(canton));
    } else {
      this.subscribeToSaveResponse(this.cantonService.create(canton));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICanton>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(canton: ICanton): void {
    this.canton = canton;
    this.cantonFormService.resetForm(this.editForm, canton);

    this.provinciasSharedCollection = this.provinciaService.addProvinciaToCollectionIfMissing<IProvincia>(
      this.provinciasSharedCollection,
      canton.provincia
    );
  }

  protected loadRelationshipsOptions(): void {
    this.provinciaService
      .query()
      .pipe(map((res: HttpResponse<IProvincia[]>) => res.body ?? []))
      .pipe(
        map((provincias: IProvincia[]) =>
          this.provinciaService.addProvinciaToCollectionIfMissing<IProvincia>(provincias, this.canton?.provincia)
        )
      )
      .subscribe((provincias: IProvincia[]) => (this.provinciasSharedCollection = provincias));
  }
}
