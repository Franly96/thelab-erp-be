import { UserType } from '../user.model';

export class CreateUserDto {
  fullName!: string;
  password!: string;
  userType: UserType;
}
