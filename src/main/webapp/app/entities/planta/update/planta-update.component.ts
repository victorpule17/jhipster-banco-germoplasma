import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PlantaFormService, PlantaFormGroup } from './planta-form.service';
import { IPlanta } from '../planta.model';
import { PlantaService } from '../service/planta.service';
import { IUbicacion } from 'app/entities/ubicacion/ubicacion.model';
import { UbicacionService } from 'app/entities/ubicacion/service/ubicacion.service';

@Component({
  selector: 'jhi-planta-update',
  templateUrl: './planta-update.component.html',
})
export class PlantaUpdateComponent implements OnInit {
  isSaving = false;
  planta: IPlanta | null = null;

  ubicacionsSharedCollection: IUbicacion[] = [];

  editForm: PlantaFormGroup = this.plantaFormService.createPlantaFormGroup();

  constructor(
    protected plantaService: PlantaService,
    protected plantaFormService: PlantaFormService,
    protected ubicacionService: UbicacionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUbicacion = (o1: IUbicacion | null, o2: IUbicacion | null): boolean => this.ubicacionService.compareUbicacion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ planta }) => {
      this.planta = planta;
      if (planta) {
        this.updateForm(planta);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const planta = this.plantaFormService.getPlanta(this.editForm);
    if (planta.id !== null) {
      this.subscribeToSaveResponse(this.plantaService.update(planta));
    } else {
      this.subscribeToSaveResponse(this.plantaService.create(planta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlanta>>): void {
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

  protected updateForm(planta: IPlanta): void {
    this.planta = planta;
    this.plantaFormService.resetForm(this.editForm, planta);

    this.ubicacionsSharedCollection = this.ubicacionService.addUbicacionToCollectionIfMissing<IUbicacion>(
      this.ubicacionsSharedCollection,
      planta.ubicacion
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ubicacionService
      .query()
      .pipe(map((res: HttpResponse<IUbicacion[]>) => res.body ?? []))
      .pipe(
        map((ubicacions: IUbicacion[]) =>
          this.ubicacionService.addUbicacionToCollectionIfMissing<IUbicacion>(ubicacions, this.planta?.ubicacion)
        )
      )
      .subscribe((ubicacions: IUbicacion[]) => (this.ubicacionsSharedCollection = ubicacions));
  }
}
