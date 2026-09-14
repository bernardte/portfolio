import { IsEmail, IsFQDN, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { EmailPasswordDto } from './email-password.dto';
import { Transform } from 'class-transformer';

export class RegisterDto extends EmailPasswordDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Name is required!' })
  @IsString({ message: 'Name must be string!' })
  @MinLength(3, {
    message: 'Name must be at least $constraint1 characters long',
  })
  @MaxLength(50, { message: 'Name cannot exceed than $constraint1 characters' })
  name!: string;
}
