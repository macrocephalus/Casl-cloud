import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class QueryTasksDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minPercentageUsed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxPercentageUsed?: number;
}
