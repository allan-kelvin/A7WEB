export interface Usuario {

  id_usuario?: number | null; // PrimaryGeneratedColumn, opcional para criação
  cpf: string; // char(11), unique: true, nullable: false
  rg?: string | null; // varchar(15), nullable: true
  nome: string; // varchar(100), nullable: false
  email?: string | null; // varchar(100), unique: true, nullable: true
  telefone?: string | null; // varchar(20), nullable: true
  endereco?: string | null; // varchar(255), nullable: true
  ativo?: boolean | null; // boolean, default: true

  // Relacionamento @OneToMany geralmente não é mapeado diretamente na interface do frontend para o CRUD simples.
  // Se você precisar de detalhes de permissão diretamente aqui, será uma outra camada de dados.
  // permissoes?: Permissao[];
}
