import { odataQb } from '../src';
import { ODataOp } from '../src/types';

const result = odataQb.params({
  filter: { name: 'John', age: [ODataOp.Ge, 20] },
  orderBy: [
    ['nested/prop/test', 'asc'],
    ['title', 'asc'],
    ['city/date', 'desc'],
  ],
});

// ? $filter=(name eq 'John') and (age ge 20)&$orderby=nested/prop/test asc,title asc,city/date desc
console.log(result);
