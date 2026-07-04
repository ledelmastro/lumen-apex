import { ChangeDetectionStrategy, Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../services/inventario.service';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-relatorios',
  imports: [SummaryCardComponent, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-8">
      <header>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Relatórios de Ativos</h2>
        <p class="text-slate-500">Métricas detalhadas do inventário Lumen.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-summary-card label="Disponibilidade da Frota" value="94%" iconBg="bg-green-50 text-green-600">
           <svg icon class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </app-summary-card>
        
        <app-summary-card label="Valor Total de Ativos" value="R$ 142k" iconBg="bg-blue-50 text-blue-600">
           <svg icon class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </app-summary-card>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">Listagem Detalhada para Auditoria</h3>
        <div class="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800" aria-label="Tabela de Relatório">
            <thead class="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Equipamento</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Categoria</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status Atual</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              @for (item of items(); track item.id) {
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                    {{ item.nome }} <span class="text-xs text-slate-400 ml-1">#{{ item.id }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{{ item.categoria }}</td>
                  <td class="px-6 py-4">
                    <app-status-badge [status]="item.status"></app-status-badge>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="3" class="px-6 py-10 text-center text-slate-500 italic">Carregando dados ou inventário vazio...</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class Relatorios {
  private inventarioService = inject(InventarioService);
  
  // Signals esperados pelo template
  carregando = signal(false);
  items = computed(() => this.inventarioService.items());
  totalItens = computed(() => this.items().length);
  valorTotal = computed(() => this.items().length * 1500); // Valor fictício para o relatório

  exportarPDF() { window.print(); }
  atualizarDados() { this.carregando.set(true); setTimeout(() => this.carregando.set(false), 800); }
}