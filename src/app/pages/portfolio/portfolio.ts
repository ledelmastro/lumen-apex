import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent, StatusBadgeComponent],
  templateUrl: './portfolio.html'
})
export class Portfolio implements OnInit {
  // Uso de Signals para reatividade conforme requisitos
  projetos = signal<any[]>([]);

  ngOnInit() {
    // Simulação de carregamento de dados do JSON
    this.projetos.set([
      { nome: 'Plataforma Digital Lumen', categoria: 'Web / Gestão', status: 'Concluído' },
      { nome: 'Sistema Lumen-Apex', categoria: 'Desenvolvimento Frontend', status: 'Em Produção' },
      { nome: 'Migração de Infraestrutura Hostgator', categoria: 'IT Infrastructure', status: 'Concluído' },
      { nome: 'E-commerce com Mercado Pago', categoria: 'WooCommerce', status: 'Concluído' }
    ]);
  }
}