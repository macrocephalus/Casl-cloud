import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly cost: number;

  @IsNotEmpty()
  @Type(() => Date)
  readonly startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  readonly endTime: Date;
}
