import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Origin } from './models/order';
import { OrderItem } from './models/order-item';
import { OsfService } from './services/osf.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sourceInicial = Origin.CRM;
  sourceAdicionales = Origin.OFS;

  constructor(private osf: OsfService) { }

  get sumInstalled() {
    return this.osf.orderItems.pipe(
      map((items: OrderItem[]) => items.reduce((acc, value) => acc + value.totalInstalled, 0)),
    );
  }

  get hasMaintenance() {
    return this.osf.hasMaintenance;
  }

  get readOnlyMode() {
    return this.osf.readOnly;
  }

  close() {
    this.osf.close();
  }

}
