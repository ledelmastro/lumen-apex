export interface Item {
  id: number;
  nome: string;
  modelo: string;
  categoria: string;
  status: 'Disponível' | 'Alocado' | 'Manutenção';
}