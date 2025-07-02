import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment.prod";
import { Estoque } from '../models/estoque';


@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = `${environment.apiUrl}/estoques`; // Define a URL base para o endpoint de estoques

  constructor(private http: HttpClient) { }

  /**
   * Obtém todos os registros de estoque do backend.
   * @returns Um Observable de um array de objetos Estoque.
   */
  getEstoques(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiUrl);
  }

  /**
   * Obtém um registro de estoque específico pelo seu ID.
   * @param id O ID do registro de estoque a ser buscado.
   * @returns Um Observable do objeto Estoque.
   */
  getEstoqueById(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`);
  }

  // Métodos de criação, atualização e exclusão não são necessários
  // se a tela de estoque for apenas para visualização.
  // Se houver uma necessidade futura, eles podem ser adicionados aqui.

  /**
   * Cria um novo registro de estoque no backend.
   * Este método pode ser usado se houver uma tela de entrada de estoque.
   * @param estoque O objeto Estoque a ser criado.
   * @returns Um Observable do objeto Estoque criado.
   */
  createEstoque(estoque: Estoque): Observable<Estoque> {
    const { id_estoque, ...estoquePayload } = estoque;
    return this.http.post<Estoque>(this.apiUrl, estoquePayload);
  }

  /**
   * Atualiza um registro de estoque existente no backend.
   * @param id O ID do registro de estoque a ser atualizado.
   * @param estoque Os dados do estoque a serem atualizados (Partial para permitir atualização parcial).
   * @returns Um Observable do objeto Estoque atualizado.
   */
  updateEstoque(id: number, estoque: Partial<Estoque>): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.apiUrl}/${id}`, estoque);
  }

  /**
   * Exclui um registro de estoque do backend.
   * @param id O ID do registro de estoque a ser excluído.
   * @returns Um Observable vazio (ou com um status de sucesso).
   */
  deleteEstoque(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
