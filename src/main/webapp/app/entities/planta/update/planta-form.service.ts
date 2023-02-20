import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPlanta, NewPlanta } from '../planta.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlanta for edit and NewPlantaFormGroupInput for create.
 */
type PlantaFormGroupInput = IPlanta | PartialWithRequiredKeyOf<NewPlanta>;

type PlantaFormDefaults = Pick<NewPlanta, 'id'>;

type PlantaFormGroupContent = {
  id: FormControl<IPlanta['id'] | NewPlanta['id']>;
  nombre: FormControl<IPlanta['nombre']>;
  estado: FormControl<IPlanta['estado']>;
  uso: FormControl<IPlanta['uso']>;
  ubicacion: FormControl<IPlanta['ubicacion']>;
};

export type PlantaFormGroup = FormGroup<PlantaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlantaFormService {
  createPlantaFormGroup(planta: PlantaFormGroupInput = { id: null }): PlantaFormGroup {
    const plantaRawValue = {
      ...this.getFormDefaults(),
      ...planta,
    };
    return new FormGroup<PlantaFormGroupContent>({
      id: new FormControl(
        { value: plantaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nombre: new FormControl(plantaRawValue.nombre),
      estado: new FormControl(plantaRawValue.estado),
      uso: new FormControl(plantaRawValue.uso),
      ubicacion: new FormControl(plantaRawValue.ubicacion),
    });
  }

  getPlanta(form: PlantaFormGroup): IPlanta | NewPlanta {
    return form.getRawValue() as IPlanta | NewPlanta;
  }

  resetForm(form: PlantaFormGroup, planta: PlantaFormGroupInput): void {
    const plantaRawValue = { ...this.getFormDefaults(), ...planta };
    form.reset(
      {
        ...plantaRawValue,
        id: { value: plantaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlantaFormDefaults {
    return {
      id: null,
    };
  }
}
