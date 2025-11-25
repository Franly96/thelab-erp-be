export class CreateUserDto {
  email?: string | null;
  fullName!: string;
  password!: string;
}
