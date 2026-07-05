import { Routes } from '@angular/router'; //todo Gestão de Rotas do Angular 
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { Inventario } from './pages/inventario/inventario';
import { Relatorios } from './pages/relatorios/relatorios.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { Portfolio } from './pages/portfolio/portfolio';
import { Chamados } from './pages/chamados/chamados';

export const routes: Routes = [
  { path: 'painel', component: DashboardComponent },
  { path: 'portfolio', component: Portfolio },
  { path: 'chamados', component: Chamados },
  { path: 'inventario', component: Inventario },
  { path: 'relatorios', component: Relatorios },
  { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: '', redirectTo: '/painel', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];