import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsNotEmpty()
  @IsNumber()
  readonly taskId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @IsNotEmpty()
  @Type(() => Date)
  readonly startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  readonly endTime: Date;
}
