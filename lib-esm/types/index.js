export var ODataOperators;
(function (ODataOperators) {
    ODataOperators[ODataOperators["EqualTo"] = 0] = "EqualTo";
    ODataOperators[ODataOperators["NotEqualTo"] = 1] = "NotEqualTo";
    ODataOperators[ODataOperators["GreaterThan"] = 2] = "GreaterThan";
    ODataOperators[ODataOperators["GreaterThanOrEqualTo"] = 3] = "GreaterThanOrEqualTo";
    ODataOperators[ODataOperators["LessThan"] = 4] = "LessThan";
    ODataOperators[ODataOperators["LessThanOrEqualTo"] = 5] = "LessThanOrEqualTo";
    ODataOperators[ODataOperators["And"] = 6] = "And";
    ODataOperators[ODataOperators["Or"] = 7] = "Or";
    ODataOperators[ODataOperators["Not"] = 8] = "Not";
    ODataOperators[ODataOperators["In"] = 9] = "In";
    ODataOperators[ODataOperators["Contains"] = 10] = "Contains";
    ODataOperators[ODataOperators["AsRaw"] = 11] = "AsRaw";
    ODataOperators[ODataOperators["BetweenInclusive"] = 12] = "BetweenInclusive";
})(ODataOperators || (ODataOperators = {}));
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
    [ODataOperators.In]: 'in',
};
export class Guid {
    get inner() {
        return this._inner;
    }
    constructor(guid) {
        this._inner = guid;
    }
}
//# sourceMappingURL=index.js.map