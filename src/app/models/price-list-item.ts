export enum ProductTypes {
  SERVICIO = "SERVICIO",
  ITEM = "ITEM",
  KIT = "KIT"
}

export class PriceListItem {
  constructor(
    public productId: number,
    public sku: string,
    public name: string,
    public producType: ProductTypes,
    public productCategory: string,
    public p1: number | null,
    public p2: number | null,
    public p3: number | null,
  ) { }

  public isKit(): boolean {
    return this.producType == ProductTypes.KIT;
  }

  public static adapt(item: any): PriceListItem {
    return new PriceListItem(
      item.product_id,
      item.sku,
      item.name,
      <ProductTypes>(item.product_type).toUpperCase(),
      item.product_category,
      isNaN(item.p1) ? null : item.p1,
      isNaN(item.p2) ? null : item.p2,
      isNaN(item.p3) ? null : item.p3,
    );
  }
}
