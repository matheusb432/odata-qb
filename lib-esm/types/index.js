export var ODataFilterType;
(function (ODataFilterType) {
    ODataFilterType[ODataFilterType["Raw"] = 1001] = "Raw";
    ODataFilterType[ODataFilterType["NestedFilter"] = 1002] = "NestedFilter";
    ODataFilterType[ODataFilterType["BetweenInclusive"] = 1003] = "BetweenInclusive";
    ODataFilterType[ODataFilterType["BetweenExclusive"] = 1004] = "BetweenExclusive";
})(ODataFilterType || (ODataFilterType = {}));
/**
 * @description
 * OData Operators supported by the query builder
 */
export var ODataOp;
(function (ODataOp) {
    /**
     * @description
     * Equal to operator - 'eq'
     */
    ODataOp[ODataOp["Eq"] = 1] = "Eq";
    /**
     * @description
     * Not equal to operator - 'ne'
     */
    ODataOp[ODataOp["Ne"] = 2] = "Ne";
    /**
     * @description
     * Greater than operator - 'gt'
     */
    ODataOp[ODataOp["Gt"] = 3] = "Gt";
    /**
     * @description
     * Greater than or equal to operator - 'ge'
     */
    ODataOp[ODataOp["Ge"] = 4] = "Ge";
    /**
     * @description
     * Less than operator - 'lt'
     */
    ODataOp[ODataOp["Lt"] = 5] = "Lt";
    /**
     * @description
     * Less than or equal to operator - 'le'
     */
    ODataOp[ODataOp["Le"] = 6] = "Le";
    /**
     * @description
     * Logical AND operator - 'and'
     */
    ODataOp[ODataOp["And"] = 7] = "And";
    /**
     * @description
     * Logical OR operator - 'or'
     */
    ODataOp[ODataOp["Or"] = 8] = "Or";
    /**
     * @description
     * Logical NOT operator - 'not'
     */
    ODataOp[ODataOp["Not"] = 9] = "Not";
    /**
     * @description
     * In operator - 'in'
     */
    ODataOp[ODataOp["In"] = 10] = "In";
    /**
     * @description
     * Contains operator - 'contains'
     */
    ODataOp[ODataOp["Contains"] = 11] = "Contains";
    /**
     * @description
     * Starts with operator - 'startswith'
     */
    ODataOp[ODataOp["StartsWith"] = 12] = "StartsWith";
    /**
     * @description
     * Ends with operator - 'endswith'
     */
    ODataOp[ODataOp["EndsWith"] = 13] = "EndsWith";
})(ODataOp || (ODataOp = {}));
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
export const odataOps = {
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
};
export class ODataGuid {
    get inner() {
        return this._inner;
    }
    constructor(guid) {
        this._inner = guid;
    }
}
//# sourceMappingURL=index.js.map