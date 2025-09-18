export interface IPaginationParams {
  limit: string;
  page: string;
}

export interface IPaginatedEndpointResponse<T> {
  data: T[];
  totalCount: number;
}
