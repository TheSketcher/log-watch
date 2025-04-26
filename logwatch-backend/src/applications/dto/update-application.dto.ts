import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['Active', 'Paused'])
  status?: 'Active' | 'Paused';

  @IsOptional()
  @IsInt()
  @Min(1)
  logRetentionDays?: number; // add this
}
