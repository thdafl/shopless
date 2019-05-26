import { SelectQueryBuilder } from 'typeorm';
import { PaginationArgs } from './args/Pagination';
import { ClassType, ObjectType, Field, Int } from 'type-graphql';

export const paginate = async <TE, TP extends PaginationArgs>(
  builder: SelectQueryBuilder<TE>,
  options: TP,
  callback: (b: typeof builder) => typeof builder = b => b
): Promise<{total: number, items: TE[]} & TP> => {
  const [list, count] = await callback(builder.skip(options.skip).take(options.take)).getManyAndCount()

  return {
    total: count,
    items: list,
    ...options
  }
}

export function Paginated<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(type => Int)
    // @ts-ignore
    total: number;

    @Field(type => [TItemClass])
    // @ts-ignore
    items: TItem[];

    @Field(type => Int)
    // @ts-ignore
    offset: number

    @Field(type => Int)
    // @ts-ignore
    limit: number
  }
  return PaginatedResponseClass;
}
