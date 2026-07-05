import { ChangeDetectionStrategy, Component, signal } from '@angular/core'; //todo Importações de hooks e states do Angular
import { RouterOutlet } from '@angular/router'; //todo Diretiva RouterOutlet do Angular
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    SidebarComponent, 
    HeaderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'lumen-apex';
  isMobileMenuOpen = signal(false);

  toggleMobileMenu = () => {
  this.isMobileMenuOpen.update(v => !v);
  }
}