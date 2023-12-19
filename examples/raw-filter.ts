import { ODataFilterType, ODataOp, odataOps, odataQb } from '../src';

const result = odataQb.params({
  filter: {
    users: [ODataFilterType.Raw, `/any(w: w/age ${odataOps[ODataOp.Ge]} 20)`],
  },
  orderBy: ['name', 'asc'],
});

// ? $filter=(users/any(w: w/age ge 20))&$orderby=name asc
console.log(result);
