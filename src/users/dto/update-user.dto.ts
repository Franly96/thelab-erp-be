import { UserType } from '../../core/enums/user-type.enum';

export class UpdateUserDto {
  email?: string | null;
  fullName?: string;
  password?: string;
  type?: UserType;
}
