import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from '../schemas/user.schema';

export class UpdateDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEnum(RolesEnum)
  readonly role: RolesEnum;

  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;
}
