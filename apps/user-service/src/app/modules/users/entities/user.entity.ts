import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { RolesEntity } from './roles.entity';
import { IsEmail, IsStrongPassword } from 'class-validator';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Exclude()
  @Column()
  @IsStrongPassword()
  password: string;

  @ManyToOne(() => RolesEntity, (role) => role.users, { nullable: false })
  role: number;

  @Column({ default: false })
  status: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
