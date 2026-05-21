import { IsString, IsEnum, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { TicketStatus, TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ enum: TicketPriority }) @IsEnum(TicketPriority) priority: TicketPriority;
  @ApiProperty() @IsUUID() customerId: string;
}

export class UpdateTicketDto {
  @ApiPropertyOptional() @IsString() @IsOptional() title?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional({ enum: TicketStatus }) @IsEnum(TicketStatus) @IsOptional() status?: TicketStatus;
  @ApiPropertyOptional({ enum: TicketPriority }) @IsEnum(TicketPriority) @IsOptional() priority?: TicketPriority;
  @ApiPropertyOptional() @IsUUID() @IsOptional() assignedToId?: string;
}

export class AddCommentDto {
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isInternal?: boolean;
}

export class TicketFilterDto {
  @ApiPropertyOptional() @IsOptional() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() limit?: number = 10;
  @ApiPropertyOptional({ enum: TicketStatus }) @IsEnum(TicketStatus) @IsOptional() status?: TicketStatus;
  @ApiPropertyOptional({ enum: TicketPriority }) @IsEnum(TicketPriority) @IsOptional() priority?: TicketPriority;
  @ApiPropertyOptional() @IsOptional() customerId?: string;
  @ApiPropertyOptional() @IsOptional() assignedToId?: string;
  @ApiPropertyOptional() @IsOptional() search?: string;
}
