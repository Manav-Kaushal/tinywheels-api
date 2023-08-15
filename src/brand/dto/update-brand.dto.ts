import { IsEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly fullName: string;

  @IsOptional()
  @IsString()
  readonly country: string;

  @IsOptional()
  @IsString()
  readonly yearFounded: string;

  @IsOptional()
  readonly logo: string;

  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly user: User;
}
