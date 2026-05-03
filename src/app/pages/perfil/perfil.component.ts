import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil.component.html'
})
export class PerfilComponent {
  theme = inject(ThemeService);
  private router = inject(Router);

  // Dados do Usuário (Simulando persistência)
  usuario = signal({
    nome: 'Admin Lumen',
    empresa: 'Lumen Tecnologia',
    email: 'contato@lumentecnologia.com.br',
    cargo: 'Desenvolvedor Senior / IT Lead'
  });

  // Preferências
  notificacoesEmail = signal(true);
  autoSave = signal(true);

  salvarAlteracoes() {
    // Aqui você poderia salvar no LocalStorage
    alert('Configurações da Lumen atualizadas com sucesso!');
  }

  resetarSistema() {
    if (confirm('Isso limpará as preferências locais. Continuar?')) {
      localStorage.clear();
      window.location.reload();
    }
  }

  sair() {
    // Como não há login, redirecionamos para o Dashboard ou uma tela inicial
    this.router.navigate(['/painel']);
  }
}