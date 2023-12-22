import {
  ODataGuid,
  ODataFilter,
  ODataFilterType,
  ODataFilterValue,
  ODataOp,
  ODataOptions,
  ODataOrderByOperation,
  odataOps,
  ODataFilterOperation,
} from './types';
import { dateUtil } from './util/date-util';

/**
 * @description
 * Creates a OData URL based on `url` & `options`.
 *
 * @example
 * odataQb.query('https://website.com', {
 *       filter: { name: 'John', age: [ODataOp.Le, 25] },
 *       orderBy: ['name', 'asc'],
 *     })
 * // Result: "https://website.com?$filter=(name eq 'John') and (age le 25)&$orderby=name asc"
 */
function query(url: string, options?: ODataOptions): string {
  return builder.url(url, options);
}

/**
 * @description
 * Creates a OData URL params based on `options`.
 *
 * @example
 * odataQb.params({
 *       filter: { name: 'John', age: [ODataOp.Le, 25] },
 *       orderBy: ['name', 'asc'],
 *     })
 * // Result: "$filter=(name eq 'John') and (age le 25)&$orderby=name asc"
 */
function params(options: ODataOptions): string {
  if (!options) return '';

  const queryString = builder.query(options);

  return queryString;
}

export const odataQb = {
  query,
  params,
};

const orSeparator = ` ${odataOps[ODataOp.Or]} `;
const andSeparator = ` ${odataOps[ODataOp.And]} `;

