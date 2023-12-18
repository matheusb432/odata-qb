export type ODataFilter = {
    [key: string]: ODataFilterData;
};
export type ODataFilterData = ODataFilterValue | ODataFilterOperation[];
type ODataFilterOperation = [ODataOperators.AsRaw, string] | [ODataOperators, ODataFilterValue | ODataFilterValue[]] | [ODataOperators, ODataFilterValue | ODataFilterValue[], ODataOperators.Or];
export type ODataFilterValue = string | number | Date | Guid | boolean | undefined | null;
export type ODataOrderBy = [string | string[], 'asc' | 'desc'];
export declare enum ODataOperators {
    EqualTo = 0,
    NotEqualTo = 1,
    GreaterThan = 2,
    GreaterThanOrEqualTo = 3,
    LessThan = 4,
    LessThanOrEqualTo = 5,
    And = 6,
    Or = 7,
    Not = 8,
    In = 9,
    Contains = 10,
    AsRaw = 11,
    BetweenInclusive = 12
}
export declare const odataOperators: {
    readonly 0: "eq";
    readonly 1: "ne";
    readonly 2: "gt";
    readonly 3: "ge";
    readonly 4: "lt";
    readonly 5: "le";
    readonly 6: "and";
    readonly 7: "or";
    readonly 8: "not";
    readonly 10: "contains";
    readonly 9: "in";
};
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
export declare class Guid {
    private _inner;
    get inner(): string;
    constructor(guid: string);
}
export {};
