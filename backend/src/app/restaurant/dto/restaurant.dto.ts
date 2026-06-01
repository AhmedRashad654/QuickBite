import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RestaurantStatus } from '../enums.js';

export class CreateRestaurantDTO {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsString()
  @MinLength(1)
  primary_country!: string;
}

export class UpdateRestaurantDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  primary_country?: string;
}

export class CreateRestaurantWithOwnerDTO {
  @IsDefined({ message: 'owner object must be provided' })
  @ValidateNested()
  @Type(() => CreateRestaurantOwnerDTO)
  owner!: CreateRestaurantOwnerDTO;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsString()
  @IsNotEmpty()
  primary_country!: string;
}

export class CreateRestaurantOwnerDTO {
  @IsEmail()
  email!: string;

  @MinLength(10)
  @MaxLength(11)
  phone!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password is not strong enough. It must contain at least 8 characters, one uppercase letter, one lowercase letter, one number.',
    },
  )
  password!: string;
}

export class UpdateRestaurantStatusDTO {
  @IsEnum(RestaurantStatus)
  status!: RestaurantStatus;
}
