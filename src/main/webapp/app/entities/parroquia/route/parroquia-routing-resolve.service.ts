import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParroquia } from '../parroquia.model';
import { ParroquiaService } from '../service/parroquia.service';

@Injectable({ providedIn: 'root' })
export class ParroquiaRoutingResolveService implements Resolve<IParroquia | null> {
  constructor(protected service: ParroquiaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParroquia | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parroquia: HttpResponse<IParroquia>) => {
          if (parroquia.body) {
            return of(parroquia.body);
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
