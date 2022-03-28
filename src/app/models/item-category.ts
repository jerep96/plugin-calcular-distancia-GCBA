export class ItemCategory {
  constructor(
    public id: number,
    public category: string,
    public code: string,
    public label: string,
  ) { }

  public static adapt(item: any): ItemCategory {
    return new ItemCategory(
      item.id,
      item.category,
      item.code,
      item.label_es
    );
  }
}
