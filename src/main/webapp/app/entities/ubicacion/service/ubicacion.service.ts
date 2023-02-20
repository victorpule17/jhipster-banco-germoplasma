import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUbicacion, NewUbicacion } from '../ubicacion.model';

export type PartialUpdateUbicacion = Partial<IUbicacion> & Pick<IUbicacion, 'id'>;

export type EntityResponseType = HttpResponse<IUbicacion>;
export type EntityArrayResponseType = HttpResponse<IUbicacion[]>;

@Injectable({ providedIn: 'root' })
export class UbicacionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ubicacions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ubicacion: NewUbicacion): Observable<EntityResponseType> {
    return this.http.post<IUbicacion>(this.resourceUrl, ubicacion, { observe: 'response' });
  }

  update(ubicacion: IUbicacion): Observable<EntityResponseType> {
    return this.http.put<IUbicacion>(`${this.resourceUrl}/${this.getUbicacionIdentifier(ubicacion)}`, ubicacion, { observe: 'response' });
  }

  partialUpdate(ubicacion: PartialUpdateUbicacion): Observable<EntityResponseType> {
    return this.http.patch<IUbicacion>(`${this.resourceUrl}/${this.getUbicacionIdentifier(ubicacion)}`, ubicacion, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUbicacion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUbicacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUbicacionIdentifier(ubicacion: Pick<IUbicacion, 'id'>): number {
    return ubicacion.id;
  }

  compareUbicacion(o1: Pick<IUbicacion, 'id'> | null, o2: Pick<IUbicacion, 'id'> | null): boolean {
    return o1 && o2 ? this.getUbicacionIdentifier(o1) === this.getUbicacionIdentifier(o2) : o1 === o2;
  }

  addUbicacionToCollectionIfMissing<Type extends Pick<IUbicacion, 'id'>>(
    ubicacionCollection: Type[],
    ...ubicacionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ubicacions: Type[] = ubicacionsToCheck.filter(isPresent);
    if (ubicacions.length > 0) {
      const ubicacionCollectionIdentifiers = ubicacionCollection.map(ubicacionItem => this.getUbicacionIdentifier(ubicacionItem)!);
      const ubicacionsToAdd = ubicacions.filter(ubicacionItem => {
        const ubicacionIdentifier = this.getUbicacionIdentifier(ubicacionItem);
        if (ubicacionCollectionIdentifiers.includes(ubicacionIdentifier)) {
          return false;
        }
        ubicacionCollectionIdentifiers.push(ubicacionIdentifier);
        return true;
      });
      return [...ubicacionsToAdd, ...ubicacionCollection];
    }
    return ubicacionCollection;
  }
}
