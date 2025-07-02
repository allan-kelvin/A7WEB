import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { Vendedor } from '../../../models/vendedor';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  private apiUrl = `${environment.apiUrl}/vendedores`; // Define a URL base para o endpoint de vendedores

  constructor(private http: HttpClient) { }

  /**
   * Obtém todos os vendedores do backend.
   * @returns Um Observable de um array de objetos Vendedor.
   */
  getVendedores(): Observable<Vendedor[]> {
    return this.http.get<Vendedor[]>(this.apiUrl);
  }

  /**
   * Obtém um vendedor específico pelo seu ID.
   * @param id O ID do vendedor a ser buscado.
   * @returns Um Observable do objeto Vendedor.
   */
  getVendedorById(id: number): Observable<Vendedor> {
    return this.http.get<Vendedor>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo vendedor no backend.
   * @param vendedor O objeto Vendedor a ser criado.
   * @returns Um Observable do objeto Vendedor criado (com o ID gerado pelo backend).
   */
  createVendedor(vendedor: Vendedor): Observable<Vendedor> {
    // Para criação, não enviamos o id_vendedor no payload, ele é gerado pelo backend
    const { id_vendedor, ...vendedorPayload } = vendedor;
    return this.http.post<Vendedor>(this.apiUrl, vendedorPayload);
  }

  /**
   * Atualiza um vendedor existente no backend.
   * @param id O ID do vendedor a ser atualizado.
   * @param vendedor Os dados do vendedor a serem atualizados (Partial para permitir atualização parcial).
   * @returns Um Observable do objeto Vendedor atualizado.
   */
  updateVendedor(id: number, vendedor: Partial<Vendedor>): Observable<Vendedor> {
    // Para atualização, o ID vai na URL, e o payload contém apenas os campos a serem atualizados
    return this.http.put<Vendedor>(`${this.apiUrl}/${id}`, vendedor);
  }

  /**
   * Exclui um vendedor do backend.
   * @param id O ID do vendedor a ser excluído.
   * @returns Um Observable vazio (ou com um status de sucesso).
   */
  deleteVendedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
