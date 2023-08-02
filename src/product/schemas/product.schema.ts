import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum CarCategory {
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

@Schema({
  timestamps: true,
})
export class Car {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  category: CarCategory;

  @Prop()
  brand: string;

  @Prop()
  countryOfOrigin: string;

  @Prop()
  modelNumber: string;

  @Prop()
  scale: string;

  @Prop()
  material: string;

  @Prop()
  color: string;

  @Prop({ type: [String] })
  additionalColors: string[];

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  stockQuantity: number;

  @Prop({ type: [{ url: String, altText: String }] })
  images: { url: string; altText: string }[];

  @Prop({ type: { length: String, width: String, height: String } })
  dimensions: { length: string; width: string; height: string };

  @Prop({ type: { value: Number, unit: String } })
  weight: { value: number; unit: string };

  @Prop({
    type: {
      freeShipping: Boolean,
      shippingCountries: [String],
      estimatedDelivery: String,
      returnPolicy: String,
    },
  })
  shippingInfo: {
    freeShipping: boolean;
    shippingCountries: string[];
    estimatedDelivery: string;
    returnPolicy: string;
  };

  @Prop({ type: [String] })
  tags: string[];
}

export const CarSchema = SchemaFactory.createForClass(Car);
