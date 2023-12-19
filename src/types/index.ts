export type ODataFilter = {
  [key: string]: ODataFilterData;
};

export type ODataFilterData =
  | ODataFilterValue
  | ODataFilterOperation
  | ODataFilterOperation[];

/**
 * @description
 * ODataFilterOperation is a tuple of 2 or 3 elements, or a single value
 *
 * The first element is the operator, the second is the value, and the optional third is the join operator.
 *
 * By default, the join operator is `and`, and the operation without an operator is `eq`.
 *
 * @example
 * {
 *  name: [ODataOp.Eq, 'John'] // name eq 'John'
 *  address: 'John' // address eq 'John'
 *  age: [[ODataOp.Ge, 20]] // age ge 20
 * }
 */
export type ODataFilterOperation =
  | [ODataFilterType.Raw, string]
  | [ODataFilterType.NestedFilter, ODataFilter]
  | [
      ODataFilterType.BetweenInclusive | ODataFilterType.BetweenExclusive,
      [ODataFilterValue, ODataFilterValue]
    ]
  | [
      ODataFilterType.BetweenInclusive | ODataFilterType.BetweenExclusive,
      [ODataFilterValue, ODataFilterValue],
      ODataOp.Or
    ]
  | [ODataOp, ODataFilterValue | ODataFilterValue[]]
  | [ODataOp, ODataFilterValue | ODataFilterValue[], ODataOp.Or];

export type ODataFilterValue =
  | string
  | number
  | Date
  | ODataGuid
  | boolean
  | undefined
  | null;
export type ODataOrderByOperation = [string, 'asc' | 'desc'];

export enum ODataFilterType {
  Raw = 1001,
  NestedFilter = 1002,
  BetweenInclusive = 1003,
  BetweenExclusive = 1004,
}
/**
 * @description
 * OData Operators supported by the query builder
 */
export enum ODataOp {
  /**
   * @description
   * Equal to operator - 'eq'
   */
  Eq = 1,
  /**
   * @description
   * Not equal to operator - 'ne'
   */
  Ne = 2,
  /**
   * @description
   * Greater than operator - 'gt'
   */
  Gt = 3,
  /**
   * @description
   * Greater than or equal to operator - 'ge'
   */
  Ge = 4,
  /**
   * @description
   * Less than operator - 'lt'
   */
  Lt = 5,
  /**
   * @description
   * Less than or equal to operator - 'le'
   */
  Le = 6,
  /**
   * @description
   * Logical AND operator - 'and'
   */
  And = 7,
  /**
   * @description
   * Logical OR operator - 'or'
   */
  Or = 8,
  /**
   * @description
   * Logical NOT operator - 'not'
   */
  Not = 9,
  /**
   * @description
   * In operator - 'in'
   */
  In = 10,
  /**
   * @description
   * Contains operator - 'contains'
   */
  Contains = 11,
  /**
   * @description
   * Starts with operator - 'startswith'
   */
  StartsWith = 12,
  /**
   * @description
   * Ends with operator - 'endswith'
   */
  EndsWith = 13,
}
/**
 * @description
 * String representation of the operators supported by the query builder
 *
 * Can be useful for building raw filters
 *
 * @example
 * `/any(w: w/age ${odataOps[ODataOp.GreaterThanOrEqualTo]} 20)`
 * // '/any(w: w/age ge 20)
 */
export const odataOps: Record<ODataOp, string> = {
  [ODataOp.Eq]: 'eq',
  [ODataOp.Ne]: 'ne',
  [ODataOp.Gt]: 'gt',
  [ODataOp.Ge]: 'ge',
  [ODataOp.Lt]: 'lt',
  [ODataOp.Le]: 'le',
  [ODataOp.And]: 'and',
  [ODataOp.Or]: 'or',
  [ODataOp.Not]: 'not',
  [ODataOp.In]: 'in',
  [ODataOp.Contains]: 'contains',
  [ODataOp.StartsWith]: 'startswith',
  [ODataOp.EndsWith]: 'endswith',
} as const;

/**
 * @description
 * OData options supported by the query builder
 * @example
 * {
 *  select: ['name', 'age'], // $select=name,age
 *  filter : { name: 'John', age: [ODataOp.Ge, 20] }, // $filter=(name eq 'John') and (age ge 20)
 *  orderBy: ['name', 'asc'], // $orderby=name asc
 * }
 * // $select=name,age&$filter=(name eq 'John') and (age ge 20)&$orderby=name asc
 */
export type ODataOptions = {
  select?: string[];
  expand?: string[];
  filter?: ODataFilter;
  top?: number;
  skip?: number;
  orderBy?: ODataOrderByOperation | ODataOrderByOperation[];
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

export class ODataGuid {
  private _inner: string;

  get inner(): string {
    return this._inner;
  }

  constructor(guid: string) {
    this._inner = guid;
  }
}
