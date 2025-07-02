import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core'; // Adicione OnDestroy
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Importe ActivatedRoute e Router
import { Subscription } from 'rxjs'; // Importe Subscription
import { FormaPagamento } from '../../../../models/forma-pagamento.model';
import { FormaPagamentoService } from '../../../../services/forma-pagamento/forma-pagamento.service'; // Importe o serviço

@Component({
  selector: 'app-forma-pagamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forma-pagamento-form.component.html',
  styleUrl: './forma-pagamento-form.component.scss'
})
export class FormaPagamentoFormComponent implements OnInit, OnDestroy {
  // REMOVEMOS @Input() e @Output() porque este componente agora gerencia sua própria lógica de dados e navegação
  // @Input() formaPagamento: FormaPagamento | null = null;
  // @Output() save = new EventEmitter<FormaPagamento>();
  // @Output() cancel = new EventEmitter<void>();

  formaPagamentoForm: FormGroup;
  isEditMode: boolean = false;
  formaPagamentoId: number | null = null; // Para guardar o ID em modo de edição
  private routeSubscription: Subscription | null = null; // Para gerenciar a inscrição da rota

  constructor(
    private fb: FormBuilder,
    private formaPagamentoService: FormaPagamentoService, // Injetado
    private route: ActivatedRoute, // Injetado para obter parâmetros da rota
    private router: Router // Injetado para navegação programática
  ) {
    this.formaPagamentoForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    // Escuta mudanças nos parâmetros da rota (especialmente o 'id' para edição)
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Se houver um ID na rota, estamos em modo de edição
        this.isEditMode = true;
        this.formaPagamentoId = +id; // Converte o ID para número

        // Busca os dados da forma de pagamento pelo ID
        this.formaPagamentoService.getFormaPagamentoById(this.formaPagamentoId).subscribe({
          next: (data) => {
            // Preenche o formulário com os dados recebidos
            this.formaPagamentoForm.patchValue({
              descricao: data.descricao
            });
            console.log('Formulário preenchido para edição:', data);
          },
          error: (err) => {
            console.error('Erro ao carregar forma de pagamento para edição:', err);
            // Se der erro ao carregar, redireciona para a lista
            this.router.navigate(['/formas-pagamento/consultar']);
          }
        });
      } else {
        // Se não houver ID na rota, estamos em modo de cadastro
        this.isEditMode = false;
        this.formaPagamentoId = null;
        this.formaPagamentoForm.reset(); // Garante que o formulário esteja limpo para cadastro
        console.log('Formulário em modo de cadastro.');
      }
    });
  }

  ngOnDestroy(): void {
    // Desfaz a inscrição para evitar vazamentos de memória
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    console.log('onSubmit() chamado no FormaPagamentoFormComponent. Formulário válido?', this.formaPagamentoForm.valid);

    if (this.formaPagamentoForm.valid) {
      // Cria o objeto de dados a ser salvo ou atualizado
      const formaPagamentoToSave: FormaPagamento = {
        descricao: this.formaPagamentoForm.value.descricao
      };

      // Chama o serviço para atualizar ou criar, dependendo do modo
      if (this.isEditMode && this.formaPagamentoId) {
        this.formaPagamentoService.updateFormaPagamento(this.formaPagamentoId, formaPagamentoToSave).subscribe({
          next: (updatedForma) => {
            console.log('Forma de pagamento atualizada com sucesso:', updatedForma);
            this.router.navigate(['/formas-pagamento/consultar']); // Volta para a lista após sucesso
          },
          error: (err) => {
            console.error('Erro ao atualizar forma de pagamento:', err);
            // Implementar feedback de erro na UI
          }
        });
      } else {
        this.formaPagamentoService.createFormaPagamento(formaPagamentoToSave).subscribe({
          next: (newForma) => {
            console.log('Forma de pagamento criada com sucesso:', newForma);
            this.router.navigate(['/formas-pagamento/consultar']); // Volta para a lista após sucesso
          },
          error: (err) => {
            console.error('Erro ao criar forma de pagamento:', err);
            // Implementar feedback de erro na UI
          }
        });
      }
    } else {
      this.formaPagamentoForm.markAllAsTouched(); // Marca campos como tocados para exibir erros
      console.log('Formulário inválido. Não enviando requisição.');
    }
  }

  onCancel(): void {
    console.log('Botão Cancelar clicado.');
    this.router.navigate(['/formas-pagamento/consultar']); // Volta para a lista
  }
}
