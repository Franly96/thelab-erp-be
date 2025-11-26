import { UserEntity } from '../database/entities/user.entity';
import { UserType } from '../database/enums/user-type.enum';

export type User = UserEntity;
export type PublicUser = Omit<User, 'passwordHash'>;
export { UserType };
