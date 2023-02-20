import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICanton, NewCanton } from '../canton.model';

export type PartialUpdateCanton = Partial<ICanton> & Pick<ICanton, 'id'>;

export type EntityResponseType = HttpResponse<ICanton>;
export type EntityArrayResponseType = HttpResponse<ICanton[]>;

@Injectable({ providedIn: 'root' })
export class CantonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cantons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(canton: NewCanton): Observable<EntityResponseType> {
    return this.http.post<ICanton>(this.resourceUrl, canton, { observe: 'response' });
  }

  update(canton: ICanton): Observable<EntityResponseType> {
    return this.http.put<ICanton>(`${this.resourceUrl}/${this.getCantonIdentifier(canton)}`, canton, { observe: 'response' });
  }

  partialUpdate(canton: PartialUpdateCanton): Observable<EntityResponseType> {
    return this.http.patch<ICanton>(`${this.resourceUrl}/${this.getCantonIdentifier(canton)}`, canton, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICanton>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICanton[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCantonIdentifier(canton: Pick<ICanton, 'id'>): number {
    return canton.id;
  }

  compareCanton(o1: Pick<ICanton, 'id'> | null, o2: Pick<ICanton, 'id'> | null): boolean {
    return o1 && o2 ? this.getCantonIdentifier(o1) === this.getCantonIdentifier(o2) : o1 === o2;
  }

  addCantonToCollectionIfMissing<Type extends Pick<ICanton, 'id'>>(
    cantonCollection: Type[],
    ...cantonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cantons: Type[] = cantonsToCheck.filter(isPresent);
    if (cantons.length > 0) {
      const cantonCollectionIdentifiers = cantonCollection.map(cantonItem => this.getCantonIdentifier(cantonItem)!);
      const cantonsToAdd = cantons.filter(cantonItem => {
        const cantonIdentifier = this.getCantonIdentifier(cantonItem);
        if (cantonCollectionIdentifiers.includes(cantonIdentifier)) {
          return false;
        }
        cantonCollectionIdentifiers.push(cantonIdentifier);
        return true;
      });
      return [...cantonsToAdd, ...cantonCollection];
    }
    return cantonCollection;
  }
}
