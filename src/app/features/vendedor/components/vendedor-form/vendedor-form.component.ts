import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Vendedor } from '../../../../models/vendedor';
import { VendedorService } from '../../../../services/estoque/vendedor/vendedor.service';

@Component({
  selector: 'app-vendedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendedor-form.component.html',
  styleUrl: './vendedor-form.component.scss'
})
export class VendedorFormComponent implements OnInit, OnDestroy {

  vendedorForm: FormGroup;
  isEditMode: boolean = false;
  vendedorId: number | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private vendedorService: VendedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicialização do FormGroup com as validações
    this.vendedorForm = this.fb.group({
      nome_vendedor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      cod_vendedor: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]] // Código do vendedor
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.vendedorId = +id; // Converte para número

        this.vendedorService.getVendedorById(this.vendedorId).subscribe({
          next: (data) => {
            // Preenche o formulário com os dados do vendedor
            this.vendedorForm.patchValue({
              nome_vendedor: data.nome_vendedor,
              cod_vendedor: data.cod_vendedor
            });
            console.log('Formulário de vendedor preenchido para edição:', data);
          },
          error: (err) => {
            console.error('Erro ao carregar vendedor para edição:', err);
            this.router.navigate(['/cadastros/vendedor/consultar']); // Volta para a lista se houver erro
          }
        });
      } else {
        this.isEditMode = false;
        this.vendedorId = null;
        this.vendedorForm.reset(); // Limpa o formulário para novo cadastro
        console.log('Formulário de vendedor em modo de cadastro.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    console.log('VendedorFormComponent: onSubmit() chamado. Formulário válido?', this.vendedorForm.valid);

    if (this.vendedorForm.valid) {
      const formValues = this.vendedorForm.value;
      let payloadToSend: Partial<Vendedor>;

      if (this.isEditMode && this.vendedorId) {
        // Para atualização, remove id_vendedor do payload
        const { id_vendedor, ...restOfValues } = formValues;
        payloadToSend = restOfValues;

        console.log('VendedorFormComponent: Modo de Edição. Enviando PUT para ID:', this.vendedorId, 'com payload:', payloadToSend);
        this.vendedorService.updateVendedor(this.vendedorId, payloadToSend).subscribe({
          next: (updatedVendedor) => {
            console.log('Vendedor atualizado com sucesso:', updatedVendedor);
            this.router.navigate(['/cadastros/vendedor/consultar']); // Volta para a lista
          },
          error: (err) => {
            console.error('Erro ao atualizar vendedor:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      } else {
        // Para criação, envia todos os valores do formulário
        payloadToSend = formValues;
        console.log('VendedorFormComponent: Modo de Cadastro. Enviando POST com payload:', payloadToSend);
        this.vendedorService.createVendedor(payloadToSend as Vendedor).subscribe({
          next: (newVendedor) => {
            console.log('Vendedor criado com sucesso:', newVendedor);
            this.router.navigate(['/cadastros/vendedor/consultar']); // Volta para a lista
          },
          error: (err) => {
            console.error('Erro ao criar vendedor:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      }
    } else {
      this.vendedorForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
      console.log('VendedorFormComponent: Formulário inválido. Não enviando requisição.');
    }
  }

  onCancel(): void {
    console.log('VendedorFormComponent: Botão Cancelar clicado.');
    this.router.navigate(['/cadastros/vendedor/consultar']); // Volta para a lista
  }

}
