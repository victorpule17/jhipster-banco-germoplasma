import { IProvincia } from 'app/entities/provincia/provincia.model';

export interface ICanton {
  id: number;
  nombreCanton?: string | null;
  provincia?: Pick<IProvincia, 'id'> | null;
}

export type NewCanton = Omit<ICanton, 'id'> & { id: null };
