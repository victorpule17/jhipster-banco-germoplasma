import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CantonComponent } from './list/canton.component';
import { CantonDetailComponent } from './detail/canton-detail.component';
import { CantonUpdateComponent } from './update/canton-update.component';
import { CantonDeleteDialogComponent } from './delete/canton-delete-dialog.component';
import { CantonRoutingModule } from './route/canton-routing.module';

@NgModule({
  imports: [SharedModule, CantonRoutingModule],
  declarations: [CantonComponent, CantonDetailComponent, CantonUpdateComponent, CantonDeleteDialogComponent],
})
export class CantonModule {}
