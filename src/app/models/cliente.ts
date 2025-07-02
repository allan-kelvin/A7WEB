export interface Cliente {
  id_cliente?: number | null; // Opcional, pois é gerado pelo banco para novas criações
  cpf: string;
  nome: string;
  telefone?: string | null; // Opcional, pode ser nulo
  email?: string | null; // Opcional, pode ser nulo
  endereco?: string | null; // Opcional, pode ser nulo
  ativo?: boolean | null; // Opcional, com default true no backend
}
