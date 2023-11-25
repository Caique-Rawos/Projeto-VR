export class ProductModel {
  public id: number;
  public desc: string;
  public price: number;
  public image: string;

  constructor() {}

  ProductModel(desc: string, price: number, image: string) {
    this.desc = desc;
    this.price = price;
    this.image = image;
  }

  ProductModelId(id: number) {
    this.id = id;
  }
}
