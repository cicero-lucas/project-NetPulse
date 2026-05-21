import { IsString, IsEnum, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentSeverity } from '@prisma/client';

export class CreateIncidentDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ enum: IncidentSeverity }) @IsEnum(IncidentSeverity) severity: IncidentSeverity;
  @ApiPropertyOptional() @IsUUID() @IsOptional() customerId?: string;
  @ApiPropertyOptional({ type: [String] }) @IsArray() @IsOptional() affectedServices?: string[];
}

export class IncidentFilterDto {
  @ApiPropertyOptional() @IsOptional() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() limit?: number = 10;
  @ApiPropertyOptional({ enum: IncidentSeverity }) @IsEnum(IncidentSeverity) @IsOptional() severity?: IncidentSeverity;
  @ApiPropertyOptional() @IsOptional() isResolved?: boolean;
}
