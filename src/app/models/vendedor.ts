export interface Vendedor {
  id_vendedor?: number | null; // PrimaryGeneratedColumn, opcional para criação, pode ser null ao limpar form
  nome_vendedor: string; // varchar(100), nullable: false
  cod_vendedor: string; // varchar(20), unique: true, nullable: false
}
