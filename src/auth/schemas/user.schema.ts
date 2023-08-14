import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RolesEnum {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DEVELOPER = 'developer',
  TEAM = 'team',
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: RolesEnum, default: RolesEnum.CUSTOMER })
  role: RolesEnum;

  @Prop({ default: true })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
