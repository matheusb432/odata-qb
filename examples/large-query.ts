const date = new Date(2023, 4, 1);
const guidStr = '64fd1ec3-1d41-ee11-9d4a-86afca43b09d';
import { ODataGuid, ODataOp, odataQb } from '../src';

const result = odataQb.query('https://example.com', {
  filter: {
    name: 'John',
    city: [ODataOp.Eq, 'New York', ODataOp.Or],
    age: undefined,
    someProp: [ODataOp.Ge, [20, 30, 40]],
    anotherProp: [
      [ODataOp.Ge, 50],
      [ODataOp.Le, 100],
    ],
    guidProp: [ODataOp.Gt, new ODataGuid(guidStr)],
    'yetAnotherProp/its/nested': date,
    lastName: [ODataOp.Contains, undefined],
  },
  orderBy: [
    ['nested/prop/test', 'asc'],
    ['title', 'asc'],
    ['city/date', 'desc'],
  ],
  count: true,
  skip: 30,
  top: 10,
});

// ? https://example.com?$filter=(name eq 'John') and (city eq 'New York') or ((someProp ge 20) or (someProp ge 30) or (someProp ge 40)) and (anotherProp ge 50) and (anotherProp le 100) and (guidProp gt 64fd1ec3-1d41-ee11-9d4a-86afca43b09d) and (yetAnotherProp/its/nested eq 2023-05-01)&$top=10&$skip=30&$orderby=nested/prop/test asc,title asc,city/date desc&$count=true
console.log(result);
