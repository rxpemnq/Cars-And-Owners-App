import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email field cannot be empty' })
  @IsEmail({}, { message: 'Email should only be a string' })
  email: string

  @MinLength(8, { message: 'Minimal lenght of password is 8 symbols' })
  @MaxLength(24, { message: 'Maximum lenght of password is 24 symbols' })
  @IsNotEmpty({ message: 'Password field cannot be empty' })
  password: string
}
