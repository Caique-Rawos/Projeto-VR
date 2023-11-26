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
  price: number;

  @Column({ name: 'imagem', type: 'bytea', nullable: true })
  image: string;

  constructor(desc: string, price: number) {
    this.desc = desc;
    this.price = price;
  }
}
