import { ICanton } from 'app/entities/canton/canton.model';

export interface IParroquia {
  id: number;
  nombreParroquia?: string | null;
  canton?: Pick<ICanton, 'id'> | null;
}

export type NewParroquia = Omit<IParroquia, 'id'> & { id: null };
