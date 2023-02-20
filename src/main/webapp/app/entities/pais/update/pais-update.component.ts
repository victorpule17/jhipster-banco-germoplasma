import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PaisFormService, PaisFormGroup } from './pais-form.service';
import { IPais } from '../pais.model';
import { PaisService } from '../service/pais.service';

@Component({
  selector: 'jhi-pais-update',
  templateUrl: './pais-update.component.html',
})
export class PaisUpdateComponent implements OnInit {
  isSaving = false;
  pais: IPais | null = null;

  editForm: PaisFormGroup = this.paisFormService.createPaisFormGroup();

  constructor(protected paisService: PaisService, protected paisFormService: PaisFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pais }) => {
      this.pais = pais;
      if (pais) {
        this.updateForm(pais);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pais = this.paisFormService.getPais(this.editForm);
    if (pais.id !== null) {
      this.subscribeToSaveResponse(this.paisService.update(pais));
    } else {
      this.subscribeToSaveResponse(this.paisService.create(pais));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPais>>): void {
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

  protected updateForm(pais: IPais): void {
    this.pais = pais;
    this.paisFormService.resetForm(this.editForm, pais);
  }
}
