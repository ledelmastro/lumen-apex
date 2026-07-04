import { ChangeDetectionStrategy, Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { Item } from '../../models/item';

@Component({
  selector: 'app-relatorios',
  imports: [CommonModule, FormsModule, SummaryCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './relatorios.component.html'
})
export class Relatorios implements OnInit {
  private inventarioService = inject(InventarioService);

  // Controle de carregamento
  carregando = signal(true);

  // 1. CORREÇÃO TS2339: Adicionando o signal items() que o HTML pede
  items = computed(() => this.inventarioService.items());
  
  // Signal para o total de itens (já usado no seu card)
  totalItens = computed(() => this.items().length);

  // 2. CORREÇÃO TS2339: Adicionando valorTotal()
  // Aqui você pode definir um valor fixo ou calcular baseado em alguma propriedade do item
  valorTotal = computed(() => {
    // Exemplo: se cada item tivesse um preço, você somaria aqui. 
    // Por enquanto, vamos retornar um valor base multiplicado pelo total para o relatório da Lumen
    return this.items().length * 1500; 
  });

  ngOnInit() {
    // Simula o tempo de resposta do servidor da Lumen Tecnologia
    setTimeout(() => this.carregando.set(false), 1000);
  }

  exportarPDF() {
    // Simulação de exportação ou abertura de diálogo de impressão
    window.print();
  }

  atualizarDados() {
    this.carregando.set(true);
    // Simula uma nova busca de dados no InventarioService
    setTimeout(() => {
      this.carregando.set(false);
    }, 800);
  }
}