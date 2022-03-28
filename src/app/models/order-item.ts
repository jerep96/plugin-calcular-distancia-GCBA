export class OrderItem {
  constructor(
    public sku: string,
    public itemId: number,
    public productId: number,
    public name: string,
    public itemPriceType: string,
    public source: string,
    public quantityInstalled: number,
    public quantityToInstall: number,
    public unitPrice: number,
    public bonusPrice: number,
    public subtotal: number,
    public total: number,
    public totalInstalled: number,
    public commissionable: number,
    public replacement: number,
    public replacementLabels: string,
    public sequence?: number, //"id" intereno del plugin
    public parentSequence?: number, //referencia al id "secuence" del padre en el plugin
    public parentItemId?: number, //referencia al itemID en complemento
  ) {
    if (!sequence) this.sequence = OrderItem.generateSequence();
  }

  public updateInstalledQuantity(newQuantity: number) {
    if (this.bonusPrice > 0 && newQuantity > 0 && newQuantity < this.quantityToInstall)
      throw new InvalidQuantityError("Orden con descuento no puede tener cantidad instalada menor mayor a 0 y menor a cantidad a instalar");
    this.quantityInstalled = newQuantity;
    this.totalInstalled = OrderItem.calcTotal(this.unitPrice, this.quantityInstalled, this.bonusPrice);
    if (this.totalInstalled < 0) this.totalInstalled = 0;
  }

  public static calcTotal(price: number, quantity: number, discount: number) {
    return price * quantity - discount;
  }

  public static adapt(item: any) {
    return new OrderItem(
      item.sku,
      item.item_id, //puede ser nulo
      item.product_id,
      item.name,
      item.item_price_type,
      item.source,
      item.quantity_installed ? item.quantity_installed : 0,
      item.quantity_toinstall,
      Number.parseFloat(item.unit_price),
      Number.parseFloat(item.bonus_price),
      Number.parseFloat(item.subtotal),
      Number.parseFloat(item.total),
      item.total_installed ? Number.parseFloat(item.total_installed) : 0,
      item.commissionable,
      item.replacement,
      item.replacement_labels,
      item.sequence, //puede venir nulo pero en el plugin le tengo que generar uno
      item.parent_sequence, //podria ser nulo sin drama
      item.parent_item_id, //podria ser nulo sin drama
    );
  }

  public static generateSequence() {
    return Math.floor(Math.random() * 18900); //usé un numero cualquiera para no usar uuid
  }

  public toOfsJson(): Object {
    return {
      sku: this.sku,
      item_id: this.itemId ? this.itemId : null,
      product_id: this.productId,
      name: this.name,
      item_price_type: this.itemPriceType,
      source: this.source,
      quantity_installed: this.quantityInstalled,
      quantity_toinstall: this.quantityToInstall,
      unit_price: this.unitPrice,
      bonus_price: this.bonusPrice,
      subtotal: this.subtotal,
      total: this.total,
      total_installed: this.totalInstalled,
      commissionable: this.commissionable,
      replacement: this.replacement,
      replacement_labels: this.replacement ? this.replacementLabels : null,
      sequence: this.sequence,
      parent_sequence: this.parentSequence ? this.parentSequence : null,
      parent_item_id: this.parentItemId ? this.parentItemId : null,
    };
  }
}

export class InvalidQuantityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidQuantityError";
  }
}
