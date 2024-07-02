export interface ResponseJson<T = unknown> {
  readonly code: number;
  readonly msg: string;
  readonly data: T;
  //   readonly traceId: string;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}
