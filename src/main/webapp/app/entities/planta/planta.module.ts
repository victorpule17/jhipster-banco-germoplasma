import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PlantaComponent } from './list/planta.component';
import { PlantaDetailComponent } from './detail/planta-detail.component';
import { PlantaUpdateComponent } from './update/planta-update.component';
import { PlantaDeleteDialogComponent } from './delete/planta-delete-dialog.component';
import { PlantaRoutingModule } from './route/planta-routing.module';

@NgModule({
  imports: [SharedModule, PlantaRoutingModule],
  declarations: [PlantaComponent, PlantaDetailComponent, PlantaUpdateComponent, PlantaDeleteDialogComponent],
})
export class PlantaModule {}
