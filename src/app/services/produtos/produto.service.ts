import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Produto } from '../../models/produto.models';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = `${environment.apiUrl}/produto`; // Define a URL base para o endpoint de produtos

  constructor(private http: HttpClient) { }

  /**
   * Obtém todos os produtos do backend.
   * @returns Um Observable de um array de objetos Produto.
   */
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  /**
   * Obtém um produto específico pelo seu ID.
   * @param id O ID do produto a ser buscado.
   * @returns Um Observable do objeto Produto.
   */
  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo produto no backend.
   * @param produto O objeto Produto a ser criado.
   * @returns Um Observable do objeto Produto criado (com o ID gerado pelo backend).
   */
  createProduto(produto: Produto): Observable<Produto> {
    // Para criação, não enviamos o id_produto no payload, ele é gerado pelo backend
    const { id_produto, ...produtoPayload } = produto;
    return this.http.post<Produto>(this.apiUrl, produtoPayload);
  }

  /**
   * Atualiza um produto existente no backend.
   * @param id O ID do produto a ser atualizado.
   * @param produto Os dados do produto a serem atualizados (Partial para permitir atualização parcial).
   * @returns Um Observable do objeto Produto atualizado.
   */
  updateProduto(id: number, produto: Partial<Produto>): Observable<Produto> {
    // Para atualização, o ID vai na URL, e o payload contém apenas os campos a serem atualizados
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  /**
   * Exclui um produto do backend.
   * @param id O ID do produto a ser excluído.
   * @returns Um Observable vazio (ou com um status de sucesso).
   */
  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
