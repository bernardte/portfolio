import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(20, {
    message: 'Name cannot be more than $constraint1 characters',
  })
  name!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Subject is required' })
  @MaxLength(100, {
    message: 'Subject cannot be more than $constraint1 characters',
  })
  subject!: string;

  @IsString()
  @MinLength(1, { message: 'Message is required' })
  @MaxLength(500, {
    message: 'Message cannot be more than $constraint1 characters',
  })
  message!: string;
}
