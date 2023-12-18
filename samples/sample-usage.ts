import { odataQb } from '../src';
import { ODataOperators } from '../src/types';
const result = odataQb.query('https://example.com', {
  filter: { name: 'John', age: [[ODataOperators.GreaterThanOrEqualTo, 20]] },
  orderBy: ['name', 'asc'],
});

const expectedParams = {
  filter: "$filter=(name eq 'John') and (age ge 20)",
  orderBy: '$orderby=name asc',
};

console.log(result);
