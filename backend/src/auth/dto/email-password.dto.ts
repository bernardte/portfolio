import { IsEmail, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class EmailPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, {
    message: 'Password must be at least $constraint1 characters long',
  })
  @MaxLength(100, {
    message: 'Password cannot exceed $constraint1 characters',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  password!: string;
}