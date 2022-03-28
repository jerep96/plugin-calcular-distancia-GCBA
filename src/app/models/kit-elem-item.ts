export class KitElemItem {
  constructor(
    public kitId: number,
    public kitSku: string,
    public kitName: string,
    public elementId: number,
    public elementSku: string,
    public elementName: string,
    public quantity: number
  ) { }

  public static adapt(item: any): KitElemItem {
    return new KitElemItem(
      item.kit_id,
      item.kit_sku,
      item.kit_name,
      item.element_id,
      item.element_sku,
      item.element_name,
      item.quantity
    );
  }
}
