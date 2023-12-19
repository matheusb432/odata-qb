import { odataQb } from '../src';
import { ODataFilterType, ODataOp } from '../src/types';

const result = odataQb.params({
  filter: {
    _0: [
      [
        ODataFilterType.NestedFilter, // (
        {
          name: [ODataOp.Eq, 'John', ODataOp.Or], // (name eq 'John')
          houseId: [ODataOp.In, [10, 20, 30]], // or (houseId in (10,20,30))
        },
      ],
    ], // )
    email: [ODataOp.EndsWith, 'gmail.com'], // and endswith(email, 'gmail.com')
    _1: [
      [
        ODataFilterType.NestedFilter, // (
        {
          age: 30, // (age eq 30)
          address: [ODataOp.Contains, 'NYC'], // and contains(address, 'NYC')
        },
      ], // )
    ],
  },
});

// ? $filter=((name eq 'John') or (houseId in (10,20,30))) and endswith(email, 'gmail.com') and ((age eq 30) and contains(address, 'NYC'))
console.log(result);
