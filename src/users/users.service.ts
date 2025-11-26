import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../core/enums/user-type.enum';
import { UserEntity } from '../core/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword, verifyPassword } from './password.util';
import { PublicUser, User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.usersRepo.find({ order: { id: 'DESC' } });
    return users.map((user) => this.toPublic(user));
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string | null | undefined): Promise<User | null> {
    if (!email) {
      return null;
    }
    return this.usersRepo.findOne({ where: { email } });
  }

  async findByFullName(fullName: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { fullName } });
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const existing = await this.findByFullName(dto.fullName);
    if (existing) {
      throw new ConflictException('Full name already in use');
    }

    const user = this.usersRepo.create({
      email: dto.email ?? null,
      fullName: dto.fullName,
      passwordHash: hashPassword(dto.password),
      type: dto.type ?? UserType.Service,
    });

    const saved = await this.usersRepo.save(user);
    return this.toPublic(saved);
  }

  async update(id: number, dto: UpdateUserDto): Promise<PublicUser> {
    const existing = await this.findById(id);

    if (dto.email !== undefined && dto.email !== existing.email) {
      const emailOwner = await this.findByEmail(dto.email);
      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException('Email already in use');
      }
      existing.email = dto.email ?? null;
    }

    if (dto.fullName) {
      existing.fullName = dto.fullName;
    }
    if (dto.password) {
      existing.passwordHash = hashPassword(dto.password);
    }
    if (dto.type !== undefined) {
      existing.type = dto.type;
    }

    const saved = await this.usersRepo.save(existing);
    return this.toPublic(saved);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepo.remove(user);
  }

  async validateCredentials(
    fullName: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByFullName(fullName);
    if (!user) {
      return null;
    }
    return verifyPassword(password, user.passwordHash) ? user : null;
  }

  private toPublic(user: User): PublicUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
