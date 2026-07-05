import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-chamados',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, TooltipDirective],
  templateUrl: './chamados.html'
})
export class Chamados {
  isSubmitting = signal(false);
  showSuccess = signal(false);
  modalAberto = signal(false); // Controle para o modal de edição/criação
  
  private storageKey = 'lumen_chamados';

  // Signal principal da lista de chamados
  chamados = signal<any[]>(this.carregarDados());

  // Objeto para o formulário (Novo ou Edição)
  chamadoForm = this.getFormInicial();

  constructor() {
    // Sincronização automática com LocalStorage
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.chamados()));
    });
  }

  private carregarDados() {
    const salvos = localStorage.getItem(this.storageKey);
    
    // Recuperação de dados padrão caso esteja vazio
    if (!salvos || JSON.parse(salvos).length === 0) {
      return [
        { id: 'TKT-001', servico: 'Reparo Core 2 Duo', status: 'Manutenção', data: '15/04/2026', urgencia: 'Alta' },
        { id: 'TKT-002', servico: 'Migração Hostgator', status: 'Alocado', data: '10/05/2026', urgencia: 'Média' }
      ];
    }
    return JSON.parse(salvos);
  }

  // --- LÓGICA DE MODAL E FORMULÁRIO ---

  abrirModal(chamadoParaEditar?: any) {
    if (chamadoParaEditar) {
      // Modo Edição: Clona o objeto para o formulário
      this.chamadoForm = { ...chamadoParaEditar };
    } else {
      // Modo Criação: Garante que o formulário esteja limpo
      this.chamadoForm = this.getFormInicial();
    }
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
    this.chamadoForm = this.getFormInicial();
  }

  // --- AÇÕES DE CRUD ---

  salvarChamado() {
    this.isSubmitting.set(true);

    // Simulação de processamento técnico da Lumen Tecnologia
    setTimeout(() => {
      if (this.chamadoForm.id) {
        // Lógica de Edição: Atualiza o item existente
        this.chamados.update(lista => 
          lista.map(c => c.id === this.chamadoForm.id ? { ...this.chamadoForm } : c)
        );
      } else {
        // Lógica de Criação: Gera novo ticket
        const novoTicket = {
          ...this.chamadoForm,
          id: `TKT-${Date.now()}`, // CORREÇÃO: Usa timestamp para garantir ID único
          data: new Date().toLocaleDateString()
        };
        this.chamados.update(lista => [novoTicket, ...lista]);
      }

      this.isSubmitting.set(false);
      this.showSuccess.set(true);
      this.fecharModal();

      setTimeout(() => this.showSuccess.set(false), 3000);
    }, 800);
  }

  excluir(id: string) {
    if (confirm('Deseja realmente remover este chamado do sistema da Lumen?')) {
      this.chamados.update(l => l.filter(t => t.id !== id));
    }
  }

  alternarStatus(id: string) {
    this.chamados.update(list => list.map(c => 
      c.id === id ? { ...c, status: c.status === 'Manutenção' ? 'Alocado' : 'Manutenção' } : c
    ));
  }

  private getFormInicial() {
    return {
      id: null as string | null,
      servico: '',
      status: 'Alocado',
      urgencia: 'Média',
      data: ''
    };
  }
}