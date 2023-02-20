import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUbicacion, NewUbicacion } from '../ubicacion.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUbicacion for edit and NewUbicacionFormGroupInput for create.
 */
type UbicacionFormGroupInput = IUbicacion | PartialWithRequiredKeyOf<NewUbicacion>;

type UbicacionFormDefaults = Pick<NewUbicacion, 'id'>;

type UbicacionFormGroupContent = {
  id: FormControl<IUbicacion['id'] | NewUbicacion['id']>;
  callePrincipal: FormControl<IUbicacion['callePrincipal']>;
  calleSecundaria: FormControl<IUbicacion['calleSecundaria']>;
  latitud: FormControl<IUbicacion['latitud']>;
  altitud: FormControl<IUbicacion['altitud']>;
  longitud: FormControl<IUbicacion['longitud']>;
  parroquia: FormControl<IUbicacion['parroquia']>;
};

export type UbicacionFormGroup = FormGroup<UbicacionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UbicacionFormService {
  createUbicacionFormGroup(ubicacion: UbicacionFormGroupInput = { id: null }): UbicacionFormGroup {
    const ubicacionRawValue = {
      ...this.getFormDefaults(),
      ...ubicacion,
    };
    return new FormGroup<UbicacionFormGroupContent>({
      id: new FormControl(
        { value: ubicacionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      callePrincipal: new FormControl(ubicacionRawValue.callePrincipal),
      calleSecundaria: new FormControl(ubicacionRawValue.calleSecundaria),
      latitud: new FormControl(ubicacionRawValue.latitud),
      altitud: new FormControl(ubicacionRawValue.altitud),
      longitud: new FormControl(ubicacionRawValue.longitud),
      parroquia: new FormControl(ubicacionRawValue.parroquia),
    });
  }

  getUbicacion(form: UbicacionFormGroup): IUbicacion | NewUbicacion {
    return form.getRawValue() as IUbicacion | NewUbicacion;
  }

  resetForm(form: UbicacionFormGroup, ubicacion: UbicacionFormGroupInput): void {
    const ubicacionRawValue = { ...this.getFormDefaults(), ...ubicacion };
    form.reset(
      {
        ...ubicacionRawValue,
        id: { value: ubicacionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UbicacionFormDefaults {
    return {
      id: null,
    };
  }
}
