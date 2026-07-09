import { FilterParams, PaginationParams } from './cursor-pagination.js';

export function parsePaginationQuery(query: Record<string, any>, allowedSortBy: string[]): PaginationParams {
  let sortBy = query.sortBy as string;

  if (!sortBy || !allowedSortBy?.includes(sortBy)) {
    sortBy = 'created_at';
  }

  const parsedLimit = Number(query.limit);
  const limit = isNaN(parsedLimit) ? 10 : Math.min(1000, Math.max(1, parsedLimit));

  return {
    cursor: query.cursor as string,
    limit,
    sortBy,
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  };
}
// filter
// GET /api/users?filter[status][eq]=active&filter[age][gte]=25&filter[age][lte]=40&filter[id][in]=1,2,3
// {
//     filter: {
//         age: { gte: '25', lte: '40' },
//         status: { eq: 'active' },
//        id: { in: '1,2,3' }
//     }
// }

export function parseFilters(query: Record<string, any>, allowedFields: string[]): FilterParams[] {
  const filter = query.filter;
  if (!filter || typeof filter !== 'object') return [];

  const allowedOps = new Set(['eq', 'gt', 'lt', 'gte', 'lte', 'like', 'in']);

  return allowedFields.flatMap((field) => {
    const fieldFilters = filter[field];
    if (!fieldFilters || typeof fieldFilters !== 'object') return [];

    return Object.entries(fieldFilters)
      .filter(([op]) => allowedOps.has(op))
      .map(([operator, value]) => ({
        field,
        operator: operator as FilterParams['operator'],
        value: value as string | string[],
      }));
  });
}
