import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cliente } from '../../../../models/cliente';
import { ClienteService } from '../../../../services/clientes/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent  implements OnInit, OnDestroy {
   clienteForm: FormGroup;
      isEditMode: boolean = false;
      clienteId: number | null = null;
      private routeSubscription: Subscription | null = null;

      constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private route: ActivatedRoute,
        private router: Router
      ) {
        // Inicialização do FormGroup com as validações
        this.clienteForm = this.fb.group({
          cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], // CPF com 11 dígitos numéricos
          nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          telefone: ['', [Validators.pattern(/^\d{10,11}$/)]], // 10 ou 11 dígitos para telefone/celular
          email: ['', [Validators.email, Validators.maxLength(100)]],
          endereco: ['', [Validators.maxLength(255)]],
          ativo: [true] // Valor padrão para 'ativo'
        });
      }

      ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.isEditMode = true;
            this.clienteId = +id; // Converte para número

            this.clienteService.getClienteById(this.clienteId).subscribe({
              next: (data) => {
                // Preenche o formulário com os dados do cliente
                this.clienteForm.patchValue({
                  cpf: data.cpf,
                  nome: data.nome,
                  telefone: data.telefone,
                  email: data.email,
                  endereco: data.endereco,
                  ativo: data.ativo
                });
                console.log('Formulário de cliente preenchido para edição:', data);
              },
              error: (err) => {
                console.error('Erro ao carregar cliente para edição:', err);
                this.router.navigate(['/cadastros/cliente/consultar']); // Volta para a lista se houver erro
              }
            });
          } else {
            this.isEditMode = false;
            this.clienteId = null;
            this.clienteForm.reset({ ativo: true }); // Limpa e define 'ativo' como true para novo cadastro
            console.log('Formulário de cliente em modo de cadastro.');
          }
        });
      }

      ngOnDestroy(): void {
        if (this.routeSubscription) {
          this.routeSubscription.unsubscribe();
        }
      }

      onSubmit(): void {
        console.log('ClienteFormComponent: onSubmit() chamado. Formulário válido?', this.clienteForm.valid);

        if (this.clienteForm.valid) {
          // Cria o payload a ser enviado, excluindo id_cliente se for criação
          const clienteToSave: Cliente = {
            id_cliente: this.isEditMode ? this.clienteId : undefined,
            ...this.clienteForm.value
          };

          if (this.isEditMode && this.clienteId) {
            console.log('ClienteFormComponent: Modo de Edição. Enviando PUT para ID:', this.clienteId, 'com payload:', clienteToSave);
            this.clienteService.updateCliente(this.clienteId, clienteToSave).subscribe({
              next: (updatedCliente) => {
                console.log('Cliente atualizado com sucesso:', updatedCliente);
                this.router.navigate(['/cadastros/cliente/consultar']); // Volta para a lista
              },
              error: (err) => {
                console.error('Erro ao atualizar cliente:', err);
                // Aqui você pode adicionar feedback visual ao usuário
              }
            });
          } else {
            console.log('ClienteFormComponent: Modo de Cadastro. Enviando POST com payload:', clienteToSave);
            this.clienteService.createCliente(clienteToSave).subscribe({
              next: (newCliente) => {
                console.log('Cliente criado com sucesso:', newCliente);
                this.router.navigate(['/cadastros/cliente/consultar']); // Volta para a lista
              },
              error: (err) => {
                console.error('Erro ao criar cliente:', err);
                // Aqui você pode adicionar feedback visual ao usuário
              }
            });
          }
        } else {
          this.clienteForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
          console.log('ClienteFormComponent: Formulário inválido. Não enviando requisição.');
        }
      }

      onCancel(): void {
        console.log('ClienteFormComponent: Botão Cancelar clicado.');
        this.router.navigate(['/cadastros/cliente/consultar']); // Volta para a lista
      }

}
