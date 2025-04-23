import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  comment?: string;
}
