export type ODataFilter = {
  [key: string]: ODataFilterData;
};

export type ODataFilterData = ODataFilterValue | ODataFilterOperation[];

type ODataFilterOperation =
  | [ODataOperators.AsRaw, string]
  | [ODataOperators, ODataFilterValue | ODataFilterValue[]]
  | [ODataOperators, ODataFilterValue | ODataFilterValue[], ODataOperators.Or];

export type ODataFilterValue = string | number | Date | Guid | boolean | undefined | null;
export type ODataOrderBy = [string | string[], 'asc' | 'desc'];
export enum ODataOperators {
  EqualTo,
  NotEqualTo,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  And,
  Or,
  Not,
  In,
  Contains,
  StartsWith,
  EndsWith,
  AsRaw,
  BetweenInclusive,
}
export const odataOperators = {
  [ODataOperators.EqualTo]: 'eq',
  [ODataOperators.NotEqualTo]: 'ne',
  [ODataOperators.GreaterThan]: 'gt',
  [ODataOperators.GreaterThanOrEqualTo]: 'ge',
  [ODataOperators.LessThan]: 'lt',
  [ODataOperators.LessThanOrEqualTo]: 'le',
  [ODataOperators.And]: 'and',
  [ODataOperators.Or]: 'or',
  [ODataOperators.Not]: 'not',
  [ODataOperators.Contains]: 'contains',
  [ODataOperators.StartsWith]: 'startswith',
  [ODataOperators.EndsWith]: 'endswith',
  [ODataOperators.In]: 'in',
} as const;

export type ODataOptions = {
  select?: string[];
  expand?: string[];
  filter?: ODataFilter;
  top?: number;
  skip?: number;
  orderBy?: ODataOrderBy | ODataOrderBy[];
  count?: boolean;
};

export type ODataParams = Partial<{
  $select: string;
  $expand: string;
  $filter: string;
  $top: string;
  $skip: string;
  $orderby: string;
  $count: string;
}>;

export class Guid {
  private _inner: string;

  get inner(): string {
    return this._inner;
  }

  constructor(guid: string) {
    this._inner = guid;
  }
}
