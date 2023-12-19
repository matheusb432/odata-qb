import { odataQb } from '../src';
import { ODataFilterType, ODataOp } from '../src/types';
const result = odataQb.params({
  filter: {
    _0: [
      [
        ODataFilterType.NestedFilter,
        {
          name: [ODataOp.Eq, 'John', ODataOp.Or],
          houseId: [ODataOp.In, [10, 20, 30]],
        },
      ],
    ],
    email: [ODataOp.EndsWith, 'gmail.com'],
    _1: [
      [
        ODataFilterType.NestedFilter,
        {
          age: 30,
          address: [ODataOp.Contains, 'NYC'],
        },
      ],
    ],
  },
});

// ? $filter=((name eq 'John') or (houseId in (10,20,30))) and endswith(email, 'gmail.com') and ((age eq 30) and contains(address, 'NYC'))
console.log(result);
