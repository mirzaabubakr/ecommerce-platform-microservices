import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { UserEntity } from './user.entity';

@Entity()
export class RolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['ADMIN', 'USER'], default: 'USER' })
  @IsString()
  name: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
