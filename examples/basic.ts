import { odataQb, ODataOp, ODataOptions } from '../src';

const options: ODataOptions = {
  filter: {
    name: 'John', // name eq 'John'
    age: [ODataOp.Ge, 20], // and (age ge 20)
  },
  orderBy: ['name', 'asc'], // &$orderby=name asc
};
const result = odataQb.query('https://example.com', options);
const resultParamsOnly = odataQb.params(options);

// ? https://example.com?$filter=(name eq 'John') and (age ge 20)&$orderby=name asc
console.log(result);
// ? $filter=(name eq 'John') and (age ge 20)&$orderby=name asc
console.log(resultParamsOnly);
