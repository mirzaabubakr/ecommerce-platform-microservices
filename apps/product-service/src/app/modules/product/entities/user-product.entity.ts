import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class UserProduct {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column('uuid')
  userId: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product: number;
}
