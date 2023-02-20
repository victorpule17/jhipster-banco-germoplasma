import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParroquia } from '../parroquia.model';
import { ParroquiaService } from '../service/parroquia.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './parroquia-delete-dialog.component.html',
})
export class ParroquiaDeleteDialogComponent {
  parroquia?: IParroquia;

  constructor(protected parroquiaService: ParroquiaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parroquiaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
