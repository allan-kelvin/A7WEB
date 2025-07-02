import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Cliente } from '../../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

    private apiUrl = `${environment.apiUrl}/clientes`; // Define a URL base para o endpoint de clientes

      constructor(private http: HttpClient) { }

      /**
       * Obtém todas as formas de pagamento do backend.
       * @returns Um Observable de um array de objetos Cliente.
       */
      getClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.apiUrl);
      }

      /**
       * Obtém um cliente específico pelo seu ID.
       * @param id O ID do cliente a ser buscado.
       * @returns Um Observable do objeto Cliente.
       */
      getClienteById(id: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
      }

      /**
       * Cria um novo cliente no backend.
       * @param cliente O objeto Cliente a ser criado.
       * @returns Um Observable do objeto Cliente criado (com o ID gerado pelo backend).
       */
      createCliente(cliente: Cliente): Observable<Cliente> {
        // Para criação, não enviamos o id_cliente no payload, ele é gerado pelo backend
        const { id_cliente, ...clientePayload } = cliente;
        return this.http.post<Cliente>(this.apiUrl, clientePayload);
      }

      /**
       * Atualiza um cliente existente no backend.
       * @param id O ID do cliente a ser atualizado.
       * @param cliente Os dados do cliente a serem atualizados.
       * @returns Um Observable do objeto Cliente atualizado.
       */
      updateCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
        // Para atualização, o ID vai na URL, e o payload contém apenas os campos a serem atualizados
        return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
      }

      /**
       * Exclui um cliente do backend.
       * @param id O ID do cliente a ser excluído.
       * @returns Um Observable vazio (ou com um status de sucesso).
       */
      deleteCliente(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }
}
