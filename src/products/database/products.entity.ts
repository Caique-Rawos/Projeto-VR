import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'produto' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', length: 60, nullable: false })
  desc: string;

  @Column({
    name: 'custo',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: false,
  })
  custo: number;

  @Column({ name: 'imagem', type: 'bytea', nullable: true })
  imagem: string;

  constructor() {}

  ProductsEntity(desc: string, price: number) {
    this.desc = desc;
    this.custo = price;
  }

  ProductsEntityId(id: number) {
    this.id = id;
  }
}
