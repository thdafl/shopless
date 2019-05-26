import { Int, Field, ArgsType } from 'type-graphql';
import { Min } from "class-validator";

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, {defaultValue: 0})
  @Min(0)
  // @ts-ignore
  offset: number;

  @Field(type => Int)
  @Min(1)
  // @ts-ignore
  limit = 25;

  // helpers - index calculations
  get skip(): number {return this.offset};
  get take(): number {return this.offset + this.limit};
}
