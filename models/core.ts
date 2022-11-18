export interface IPaginate {
  page?: number;
  page_size?: number;
}

export interface ISort<T extends string> {
  sort_by?: T;
  sort_order?: 'asc' | 'desc';
}

export interface IPaginateResult<T extends object> {
  results: T[];
  total: number;
}
