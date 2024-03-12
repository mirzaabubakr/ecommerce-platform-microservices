// product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProduct } from './user-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  ProductID: number;

  @Column()
  ProductName: string;

  @Column()
  Price: number;

  @OneToMany(() => UserProduct, (user) => user.product)
  product: UserProduct[];
}
