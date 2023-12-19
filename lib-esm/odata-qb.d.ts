import { ODataOptions } from './types';
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
declare function query(url: string, options?: ODataOptions): string;
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
declare function params(options: ODataOptions): string;
export declare const odataQb: {
    query: typeof query;
    params: typeof params;
};
export {};
