import { UserEntity } from '../core/entities/user.entity';

export type User = UserEntity;
export type PublicUser = Omit<User, 'passwordHash'>;
