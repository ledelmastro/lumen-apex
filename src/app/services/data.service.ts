import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  // Simulando dados do inventário da Lumen Tecnologia
  private inventorySource = new BehaviorSubject<any[]>([
    { id: 1, nome: 'Servidor Dell R740', status: 'Ativo' },
    { id: 2, nome: 'Switch Cisco 24p', status: 'Manutenção' },
    { id: 3, nome: 'Workstation Edit', status: 'Ativo' }
  ]);
  
  currentInventory = this.inventorySource.asObservable();

  updateInventory(data: any[]) {
    this.inventorySource.next(data);
  }
}