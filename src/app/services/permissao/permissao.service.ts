import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Permissao } from '../../models/permissao';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {

  private apiUrl = `${environment.apiUrl}/permissoes`; // Define a URL base para o endpoint de permissões

  constructor(private http: HttpClient) { }

  /**
   * Obtém todas as permissões do backend.
   * @returns Um Observable de um array de objetos Permissao.
   */
  getPermissoes(): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(this.apiUrl);
  }

  /**
   * Obtém uma permissão específica pelo seu ID.
   * @param id O ID da permissão a ser buscada.
   * @returns Um Observable do objeto Permissao.
   */
  getPermissaoById(id: number): Observable<Permissao> {
    return this.http.get<Permissao>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria uma nova permissão no backend.
   * @param permissao O objeto Permissao a ser criado.
   * @returns Um Observable do objeto Permissao criado (com o ID gerado pelo backend).
   */
  createPermissao(permissao: Permissao): Observable<Permissao> {
    // Para criação, não enviamos o id_permissao no payload, ele é gerado pelo backend
    const { id_permissao, ...permissaoPayload } = permissao;
    return this.http.post<Permissao>(this.apiUrl, permissaoPayload);
  }

  /**
   * Atualiza uma permissão existente no backend.
   * @param id O ID da permissão a ser atualizada.
   * @param permissao Os dados da permissão a serem atualizados (Partial para permitir atualização parcial).
   * @returns Um Observable do objeto Permissao atualizada.
   */
  updatePermissao(id: number, permissao: Partial<Permissao>): Observable<Permissao> {
    // Para atualização, o ID vai na URL, e o payload contém apenas os campos a serem atualizados
    return this.http.put<Permissao>(`${this.apiUrl}/${id}`, permissao);
  }

  /**
   * Exclui uma permissão do backend.
   * @param id O ID da permissão a ser excluída.
   * @returns Um Observable vazio (ou com um status de sucesso).
   */
  deletePermissao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
