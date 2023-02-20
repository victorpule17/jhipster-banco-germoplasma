import { IParroquia } from 'app/entities/parroquia/parroquia.model';

export interface IUbicacion {
  id: number;
  callePrincipal?: string | null;
  calleSecundaria?: string | null;
  latitud?: string | null;
  altitud?: string | null;
  longitud?: string | null;
  parroquia?: Pick<IParroquia, 'id'> | null;
}

export type NewUbicacion = Omit<IUbicacion, 'id'> & { id: null };
