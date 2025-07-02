import { Produto } from "../../models/produto.models";

export interface PdvItem extends Produto {
  quantidade: number;
  subtotal: number;
}
