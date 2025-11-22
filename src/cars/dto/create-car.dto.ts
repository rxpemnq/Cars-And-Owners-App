import { IsString, IsInt, IsNotEmpty } from 'class-validator'

export class CreateCarDto {
  @IsNotEmpty({ message: 'Brand field cannot be empty' })
  @IsString({ message: 'Brand should only be a string' })
  brand: string

  @IsNotEmpty({ message: 'Model field cannot be empty' })
  @IsString({ message: 'Model should only be a string' })
  model: string

  @IsNotEmpty({ message: 'Year of production field cannot be empty' })
  @IsInt({ message: 'Year of production should only be an integer' })
  productionYear: number
}
