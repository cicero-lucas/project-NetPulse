import { IsNumber, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

export class CreateMetricDto {
  @ApiProperty() @IsUUID() customerId: string;
  @ApiProperty() @IsNumber() latency: number;
  @ApiProperty() @IsNumber() uptime: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() packetLoss?: number;
  @ApiProperty() @IsNumber() downloadSpeed: number;
  @ApiProperty() @IsNumber() uploadSpeed: number;
  @ApiPropertyOptional({ enum: ServiceStatus }) @IsEnum(ServiceStatus) @IsOptional() status?: ServiceStatus;
}
