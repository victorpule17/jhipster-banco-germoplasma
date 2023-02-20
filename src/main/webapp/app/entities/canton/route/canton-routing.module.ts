import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CantonComponent } from '../list/canton.component';
import { CantonDetailComponent } from '../detail/canton-detail.component';
import { CantonUpdateComponent } from '../update/canton-update.component';
import { CantonRoutingResolveService } from './canton-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const cantonRoute: Routes = [
  {
    path: '',
    component: CantonComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CantonDetailComponent,
    resolve: {
      canton: CantonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CantonUpdateComponent,
    resolve: {
      canton: CantonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CantonUpdateComponent,
    resolve: {
      canton: CantonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cantonRoute)],
  exports: [RouterModule],
})
export class CantonRoutingModule {}
