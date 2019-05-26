import { SelectQueryBuilder } from 'typeorm';
import { PaginationArgs } from './args/Pagination';

export const paginate = <TE, TP extends PaginationArgs>(
  builder: SelectQueryBuilder<TE>,
  options: TP
) => builder.skip(options.skip).take(options.take)
