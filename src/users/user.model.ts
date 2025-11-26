import { UserType } from '../core/enums/user-type.enum';
import { UserEntity } from '../core/entities/user.entity';

export type User = UserEntity;
export type PublicUser = Omit<User, 'passwordHash'>;
export { UserType };
