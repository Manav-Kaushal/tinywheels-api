import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Brand {
  @Prop()
  name: string;

  @Prop()
  fullName: string;

  @Prop()
  country: string;

  @Prop()
  yearFounded: string;

  @Prop()
  logo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
