import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlantaComponent } from '../list/planta.component';
import { PlantaDetailComponent } from '../detail/planta-detail.component';
import { PlantaUpdateComponent } from '../update/planta-update.component';
import { PlantaRoutingResolveService } from './planta-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const plantaRoute: Routes = [
  {
    path: '',
    component: PlantaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlantaDetailComponent,
    resolve: {
      planta: PlantaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlantaUpdateComponent,
    resolve: {
      planta: PlantaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlantaUpdateComponent,
    resolve: {
      planta: PlantaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(plantaRoute)],
  exports: [RouterModule],
})
export class PlantaRoutingModule {}
