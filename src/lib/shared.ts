export interface PaginationParams {
  limit: string;
  page: string;
}

export interface PaginatedEndpointResponse<T> {
  data: T[];
  totalCount: number;
}
