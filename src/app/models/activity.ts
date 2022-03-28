import { ItemCategory } from "./item-category"
import { KitElemItem } from "./kit-elem-item"
import { Order } from "./order"
import { PriceListItem } from "./price-list-item"
import { PriceType } from "./price-type"

export enum Status {
  STARTED = "started",
  PENDING = "pending",
  CLOSED = "completed",
}

export class Activity {
  constructor(
    public order: Order,
    public categories: ItemCategory[],
    public prices: PriceListItem[],
    public kitElems: KitElemItem[],
    public hasMaintenance: boolean,
    public priceTypes: PriceType,
    public readOnly: boolean,
  ) { }

  public static adapt(item: any) {
    let order = Order.adapt(JSON.parse(item.adicionales_json));
    let priceList1 = (item.listaPrecios_json) ? JSON.parse(item.listaPrecios_json).map(PriceListItem.adapt) : [];
    let priceList2 = (item.listaPrecios2_json) ? JSON.parse(item.listaPrecios2_json).map(PriceListItem.adapt) : [];
    let priceList3 = (item.listaPrecios3_json) ? JSON.parse(item.listaPrecios3_json).map(PriceListItem.adapt) : [];
    let categoryList = JSON.parse(item.categoriasProducto_json).map(ItemCategory.adapt);
    let kitElem1 = (item.elementosKits_json) ? JSON.parse(item.elementosKits_json).map(KitElemItem.adapt) : [];
    let kitElem2 = (item.elementosKits2_json) ? JSON.parse(item.elementosKits2_json).map(KitElemItem.adapt) : [];
    let kitElem3 = (item.elementosKits3_json) ? JSON.parse(item.elementosKits3_json).map(KitElemItem.adapt) : [];
    let maintenance = item.tiene_mantenimiento;
    let priceTypes = PriceType.adapt(JSON.parse(item.tipos_tarifas));
    let status = item.astatus;
    return new Activity(
      order,
      categoryList,
      priceList1.concat(priceList2, priceList3),
      kitElem1.concat(kitElem2, kitElem3),
      maintenance == "S",
      priceTypes,
      status != Status.STARTED
    );
  }
}
