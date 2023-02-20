import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICanton } from '../canton.model';
import { CantonService } from '../service/canton.service';

@Injectable({ providedIn: 'root' })
export class CantonRoutingResolveService implements Resolve<ICanton | null> {
  constructor(protected service: CantonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICanton | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((canton: HttpResponse<ICanton>) => {
          if (canton.body) {
            return of(canton.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
