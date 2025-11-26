import { UserType } from '../user.model';

export class UpdateUserDto {
  fullName?: string;
  password?: string;
  userType?: UserType;
}
