import { IsString, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsInt()
  userId: number;
}
