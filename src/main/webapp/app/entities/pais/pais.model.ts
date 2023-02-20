export interface IPais {
  id: number;
  nombrePais?: string | null;
}

export type NewPais = Omit<IPais, 'id'> & { id: null };
