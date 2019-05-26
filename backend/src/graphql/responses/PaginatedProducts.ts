import { ObjectType } from 'type-graphql';

import { Paginated } from '../helper';
import { Product } from '../typeDefs';

@ObjectType()
export class PaginatedProducts extends Paginated(Product) {}
