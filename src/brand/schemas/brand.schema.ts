import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
