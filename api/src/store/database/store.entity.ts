import { ProductStoreEntity } from '../../product-store/database/productStore.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'loja' })
export class StoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'descricao', type: 'varchar', length: 60, nullable: false })
  desc: string;

  @OneToMany(() => ProductStoreEntity, (productStore) => productStore.store)
  productStores: ProductStoreEntity[];

  constructor(desc: string) {
    this.desc = desc;
  }
}
