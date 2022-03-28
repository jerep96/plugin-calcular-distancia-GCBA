import { OrderItem } from "./order-item";

export enum Origin {
  CRM = "CRM",
  OFS = "OFS"
}

export class Order {
  constructor(
    public total: number,
    public items: OrderItem[],
  ) { }

  public static adapt(item: any): Order {
    let items = item.dispositivos.map(OrderItem.adapt);
    Order.updateKitItemParents(items);
    return new Order(
      item.total,
      items,
    );
  }

  public toOfsJson(): Object {
    return {
      total: this.total,
      dispositivos: this.items.map(elem => elem.toOfsJson())
    };
  }

  private static updateKitItemParents(items: OrderItem[]) {
    let children = items.filter(elem => ((elem.parentItemId != null) && (elem.parentItemId != undefined)));
    children.forEach(elem => {
      if (elem.parentSequence) return;
      let parent = items.find(i => i.itemId == elem.parentItemId);
      if (parent) elem.parentSequence = parent.sequence;
    });
  }
}
