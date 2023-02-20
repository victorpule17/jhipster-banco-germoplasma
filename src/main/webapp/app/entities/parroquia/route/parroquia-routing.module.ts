import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParroquiaComponent } from '../list/parroquia.component';
import { ParroquiaDetailComponent } from '../detail/parroquia-detail.component';
import { ParroquiaUpdateComponent } from '../update/parroquia-update.component';
import { ParroquiaRoutingResolveService } from './parroquia-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const parroquiaRoute: Routes = [
  {
    path: '',
    component: ParroquiaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParroquiaDetailComponent,
    resolve: {
      parroquia: ParroquiaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParroquiaUpdateComponent,
    resolve: {
      parroquia: ParroquiaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParroquiaUpdateComponent,
    resolve: {
      parroquia: ParroquiaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parroquiaRoute)],
  exports: [RouterModule],
})
export class ParroquiaRoutingModule {}
