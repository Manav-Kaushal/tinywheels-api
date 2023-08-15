import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly fullName: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly yearFounded: string;

  readonly logo: string;

  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly user: User;
}
