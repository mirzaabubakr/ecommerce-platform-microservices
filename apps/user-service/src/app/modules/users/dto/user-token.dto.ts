import { IsString } from 'class-validator';

export class UserTokenDto {
  @IsString()
  id: string;

  @IsString()
  token: string;
}
