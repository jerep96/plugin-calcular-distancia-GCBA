import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { ItemCategory } from '../models/item-category';
import { KitElemItem } from '../models/kit-elem-item';
import { Order, Origin } from '../models/order';
import { OrderItem } from '../models/order-item';
import { PriceListItem } from '../models/price-list-item';
import { PriceType } from '../models/price-type';
import { isDevMode } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class OsfService {
  private _products = new BehaviorSubject<OrderItem[]>([]);
  private _blocos = new BehaviorSubject<any>({bloques:""});
  private _categories = new BehaviorSubject<ItemCategory[]>([]);
  private _prices = new BehaviorSubject<PriceListItem[]>([]);
  private _kitElems = new BehaviorSubject<KitElemItem[]>([]);
  private _hasMaintenance = new BehaviorSubject<Boolean>(false);
  private _priceTypes = new BehaviorSubject<PriceType>({ p1: "", p2: "", p3: "" });
  private _readOnly = new BehaviorSubject<Boolean>(true);
  private dataStore: {
    items: OrderItem[],
    prices: PriceListItem[],
    categories: ItemCategory[],
    kits: KitElemItem[]
  } = { items: [], prices: [], categories: [], kits: [] };

  get orderItems(): Observable<OrderItem[]> {
    return this._products.asObservable();
  }
  get blocos(): Observable<any[]> {
    return this._blocos.asObservable();
  }

  get priceList(): Observable<PriceListItem[]> {
    return this._prices.asObservable();
  }

  get categoryList(): Observable<ItemCategory[]> {
    return this._categories.asObservable();
  }

  get kitElemList(): Observable<KitElemItem[]> {
    return this._kitElems.asObservable();
  }

  get hasMaintenance(): Observable<Boolean> {
    return this._hasMaintenance.asObservable();
  }

  get priceTypes(): Observable<PriceType> {
    return this._priceTypes.asObservable();
  }

  get readOnly(): Observable<Boolean> {
    return this._readOnly.asObservable();
  }

  /**
   * Ads a new ITEM or SERVICIO to the order.
   */
  create(data: any) {
    let product = this.dataStore.prices.find(prod => prod.sku == data.product);

    if (!product) throw new Error('No se encontró el producto.');

    let item = new OrderItem(
      product.sku,
      NaN,
      product.productId,
      product.name,
      data.priceTypeName,
      Origin.OFS,
      0,
      data.quantity,
      data.price,
      data.discount,
      data.quantity * data.price,
      data.total,
      0,
      data.commissionable ? 1 : 0,
      data.replacement ? 1 : 0,
      data.replacementLabels
    );

    if (product.isKit()) {
      this.createKit(item);
      return;
    }

    this.dataStore.items.push(item);
    this._products.next(Object.assign({}, this.dataStore).items);
  }

  /**
   * Ads a new KIT to the order.
   */
  createKit(data: OrderItem) {
    let kitItems = this.dataStore.kits.reduce((accum: OrderItem[], kitPart: KitElemItem) => {
      if (kitPart.kitSku != data.sku) return accum;
      let newItem = new OrderItem(kitPart.elementSku, NaN, kitPart.elementId, kitPart.elementName, data.itemPriceType, data.source, 0, kitPart.quantity, 0, 0, 0, 0, 0, data.commissionable, 0, "");
      newItem.parentSequence = data.sequence;
      accum.push(newItem);
      return accum;
    }, []);
    //agrego al papa y los hijos
    this.dataStore.items = this.dataStore.items.concat(data, kitItems);
    this._products.next(Object.assign({}, this.dataStore).items);
  }

  update(item: OrderItem) {
    let i = 0;
    let encontro = false;
    while (!encontro && i < this.dataStore.items.length) {
      if (this.dataStore.items[i].sequence == item.sequence) {
        encontro = true;
        break;
      }
      i++;
    }
    if (!encontro) return;
    this.dataStore.items[i] = item;
    this.dataStore.items.forEach(elem => { //si tiene hijos los actualizamos
      if (elem.parentSequence == item.sequence) {
        elem.commissionable = item.commissionable;
        elem.quantityInstalled = (item.quantityInstalled == 0) ? 0 : elem.quantityToInstall;
      }
    });
    this._products.next(Object.assign({}, this.dataStore).items);
  }

  remove(item: OrderItem) {
    this.dataStore.items = this.dataStore.items.filter(elem => ((elem.sequence != item.sequence) && (elem.parentSequence != item.sequence)));
    this._products.next(Object.assign({}, this.dataStore).items);
  }

  //OFS RELATED LOGIC
  message: any;

  constructor() {
    fromEvent(window, 'message').subscribe((event: any) => {
      this.getPostMessageData(event);
    });
    this.sendOkMessage();
  }

  //My Stuff
  pluginOpen(message: any) {
    console.log('Mensaje', message);

    this.message = message;
    let activityStr = JSON.parse(message.activity.ul_os_json.replace(/'/g, '"'))
    console.log('primer parser', activityStr)
    let activity = JSON.stringify(activityStr)
    activity = JSON.parse(activity)
    this._blocos.next(activity);
    console.log('Actividad', activity)
    /**this.dataStore.items = activity.order.items;
    this.dataStore.prices = activity.prices;
    this.dataStore.categories = activity.categories;
    this.dataStore.kits = activity.kitElems;
    this._products.next(Object.assign({}, this.dataStore).items);
    this._prices.next(Object.assign({}, this.dataStore).prices);
    this._categories.next(Object.assign({}, this.dataStore).categories);
    this._kitElems.next(Object.assign({}, this.dataStore).kits);
    this._hasMaintenance.next(activity.hasMaintenance);
    this._priceTypes.next(activity.priceTypes);
    this._readOnly.next(activity.readOnly);**/
  }

  close() {
    let messsageData = {
      apiVersion: 1,
      method: 'close'
    };

    this.sendPostMessageData(messsageData);
  }

  save(_bloqueData:any) {
    console.log('Save bloque', _bloqueData)
    //let formatoOfs = []
    //formatoOfs.push(_bloqueData)
    let messsageData = this.message;
    messsageData.method = 'close';
    //let total = this.dataStore.items.reduce((acc, item) => acc + item.totalInstalled, 0);
    //let order = new Order(total, this.dataStore.items);
    messsageData.activity.ul_os_json = JSON.stringify(_bloqueData).replace(/"/g, "'");
    console.log('A enviar',messsageData);
    this.sendPostMessageData(messsageData);
  }


  //STUFF REQUIRED TO GET THE MESSAGE FROM OFS
  debugMode: boolean = isDevMode();

  sendOkMessage() {
    let messsageData = {
      apiVersion: 1,
      method: 'ready'
    };

    this.sendPostMessageData(messsageData);
  }

  sendPostMessageData(data: any) {
    if (document.referrer !== '') {
      this.log(window.location.host + ' -> ' + data.method + ' ' + this.getDomain(document.referrer), JSON.stringify(data, null, 4));

      parent.postMessage(JSON.stringify(data), this.getOrigin(document.referrer));
    }
  }

  getPostMessageData(event: any) {
    if (typeof event.data !== 'undefined') {
      if (this.isJson(event.data)) {
        var data = JSON.parse(event.data);

        if (data.method) {
          this.log(window.location.host + ' <- ' + data.method + ' ' + this.getDomain(event.origin), JSON.stringify(data, null, 4));

          switch (data.method) {
            case 'open':
              this.pluginOpen(data);

              break;
            case 'error':
              data.errors = data.errors || { error: 'Unknown error' };
              this.showError(data.errors);

              break;
            default:
              alert('Unknown method');

              break;
          }
        }
        else {
          this.log(window.location.host + ' <- NO METHOD ' + this.getDomain(event.origin), null, null, true);
        }
      }
      else {
        this.log(window.location.host + ' <- NOT JSON ' + this.getDomain(event.origin), null, null, true);
      }
    }
    else {
      this.log(window.location.host + ' <- NO DATA ' + this.getDomain(event.origin), null, null, true);
    }
  }

  isJson(str: string) {
    try {
      JSON.parse(str);
    }
    catch (e) {
      return false;
    }
    return true;
  }

  getOrigin(url: any) {
    if (url != '') {
      if (url.indexOf("://") > -1) {
        return 'https://' + url.split('/')[2];
      }
      else {
        return 'https://' + url.split('/')[0];
      }
    }

    return '';
  }

  getDomain(url: any) {
    if (url != '') {
      if (url.indexOf("://") > -1) {
        return url.split('/')[2];
      }
      else {
        return url.split('/')[0];
      }
    }

    return '';
  }

  showError(errorData: any) {
    alert(JSON.stringify(errorData, null, 4));
  }

  log(title: any, data: any, color?: any, warning?: any) {
    if (!this.debugMode) {
      return;
    }
    if (!color) {
      color = '#0066FF';
    }
    if (!!data) {
      console.groupCollapsed('%c[Plugin API] ' + title, 'color: ' + color + '; ' + (!!warning ? 'font-weight: bold;' : 'font-weight: normal;'));
      console.log('[Plugin API] ' + data);
      console.groupEnd();
    }
    else {
      console.log('%c[Plugin API] ' + title, 'color: ' + color + '; ' + (!!warning ? 'font-weight: bold;' : ''));
    }
  }
}
