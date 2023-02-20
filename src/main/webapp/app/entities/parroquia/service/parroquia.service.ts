import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParroquia, NewParroquia } from '../parroquia.model';

export type PartialUpdateParroquia = Partial<IParroquia> & Pick<IParroquia, 'id'>;

export type EntityResponseType = HttpResponse<IParroquia>;
export type EntityArrayResponseType = HttpResponse<IParroquia[]>;

@Injectable({ providedIn: 'root' })
export class ParroquiaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parroquias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parroquia: NewParroquia): Observable<EntityResponseType> {
    return this.http.post<IParroquia>(this.resourceUrl, parroquia, { observe: 'response' });
  }

  update(parroquia: IParroquia): Observable<EntityResponseType> {
    return this.http.put<IParroquia>(`${this.resourceUrl}/${this.getParroquiaIdentifier(parroquia)}`, parroquia, { observe: 'response' });
  }

  partialUpdate(parroquia: PartialUpdateParroquia): Observable<EntityResponseType> {
    return this.http.patch<IParroquia>(`${this.resourceUrl}/${this.getParroquiaIdentifier(parroquia)}`, parroquia, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParroquia>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParroquia[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getParroquiaIdentifier(parroquia: Pick<IParroquia, 'id'>): number {
    return parroquia.id;
  }

  compareParroquia(o1: Pick<IParroquia, 'id'> | null, o2: Pick<IParroquia, 'id'> | null): boolean {
    return o1 && o2 ? this.getParroquiaIdentifier(o1) === this.getParroquiaIdentifier(o2) : o1 === o2;
  }

  addParroquiaToCollectionIfMissing<Type extends Pick<IParroquia, 'id'>>(
    parroquiaCollection: Type[],
    ...parroquiasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const parroquias: Type[] = parroquiasToCheck.filter(isPresent);
    if (parroquias.length > 0) {
      const parroquiaCollectionIdentifiers = parroquiaCollection.map(parroquiaItem => this.getParroquiaIdentifier(parroquiaItem)!);
      const parroquiasToAdd = parroquias.filter(parroquiaItem => {
        const parroquiaIdentifier = this.getParroquiaIdentifier(parroquiaItem);
        if (parroquiaCollectionIdentifiers.includes(parroquiaIdentifier)) {
          return false;
        }
        parroquiaCollectionIdentifiers.push(parroquiaIdentifier);
        return true;
      });
      return [...parroquiasToAdd, ...parroquiaCollection];
    }
    return parroquiaCollection;
  }
}
