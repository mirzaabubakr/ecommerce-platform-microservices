import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RolesEntity } from './entities/roles.entity';
import { instanceToPlain } from 'class-transformer';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UserTokenDto } from './dto';
dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { SALT_ROUNDS } = process.env;
      const { role, password } = createUserDto;

      createUserDto.role = !role ? 2 : role;
      const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
      createUserDto.password = hashedPassword;

      const user = this.userRepository.create(instanceToPlain(createUserDto));
      await this.userRepository.save(user);

      delete user.password;

      return { status: HttpStatus.CREATED, message: 'User Registered', user };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.findUserEmail(email);
    return { status: HttpStatus.OK, user };
  }

  async findUserById(id: string) {
    const user = await this.findUserId(id);
    return { status: HttpStatus.OK, user };
  }

  async findAll() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.password', 'role.name'])
      .leftJoin('user.role', 'role')
      .orderBy('user.id', 'DESC')
      .getMany();
    return { status: 200, users };
  }

  async findUserEmail(email: string) {
    const user = await this.userRepository.findOne({
      relations: ['role'],
      where: { email: email },
    });
    if (user) {
      return user;
    }
    return null;
  }

  async findUserId(id: string) {
    const user = await this.userRepository.findOne({
      relations: ['role'],
      where: { id: id },
    });
    if (user) {
      return user;
    }
    return null;
  }

  async updateToken(userTokenDto: UserTokenDto) {
    const { token, id } = userTokenDto;
    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ refreshToken: token })
      .where('id = :id', { id: id })
      .execute();
    return HttpStatus.CREATED;
  }

  async createDefaultRoles() {
    const defaultRoles = ['ADMIN', 'USER'];

    for (const roleName of defaultRoles) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: roleName },
      });
      if (!existingRole) {
        const role = this.rolesRepository.create({ name: roleName });
        await this.rolesRepository.save(role);
      }
    }
  }
}
