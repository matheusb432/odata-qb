import { Guid, ODataOperators, odataOperators, } from './types';
import { dateUtil } from './util/date-util';
/**
 * @description
 * Creates a OData URL based on `url` & `options`.
 *
 * @example
 * odataUtil.build('https://website.com', {
 *       filter: { name: 'John', age: [[ODataOperators.LessThanOrEqualTo, 25]] },
 *       orderBy: ['name', 'asc'],
 *     })
 * // Result: "https://website.com?$filter=(name eq 'John') and (age le 25)&$orderby=name asc"
 */
function query(url, options) {
    return builder.url(url, options);
}
function params(options) {
    if (!options)
        return '';
    const queryString = builder.query(options);
    return queryString;
}
export const odataQb = {
    query,
    params,
};
const orSeparator = ` ${odataOperators[ODataOperators.Or]} `;
const andSeparator = ` ${odataOperators[ODataOperators.And]} `;
const builder = {
    url(baseUrl, options) {
        let queryUrl = baseUrl;
        if (options) {
            const queryString = builder.query(options);
            queryUrl += `?${queryString}`;
        }
        return queryUrl;
    },
    mergeUrlToRawParams(url, params) {
        if (!params)
            return url;
        return `${url}?${params}`;
    },
    query(options) {
        let queryStr = '';
        if (options.select)
            queryStr += `$select=${options.select.join(',')}&`;
        if (options.expand)
            queryStr += `$expand=${options.expand.join(',')}&`;
        queryStr += builder.getFilter(options.filter);
        if (options.top != null)
            queryStr += `$top=${options.top}&`;
        if (options.skip != null)
            queryStr += `$skip=${options.skip}&`;
        queryStr += builder.getOrderBy(options.orderBy);
        if (options.count)
            queryStr += `$count=${options.count}&`;
        return queryStr.slice(0, -1);
    },
    filter(filter) {
        let filterStr = '';
        let lastJoinOperator;
        for (const key in filter) {
            const value = filter[key];
            if (value === undefined)
                continue;
            if (!Array.isArray(value)) {
                filterStr += builder.createFilter(key, ODataOperators.EqualTo, value);
                continue;
            }
            for (const [operator, filterValue, joinOperator] of value) {
                let filters;
                if (Array.isArray(filterValue)) {
                    filters = builder.createOrFilters(key, operator, filterValue, joinOperator);
                }
                else {
                    filters = builder.createFilter(key, operator, filterValue, joinOperator);
                }
                if (!filters)
                    continue;
                filterStr += filters;
                lastJoinOperator = joinOperator;
            }
        }
        const separator = lastJoinOperator === ODataOperators.Or ? orSeparator : andSeparator;
        return builder.sliceSeparator(filterStr, separator);
    },
    createOrFilters(key, operator, values, joinOperator = ODataOperators.And) {
        const separator = joinOperator === ODataOperators.Or ? orSeparator : andSeparator;
        if (operator === ODataOperators.BetweenInclusive) {
            if (values.length !== 2) {
                console.error(`BetweenInclusive operator requires exactly 2 values, ${values.length} given.`);
                return '';
            }
            const [start, end] = values;
            return `((${key} ${odataOperators[ODataOperators.GreaterThanOrEqualTo]} ${builder.normalize(start)}) and (${key} ${odataOperators[ODataOperators.LessThanOrEqualTo]} ${builder.normalize(end)}))${separator}`;
        }
        if (operator === ODataOperators.In) {
            const inFilterValue = `(${values.map((x) => builder.normalize(x)).join(',')})`;
            return `(${key} ${odataOperators[ODataOperators.In]} ${inFilterValue})${separator}`;
        }
        let orFilterStr = '';
        for (const value of values) {
            orFilterStr += builder.createFilter(key, operator, value, ODataOperators.Or);
        }
        if (!orFilterStr)
            return '';
        return `(${builder.sliceSeparator(orFilterStr, orSeparator)})${separator}`;
    },
    sliceSeparator(str, separator) {
        return str.slice(0, -separator.length);
    },
    createFilter(key, operator, value, joinOperator = ODataOperators.And) {
        const separator = joinOperator === ODataOperators.Or ? orSeparator : andSeparator;
        if (operator === ODataOperators.AsRaw)
            return `(${key}${value})${separator}`;
        const normalized = builder.normalize(value);
        if (normalized === undefined)
            return '';
        if (operator === ODataOperators.Contains ||
            operator === ODataOperators.StartsWith ||
            operator === ODataOperators.EndsWith) {
            return `${odataOperators[operator]}(${key}, ${normalized})${separator}`;
        }
        const operatorStr = odataOperators[operator];
        if (!operatorStr)
            return '';
        return `(${key} ${operatorStr} ${normalized})${separator}`;
    },
    normalize(value) {
        if (value == null || Number.isNaN(value))
            return undefined;
        if (typeof value === 'string')
            return `'${value}'`;
        if (value instanceof Date)
            return dateUtil.toYyyyMmDd(value);
        if (value instanceof Guid)
            return value.inner;
        return value.toString();
    },
    getFilter(filter) {
        if (!filter)
            return '';
        const filterString = builder.filter(filter);
        return filterString ? `$filter=${filterString}&` : '';
    },
    getOrderBy(orderBy) {
        const orderBys = [];
        builder.pushOrderBy(orderBys, orderBy);
        const orderByString = orderBys.join(',');
        return orderByString ? `$orderby=${orderByString}&` : '';
    },
    pushOrderBy(orderByRes, orderBy) {
        if (!orderBy)
            return;
        if (orderBy[1] === 'asc' || orderBy[1] === 'desc') {
            orderByRes.push(builder.formatNestableItem(orderBy));
            return;
        }
        for (const item of orderBy) {
            orderByRes.push(builder.formatNestableItem(item));
        }
    },
    formatNestableItem(item) {
        return `${Array.isArray(item[0]) ? item[0].join('/') : item[0]} ${item[1]}`;
    },
};
//# sourceMappingURL=odata-qb.js.map