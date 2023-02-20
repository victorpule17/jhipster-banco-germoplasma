import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IParroquia, NewParroquia } from '../parroquia.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IParroquia for edit and NewParroquiaFormGroupInput for create.
 */
type ParroquiaFormGroupInput = IParroquia | PartialWithRequiredKeyOf<NewParroquia>;

type ParroquiaFormDefaults = Pick<NewParroquia, 'id'>;

type ParroquiaFormGroupContent = {
  id: FormControl<IParroquia['id'] | NewParroquia['id']>;
  nombreParroquia: FormControl<IParroquia['nombreParroquia']>;
  canton: FormControl<IParroquia['canton']>;
};

export type ParroquiaFormGroup = FormGroup<ParroquiaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ParroquiaFormService {
  createParroquiaFormGroup(parroquia: ParroquiaFormGroupInput = { id: null }): ParroquiaFormGroup {
    const parroquiaRawValue = {
      ...this.getFormDefaults(),
      ...parroquia,
    };
    return new FormGroup<ParroquiaFormGroupContent>({
      id: new FormControl(
        { value: parroquiaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nombreParroquia: new FormControl(parroquiaRawValue.nombreParroquia),
      canton: new FormControl(parroquiaRawValue.canton),
    });
  }

  getParroquia(form: ParroquiaFormGroup): IParroquia | NewParroquia {
    return form.getRawValue() as IParroquia | NewParroquia;
  }

  resetForm(form: ParroquiaFormGroup, parroquia: ParroquiaFormGroupInput): void {
    const parroquiaRawValue = { ...this.getFormDefaults(), ...parroquia };
    form.reset(
      {
        ...parroquiaRawValue,
        id: { value: parroquiaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ParroquiaFormDefaults {
    return {
      id: null,
    };
  }
}
