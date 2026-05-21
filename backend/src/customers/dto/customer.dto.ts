import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ServiceStatus, PlanType } from '@prisma/client';

export class CreateCustomerDto {
  @ApiProperty() @IsUUID() userId: string;
  @ApiProperty() @IsString() document: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty() @IsString() address: string;
  @ApiProperty() @IsString() city: string;
  @ApiProperty() @IsString() state: string;
  @ApiProperty() @IsString() zipCode: string;
  @ApiProperty() @IsUUID() planId: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiPropertyOptional({ enum: ServiceStatus }) @IsEnum(ServiceStatus) @IsOptional() serviceStatus?: ServiceStatus;
}

export class CreatePlanDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ enum: PlanType }) @IsEnum(PlanType) type: PlanType;
  @ApiProperty() downloadSpeed: number;
  @ApiProperty() uploadSpeed: number;
  @ApiProperty() price: number;
  @ApiPropertyOptional() @IsOptional() slaHours?: number;
}

export class CustomerFilterDto {
  @ApiPropertyOptional() @IsOptional() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() limit?: number = 10;
  @ApiPropertyOptional() @IsOptional() search?: string;
  @ApiPropertyOptional({ enum: ServiceStatus }) @IsEnum(ServiceStatus) @IsOptional() status?: ServiceStatus;
}