const builder = {
  url(baseUrl: string, options?: ODataOptions): string {
    let queryUrl = baseUrl;

    if (options) {
      const queryString = builder.query(options);
      queryUrl += `?${queryString}`;
    }

    return queryUrl;
  },
  query(options: ODataOptions): string {
    let queryStr = '';

    if (options.select) queryStr += `$select=${options.select.join(',')}&`;
    if (options.expand) queryStr += `$expand=${options.expand.join(',')}&`;
    queryStr += builder.getFilter(options.filter);
    if (options.top != null) queryStr += `$top=${options.top}&`;
    if (options.skip != null) queryStr += `$skip=${options.skip}&`;
    queryStr += builder.getOrderBy(options.orderBy);
    if (options.count) queryStr += `$count=${options.count}&`;

    return queryStr.slice(0, -1);
  },
  filter(filter: ODataFilter): string {
    let filterStr = '';
    let lastJoinOperator: ODataOp | undefined;

    for (const key in filter) {
      const value = filter[key];
      if (value === undefined) continue;

      if (!Array.isArray(value)) {
        filterStr += builder.createFilter(key, ODataOp.Eq, value);
        lastJoinOperator = undefined;
        continue;
      }

      if (!Array.isArray(value[0])) {
        filterStr += builder.handleFilterOperation(key, value as ODataFilterOperation);
        lastJoinOperator = value[2] as ODataOp.Or | undefined;
        continue;
      }

      for (const operation of value as ODataFilterOperation[]) {
        filterStr += builder.handleFilterOperation(key, operation);
        lastJoinOperator = operation[2];
      }
    }
    const separator = lastJoinOperator === ODataOp.Or ? orSeparator : andSeparator;

    return builder.sliceSeparator(filterStr, separator);
  },
  handleFilterOperation(key: string, operation: ODataFilterOperation): string {
    const [operator, filterValue, joinOperator] = operation;
    const isFilterArray = Array.isArray(filterValue);

    if (
      operator === ODataFilterType.AnyFunction ||
      operator === ODataFilterType.AllFunction
    ) {
      const operatorStr = odataOps[operator];
      const isNestedFilter = !isFilterArray;
      if (isNestedFilter) {
        const resultNestedFilter = builder.filter(
          builder.createFiltersWithModifiedKeys(filterValue)
        );
        return `(${key}/${operatorStr}(x: ${resultNestedFilter}))${andSeparator}`;
      }
      const resultFilter = builder.handleFilterOperation('x', filterValue);
      const resultSeparator = joinOperator === ODataOp.Or ? orSeparator : andSeparator;
      return `(${key}/${operatorStr}(x: ${builder.sliceSeparator(
        resultFilter,
        resultSeparator
      )}))${andSeparator}`;
    }
    if (isFilterArray) {
      return builder.createOrFilters(
        key,
        operator,
        filterValue as ODataFilterValue[],
        joinOperator
      );
    }
    if (operator === ODataFilterType.NestedFilter) {
      return `(${builder.filter(filterValue)})${andSeparator}`;
    }
    return builder.createFilter(
      key,
      operator,
      filterValue as ODataFilterValue,
      joinOperator
    );
  },
  createOrFilters(
    key: string,
    operator: ODataOp | ODataFilterType,
    values: ODataFilterValue[],
    joinOperator: ODataOp.And | ODataOp.Or = ODataOp.And
  ): string {
    const separator = joinOperator === ODataOp.Or ? orSeparator : andSeparator;

    if (operator === ODataFilterType.BetweenInclusive) {
      const [start, end] = values;

      return `((${key} ${odataOps[ODataOp.Ge]} ${builder.normalize(
        start
      )})${andSeparator}(${key} ${odataOps[ODataOp.Le]} ${builder.normalize(
        end
      )}))${separator}`;
    }
    if (operator === ODataFilterType.BetweenExclusive) {
      const [start, end] = values;

      return `((${key} ${odataOps[ODataOp.Gt]} ${builder.normalize(
        start
      )})${andSeparator}(${key} ${odataOps[ODataOp.Lt]} ${builder.normalize(
        end
      )}))${separator}`;
    }

    if (operator === ODataOp.In) {
      const inFilterValue = `(${values.map((x) => builder.normalize(x)).join(',')})`;

      return `(${key} ${odataOps[ODataOp.In]} ${inFilterValue})${separator}`;
    }

    const orFilterStr = values
      .map((value) => builder.createFilter(key, operator, value, ODataOp.Or))
      .join('');
    if (!orFilterStr) return '';

    return `(${builder.sliceSeparator(orFilterStr, orSeparator)})${separator}`;
  },
  sliceSeparator(str: string, separator: string): string {
    return str.slice(0, -separator.length);
  },
  createFilter(
    key: string,
    operator: ODataOp | ODataFilterType,
    value: ODataFilterValue,
    joinOperator: ODataOp.And | ODataOp.Or = ODataOp.And
  ): string {
    const separator = joinOperator === ODataOp.Or ? orSeparator : andSeparator;
    if (operator === ODataFilterType.Raw) return `(${key}${value})${separator}`;

    const normalized = builder.normalize(value);

    if (normalized === undefined) return '';

    if (
      operator === ODataOp.Contains ||
      operator === ODataOp.StartsWith ||
      operator === ODataOp.EndsWith
    ) {
      return `${odataOps[operator]}(${key}, ${normalized})${separator}`;
    }

    const operatorStr = odataOps[operator];
    if (!operatorStr) return '';
    return `(${key} ${operatorStr} ${normalized})${separator}`;
  },
  createFiltersWithModifiedKeys(filters: ODataFilter): ODataFilter {
    const newFilters: ODataFilter = {};
    Object.keys(filters).forEach((key) => {
      newFilters[`x/${key}`] = filters[key];
    });

    return newFilters;
  },
  normalize(val: ODataFilterValue): string | undefined {
    if (val == null || Number.isNaN(val)) return undefined;

    if (typeof val === 'string') return `'${val}'`;
    if (val instanceof Date) return dateUtil.toYyyyMmDd(val);
    if (val instanceof ODataGuid) return val.inner;

    return val.toString();
  },
  getFilter(filter: ODataFilter | undefined): string {
    if (!filter) return '';

    const filterStr = builder.filter(filter);

    return filterStr ? `$filter=${filterStr}&` : '';
  },
  getOrderBy(orderBy: ODataOrderByOperation | ODataOrderByOperation[] | undefined): string {
    if (!orderBy) return '';
    const orderByString = Array.isArray(orderBy[0])
      ? (orderBy as ODataOrderByOperation[]).map((x) => `${x[0]} ${x[1]}`).join(',')
      : `${orderBy[0]} ${orderBy[1]}`;

    return orderByString ? `$orderby=${orderByString}&` : '';
  },
};
