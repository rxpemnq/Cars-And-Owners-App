import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name field cannot be empty' })
  @IsString({ message: 'Name should only be a string' })
  name: string

  @MinLength(8, { message: 'Minimal lenght of password is 8 symbols' })
  @MaxLength(24, { message: 'Maximum lenght of password is 24 symbols' })
  @IsNotEmpty({ message: 'Password field cannot be empty' })
  password: string

  @IsNotEmpty({ message: 'Phone field cannot be empty' })
  @IsPhoneNumber('RU', { message: 'Phone should only be a string' })
  phone: string

  @IsNotEmpty({ message: 'Email field cannot be empty' })
  @IsEmail({}, { message: 'Email should only be a string' })
  email: string
}
