export interface Produto {
  id_produto?: number | null; // PrimaryGeneratedColumn, opcional para criação, pode ser null ao limpar form
  nome: string; // varchar(100), nullable: false
  codigo_barras?: string | null; // char(13), unique: true, nullable: true
  numeracao?: string | null; // varchar(10), nullable: true (Numeração de calçado ou tamanho de roupa)
  tamanho?: string | null; // varchar(10), nullable: true (P, M, G, GG ou Único)
  cor1?: string | null; // varchar(30), nullable: true
  cor2?: string | null; // varchar(30), nullable: true
  referencia?: string | null; // varchar(50), nullable: true
  preco: number; // decimal, nullable: false
  categoria?: string | null; // varchar(50), nullable: true
  ativo?: boolean | null;
  quantidade?: number // boolean, default: true, opcional na criação

  // Note: O relacionamento @OneToMany geralmente não é mapeado diretamente na interface do frontend para o CRUD simples.
  // Se você precisar de detalhes de estoque diretamente aqui, será uma outra camada de dados.
  // estoques?: Estoque[]; // Opcional, se precisar de dados de estoque junto com o produto no frontend
}
