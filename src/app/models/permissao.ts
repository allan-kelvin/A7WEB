export interface Permissao {
  id_permissao?: number | null; // PrimaryGeneratedColumn, opcional para criação
  id_usuario: number; // id_usuario, nullable: false (chave estrangeira)
  // usuario?: Usuario; // Opcional: Se precisar carregar os dados completos do usuário junto com a permissão

  criar?: boolean | null; // boolean, default: false
  editar?: boolean | null; // boolean, default: false
  excluir?: boolean | null; // boolean, default: false
  admin?: boolean | null; // boolean, default: false
}
