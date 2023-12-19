export type ODataFilter = {
  [key: string]: ODataFilterData;
};

export type ODataFilterData = ODataFilterValue | ODataFilterOperation[];

/**
 * @summary
 * ODataFilterOperation is a tuple of 2 or 3 elements, or a single value
 *
 * The first element is the operator, the second is the value, and the optional third is the join operator.
 *
 * By default, the join operator is `and`, and the operation without an operator is `eq`.
 *
 * @example
 * {
 *  name: [ODataOperators.EqualTo, 'John'] // name eq 'John'
 *  address: 'John' // address eq 'John'
 *  age: [[ODataOperators.GreaterThanOrEqualTo, 20]] // age ge 20
 * }
 */
type ODataFilterOperation =
  | [ODataFilterTypes.Raw, string]
  | [ODataFilterTypes.NestedFilter, ODataFilter]
  | [ODataOperators, ODataFilterValue | ODataFilterValue[]]
  | [ODataOperators, ODataFilterValue | ODataFilterValue[], ODataOperators.Or];

export type ODataFilterValue = string | number | Date | Guid | boolean | undefined | null;
export type ODataOrderBy = [string | string[], 'asc' | 'desc'];
export enum ODataFilterTypes {
  Raw = 1001,
  NestedFilter = 1002,
}
export enum ODataOperators {
  EqualTo = 1,
  NotEqualTo = 2,
  GreaterThan = 3,
  GreaterThanOrEqualTo = 4,
  LessThan = 5,
  LessThanOrEqualTo = 6,
  And = 7,
  Or = 8,
  Not = 9,
  In = 10,
  Contains = 11,
  StartsWith = 12,
  EndsWith = 13,
  BetweenInclusive = 14,
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
