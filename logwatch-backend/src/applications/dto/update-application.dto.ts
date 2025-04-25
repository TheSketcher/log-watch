import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['Active', 'Paused'])
  status?: 'Active' | 'Paused';
}
