import { ArrayMinSize, IsEnum, IsInt, IsNotEmpty, Max, Min, ValidateIf, ValidateNested } from 'class-validator';
import { OrderType, PaymentMethod } from '../enums.js';
import { Type } from 'class-transformer';

export class OrderItemDTO {
  @IsInt()
  @Min(1)
  product_id!: number;

  @IsInt()
  @Min(1)
  @Max(50)
  quantity!: number;
}

export class CreateOrderDTO {
  @IsInt()
  @Min(1)
  branch_id!: number;

  @IsEnum(OrderType)
  order_type!: OrderType;

  @ValidateIf((o: CreateOrderDTO) => o.order_type === OrderType.DELIVERY)
  @IsNotEmpty({ message: 'customer_address_id is required when order_type is delivery' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customer_address_id!: number;

  @IsEnum(PaymentMethod)
  payment_method!: PaymentMethod;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items!: OrderItemDTO[];
}
