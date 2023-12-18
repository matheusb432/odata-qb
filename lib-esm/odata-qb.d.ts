import { ODataOptions } from './types';
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
declare function query(url: string, options?: ODataOptions): string;
declare function params(options: ODataOptions): string;
export declare const odataUtil: {
    query: typeof query;
    params: typeof params;
};
export {};
