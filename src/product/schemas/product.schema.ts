import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export enum ProductCategory {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  COUPE = 'Coupe',
  HATCHBACK = 'Hatchback',
  CONVERTIBLE = 'Convertible',
  MINIVAN = 'Minivan',
  PICKUP_TRUCK = 'Pickup Truck',
  CROSSOVER = 'Crossover',
  SPORTS_CAR = 'Sports Car',
  ELECTRIC_CAR = 'Electric Car',
  LUXURY_CAR = 'Luxury Car',
  WAGON = 'Wagon',
  HYBRID_CAR = 'Hybrid Car',
  MICROCAR = 'Microcar',
  CLASSIC_CAR = 'Classic Car',
}

export enum ModelScales {
  ONETOTWELVE = '1:12',
  ONETOEIGHTEEN = '1:18',
  ONETOTWENTYFOUR = '1:24',
  ONETOTHIRTYTWO = '1:32',
  ONETOTHIRTYSIX = '1:36',
  ONETOFOURTYTHREE = '1:43',
  ONETOSIXTYFOUR = '1:64',
  ONETOSEVENTYSIX = '1:76',
  ONETOEIGHTYSEVEN = '1:87',
}

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop()
  title: string;

  @Prop({ unique: [true, 'The slug must be unique.'] })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  body: string;

  @Prop()
  thumbnail: string;

  @Prop()
  category: ProductCategory;

  @Prop({ type: Types.ObjectId, ref: 'Brand' })
  brand: Types.ObjectId;

  @Prop()
  sku: string;

  @Prop({ enum: ModelScales })
  scale: ModelScales;

  @Prop()
  material: string;

  @Prop()
  color: string;

  @Prop()
  additionalColors: string;

  @Prop()
  isFeatured: boolean;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  stockQuantity: number;

  @Prop()
  images: string[];

  @Prop({ type: { length: String, width: String, height: String }, _id: false })
  dimensions: { length: string; width: string; height: string };

  @Prop({ type: { value: Number, unit: String }, _id: false })
  weight: { value: number; unit: string };

  @Prop({
    type: { title: String, description: String, keywords: String },
    _id: false,
  })
  meta: { title: string; description: string; keywords: string };

  @Prop()
  tags: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
