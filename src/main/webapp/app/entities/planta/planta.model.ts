import { IUbicacion } from 'app/entities/ubicacion/ubicacion.model';

export interface IPlanta {
  id: number;
  nombre?: string | null;
  estado?: string | null;
  uso?: string | null;
  ubicacion?: Pick<IUbicacion, 'id'> | null;
}

export type NewPlanta = Omit<IPlanta, 'id'> & { id: null };
