import { StoreEntity } from './store.entity';
import { ProductsEntity } from './products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'produtoloja' })
export class ProductStoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'precovenda',
    type: 'numeric',
    precision: 13,
    scale: 3,
    nullable: true,
  })
  sell: number;

  @Column({
    name: 'idproduto',
    type: 'int',
    nullable: false,
  })
  idProduct: number;

  @Column({
    name: 'idloja',
    type: 'int',
    nullable: false,
  })
  idStore: number;

  @ManyToOne(() => ProductsEntity, (product) => product.productStores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idproduto' })
  product: ProductsEntity;

  @ManyToOne(() => StoreEntity, (store) => store.productStores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idloja' })
  store: StoreEntity;

  constructor(sell: number, idproduct: number, idStore: number) {
    this.sell = sell;
    this.idProduct = idproduct;
    this.idStore = idStore;
  }
}
