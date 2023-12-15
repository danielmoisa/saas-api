import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Auth {
  @Field({
    nullable: true,
  })
  token: string;

  @Field()
  user: User;
}
