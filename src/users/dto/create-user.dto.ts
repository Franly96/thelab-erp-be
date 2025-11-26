import { UserType } from '../../core/enums/user-type.enum';

export class CreateUserDto {
  email?: string | null;
  fullName!: string;
  password!: string;
  type?: UserType;
}
