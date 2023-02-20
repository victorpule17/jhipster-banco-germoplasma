import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParroquiaComponent } from './list/parroquia.component';
import { ParroquiaDetailComponent } from './detail/parroquia-detail.component';
import { ParroquiaUpdateComponent } from './update/parroquia-update.component';
import { ParroquiaDeleteDialogComponent } from './delete/parroquia-delete-dialog.component';
import { ParroquiaRoutingModule } from './route/parroquia-routing.module';

@NgModule({
  imports: [SharedModule, ParroquiaRoutingModule],
  declarations: [ParroquiaComponent, ParroquiaDetailComponent, ParroquiaUpdateComponent, ParroquiaDeleteDialogComponent],
})
export class ParroquiaModule {}
