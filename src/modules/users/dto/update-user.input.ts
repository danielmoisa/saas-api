import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  birthDate?: string;
}
