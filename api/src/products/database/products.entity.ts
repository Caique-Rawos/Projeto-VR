import { ProductStoreEntity } from '../../product-store/database/productStore.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'produto' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 60, nullable: false })
  desc: string;

  @Column({
    name: 'custo',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: true,
  })
  price: number;

  @Column({ name: 'imagem', type: 'bytea', nullable: true })
  image: string;

  @OneToMany(() => ProductStoreEntity, (productStore) => productStore.product, {
    cascade: true,
  })
  productStores?: ProductStoreEntity[];

  constructor(desc: string, price: number, image: string) {
    this.desc = desc;
    this.price = price;
    this.image = image;
  }
}
