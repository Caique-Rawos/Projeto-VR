import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  desc: string;

  @Column()
  custo: number;
}
