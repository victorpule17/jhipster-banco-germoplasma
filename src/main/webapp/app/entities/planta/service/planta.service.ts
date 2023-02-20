import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlanta, NewPlanta } from '../planta.model';

export type PartialUpdatePlanta = Partial<IPlanta> & Pick<IPlanta, 'id'>;

export type EntityResponseType = HttpResponse<IPlanta>;
export type EntityArrayResponseType = HttpResponse<IPlanta[]>;

@Injectable({ providedIn: 'root' })
export class PlantaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plantas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(planta: NewPlanta): Observable<EntityResponseType> {
    return this.http.post<IPlanta>(this.resourceUrl, planta, { observe: 'response' });
  }

  update(planta: IPlanta): Observable<EntityResponseType> {
    return this.http.put<IPlanta>(`${this.resourceUrl}/${this.getPlantaIdentifier(planta)}`, planta, { observe: 'response' });
  }

  partialUpdate(planta: PartialUpdatePlanta): Observable<EntityResponseType> {
    return this.http.patch<IPlanta>(`${this.resourceUrl}/${this.getPlantaIdentifier(planta)}`, planta, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlanta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlanta[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlantaIdentifier(planta: Pick<IPlanta, 'id'>): number {
    return planta.id;
  }

  comparePlanta(o1: Pick<IPlanta, 'id'> | null, o2: Pick<IPlanta, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlantaIdentifier(o1) === this.getPlantaIdentifier(o2) : o1 === o2;
  }

  addPlantaToCollectionIfMissing<Type extends Pick<IPlanta, 'id'>>(
    plantaCollection: Type[],
    ...plantasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plantas: Type[] = plantasToCheck.filter(isPresent);
    if (plantas.length > 0) {
      const plantaCollectionIdentifiers = plantaCollection.map(plantaItem => this.getPlantaIdentifier(plantaItem)!);
      const plantasToAdd = plantas.filter(plantaItem => {
        const plantaIdentifier = this.getPlantaIdentifier(plantaItem);
        if (plantaCollectionIdentifiers.includes(plantaIdentifier)) {
          return false;
        }
        plantaCollectionIdentifiers.push(plantaIdentifier);
        return true;
      });
      return [...plantasToAdd, ...plantaCollection];
    }
    return plantaCollection;
  }
}
