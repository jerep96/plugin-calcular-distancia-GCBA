import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class PesosProxyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol'
    }).format(Number(value));
  }

}
