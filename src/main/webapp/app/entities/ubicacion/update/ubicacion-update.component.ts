import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UbicacionFormService, UbicacionFormGroup } from './ubicacion-form.service';
import { IUbicacion } from '../ubicacion.model';
import { UbicacionService } from '../service/ubicacion.service';
import { IParroquia } from 'app/entities/parroquia/parroquia.model';
import { ParroquiaService } from 'app/entities/parroquia/service/parroquia.service';

@Component({
  selector: 'jhi-ubicacion-update',
  templateUrl: './ubicacion-update.component.html',
})
export class UbicacionUpdateComponent implements OnInit {
  isSaving = false;
  ubicacion: IUbicacion | null = null;

  parroquiasSharedCollection: IParroquia[] = [];

  editForm: UbicacionFormGroup = this.ubicacionFormService.createUbicacionFormGroup();

  constructor(
    protected ubicacionService: UbicacionService,
    protected ubicacionFormService: UbicacionFormService,
    protected parroquiaService: ParroquiaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParroquia = (o1: IParroquia | null, o2: IParroquia | null): boolean => this.parroquiaService.compareParroquia(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ubicacion }) => {
      this.ubicacion = ubicacion;
      if (ubicacion) {
        this.updateForm(ubicacion);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ubicacion = this.ubicacionFormService.getUbicacion(this.editForm);
    if (ubicacion.id !== null) {
      this.subscribeToSaveResponse(this.ubicacionService.update(ubicacion));
    } else {
      this.subscribeToSaveResponse(this.ubicacionService.create(ubicacion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUbicacion>>): void {
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

  protected updateForm(ubicacion: IUbicacion): void {
    this.ubicacion = ubicacion;
    this.ubicacionFormService.resetForm(this.editForm, ubicacion);

    this.parroquiasSharedCollection = this.parroquiaService.addParroquiaToCollectionIfMissing<IParroquia>(
      this.parroquiasSharedCollection,
      ubicacion.parroquia
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parroquiaService
      .query()
      .pipe(map((res: HttpResponse<IParroquia[]>) => res.body ?? []))
      .pipe(
        map((parroquias: IParroquia[]) =>
          this.parroquiaService.addParroquiaToCollectionIfMissing<IParroquia>(parroquias, this.ubicacion?.parroquia)
        )
      )
      .subscribe((parroquias: IParroquia[]) => (this.parroquiasSharedCollection = parroquias));
  }
}
