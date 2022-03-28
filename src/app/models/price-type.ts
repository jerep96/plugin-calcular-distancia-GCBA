export class PriceType {
  constructor(
    public p1: string,
    public p2: string,
    public p3: string,
  ) { }

  public static adapt(item: any) {
    return new PriceType(
      item.p1,
      item.p2,
      item.p3,
    );
  }
}
