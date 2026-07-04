import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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