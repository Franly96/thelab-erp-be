import { UserEntity } from '../core/database/entities/user.entity';

export type User = UserEntity;
export type PublicUser = Omit<User, 'passwordHash'>;
