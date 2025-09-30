const LIMIT_DEFAULT = 20;
const PAGE_DEFAULT = 1;

export interface PaginationParams {
  limit?: string;
  page?: string;
}

export interface PaginatedEndpointResponse<T> {
  data: T[];
  totalCount: number;
}

export const computePaginationParams = ({
  limit = LIMIT_DEFAULT.toString(),
  page = PAGE_DEFAULT.toString(),
}: PaginationParams): { skip: number; take: number; page: number } => {
  const take = parseInt(limit, 10);
  const pageNumber = parseInt(page, 10);
  const skip = (pageNumber - 1) * take;
  return {
    take,
    skip,
    page: pageNumber,
  };
};
