import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ParroquiaFormService, ParroquiaFormGroup } from './parroquia-form.service';
import { IParroquia } from '../parroquia.model';
import { ParroquiaService } from '../service/parroquia.service';
import { ICanton } from 'app/entities/canton/canton.model';
import { CantonService } from 'app/entities/canton/service/canton.service';

@Component({
  selector: 'jhi-parroquia-update',
  templateUrl: './parroquia-update.component.html',
})
export class ParroquiaUpdateComponent implements OnInit {
  isSaving = false;
  parroquia: IParroquia | null = null;

  cantonsSharedCollection: ICanton[] = [];

  editForm: ParroquiaFormGroup = this.parroquiaFormService.createParroquiaFormGroup();

  constructor(
    protected parroquiaService: ParroquiaService,
    protected parroquiaFormService: ParroquiaFormService,
    protected cantonService: CantonService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCanton = (o1: ICanton | null, o2: ICanton | null): boolean => this.cantonService.compareCanton(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parroquia }) => {
      this.parroquia = parroquia;
      if (parroquia) {
        this.updateForm(parroquia);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parroquia = this.parroquiaFormService.getParroquia(this.editForm);
    if (parroquia.id !== null) {
      this.subscribeToSaveResponse(this.parroquiaService.update(parroquia));
    } else {
      this.subscribeToSaveResponse(this.parroquiaService.create(parroquia));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParroquia>>): void {
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

  protected updateForm(parroquia: IParroquia): void {
    this.parroquia = parroquia;
    this.parroquiaFormService.resetForm(this.editForm, parroquia);

    this.cantonsSharedCollection = this.cantonService.addCantonToCollectionIfMissing<ICanton>(
      this.cantonsSharedCollection,
      parroquia.canton
    );
  }

  protected loadRelationshipsOptions(): void {
    this.cantonService
      .query()
      .pipe(map((res: HttpResponse<ICanton[]>) => res.body ?? []))
      .pipe(map((cantons: ICanton[]) => this.cantonService.addCantonToCollectionIfMissing<ICanton>(cantons, this.parroquia?.canton)))
      .subscribe((cantons: ICanton[]) => (this.cantonsSharedCollection = cantons));
  }
}
