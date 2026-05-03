import { ChangeDetectionStrategy, Component, inject, computed, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; // Importado para fazer o "Ver Chamados" funcionar
import { InventarioService } from '../../services/inventario.service';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: true, // Adicionado standalone caso seu projeto siga este padrão
  imports: [FormsModule, StatusBadgeComponent], 
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  private router = inject(Router); // Injetando o roteador

  carregando = signal(true);
  modalAberto = signal(false);

  // Sinal para monitorar os chamados salvos no localStorage
  private storageKey = 'lumen_chamados';
  chamadosLista = signal<any[]>([]);

  novoAtivo = {
    id: 0, 
    nome: '',
    modelo: '',
    status: 'Disponível' as 'Disponível' | 'Alocado' | 'Manutenção', 
    categoria: 'Hardware'
  };

  // Computeds do Inventário
  inventario = computed(() => this.inventarioService.items());
  totalItens = computed(() => this.inventarioService.items().length);
  
  emManutencao = computed(() => 
    this.inventarioService.items().filter(i => i.status === 'Manutenção').length
  );

  disponiveis = computed(() => 
    this.inventarioService.items().filter(i => i.status === 'Disponível').length
  );

  // NOVO: Computed para o Card de Chamados
  // Isso fará o número no dashboard atualizar conforme os dados do localStorage
  totalChamadosAbertos = computed(() => 
    this.chamadosLista().filter(c => c.status !== 'Disponível').length
  );

  ngOnInit() {
    this.carregarChamados();
    setTimeout(() => {
      this.carregando.set(false);
    }, 1200);
  }

  // Carrega os dados para o dashboard exibir o número correto
  carregarChamados() {
    const dados = localStorage.getItem(this.storageKey);
    if (dados) {
      this.chamadosLista.set(JSON.parse(dados));
    }
  }

  // Função para o botão "Ver Chamados"
  verChamados() {
    this.router.navigate(['/chamados']);
  }

  abrirModal() {
    this.modalAberto.set(true);
  }

  fecharModal() {
    this.modalAberto.set(false);
    this.limparFormulario();
  }

  salvarAtivo() {
    // Melhorado: se o ID for 0, podemos gerar um baseado no timestamp para não repetir
    if (this.novoAtivo.nome) {
      if (this.novoAtivo.id === 0) {
        this.novoAtivo.id = Date.now();
      }
      this.inventarioService.adicionarItem({ ...this.novoAtivo });
      this.fecharModal();
    }
  }

  private limparFormulario() {
    this.novoAtivo = {
      id: 0,
      nome: '',
      modelo: '',
      status: 'Disponível' as 'Disponível' | 'Alocado' | 'Manutenção',
      categoria: 'Hardware'
    };
  }
}