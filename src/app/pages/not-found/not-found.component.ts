import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="text-align: center; padding: 50px;">
      <h1>404 - Página Não Encontrada</h1>
      <p>O recurso que você procura na Lumen Apex não existe.</p>
      <a routerLink="/dashboard">Voltar para o Início</a>
    </div>
  `
})
export class NotFoundComponent {}