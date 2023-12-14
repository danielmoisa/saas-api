import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { TaskLabel, TaskPriority, TaskStatus } from '@prisma/client';

registerEnumType(TaskStatus, { name: 'TaskStatus' });
registerEnumType(TaskPriority, { name: 'TaskPriority' });
registerEnumType(TaskLabel, { name: 'TaskLabel' });

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field(() => TaskLabel)
  label: TaskLabel;
}
