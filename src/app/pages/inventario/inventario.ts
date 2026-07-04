import { ChangeDetectionStrategy, Component, inject, signal, HostListener, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  standalone: true,
  templateUrl: './inventario.html',
  imports: [CommonModule, StatusBadgeComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' }
})
export class Inventario implements OnInit {
  private inventarioService = inject(InventarioService);
  
  // Signal que consome a lista reativa do serviço
  public items = this.inventarioService.items;
  carregando = signal(true);

  // Controle de visibilidade do modal de cadastro/edição
  modalAberto = signal(false);

  // Armazena o ID do item que está com o menu de contexto aberto
  menuAbertoId = signal<number | null>(null);

  // Objeto que mantém os dados do formulário atual
  novoAtivo = this.getFormInicial();

  ngOnInit() {
    setTimeout(() => {
      this.carregando.set(false);
    }, 800);
  }

  /**
   * Listener global para fechar menus de ação ao clicar em qualquer
   * parte do documento, garantindo uma UI limpa.
   */
  @HostListener('document:click')
  fecharMenus() {
    this.menuAbertoId.set(null);
  }

  /**
   * Alterna a exibição do menu de três pontos para um item específico.
   * Interrompe a propagação para evitar que o fecharMenus() seja disparado.
   */
  toggleMenu(id: number, event: Event) {
    event.stopPropagation();
    this.menuAbertoId.update(atual => atual === id ? null : id);
  }

  /**
   * Abre o modal de formulário. Se um item for passado, o modo 
   * muda para edição carregando os dados existentes.
   */
  abrirModal(itemParaEditar?: any) {
    if (itemParaEditar) {
      // Cria uma cópia rasa para não refletir alterações no signal antes de salvar
      this.novoAtivo = { ...itemParaEditar };
    } else {
      this.novoAtivo = this.getFormInicial();
    }
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
    this.limparFormulario();
  }

  /**
   * Processa a gravação dos dados. Identifica se é uma nova inserção
   * (gera ID via timestamp) ou uma atualização de item existente.
   */
  salvarAtivo() {
    if (this.novoAtivo.nome) {
      if (this.novoAtivo.id) {
        // Fluxo de atualização para itens com ID já definido
        this.inventarioService.atualizarItem(this.novoAtivo);
      } else {
        // Fluxo de criação para novos equipamentos
        const itemParaSalvar = {
          ...this.novoAtivo,
          id: Date.now()
        };
        this.inventarioService.adicionarItem(itemParaSalvar);
      }
      
      this.fecharModal();
    }
  }

  /**
   * Prepara o componente para editar um ativo específico.
   */
  editar(item: any) {
    this.abrirModal(item);
    this.menuAbertoId.set(null);
  }

  /**
   * Remove um ativo do sistema após confirmação do usuário.
   */
  excluir(id: number) {
    if (confirm('Deseja realmente remover este ativo do inventário da Lumen Apex?')) {
      this.inventarioService.removerItem(id);
      this.menuAbertoId.set(null);
    }
  }

  private limparFormulario() {
    this.novoAtivo = this.getFormInicial();
  }

  resetarInventario() {
  if (confirm('Atenção: Isso apagará todas as alterações locais e restaurará os dados originais do JSON. Deseja continuar?')) {
    // Chamamos o método que limpa o storage e recarrega o JSON
    this.inventarioService.resetarParaPadrao(); 
  }
}

  /**
   * Retorna o estado inicial do formulário para novos cadastros.
   */
  private getFormInicial() {
    return {
      id: null as number | null,
      nome: '',
      modelo: '',
      status: 'Disponível' as 'Disponível' | 'Alocado' | 'Manutenção',
      categoria: 'Hardware'
    };
  }
}