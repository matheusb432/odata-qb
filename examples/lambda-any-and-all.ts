import { ODataFilterType, ODataOp, odataQb } from '../src';

const result = odataQb.params({
  filter: {
    emails: [ODataFilterType.AnyFunction, [ODataOp.Contains, 'gmail']],
    users: [
      ODataFilterType.AllFunction,
      {
        age: [ODataOp.Ge, 20],
        name: 'John',
      },
    ],
    userNames: [ODataFilterType.AnyFunction, [ODataOp.Ge, 30]],
  },
});

// ? $filter=(emails/any(x: contains(x, 'gmail'))) and (users/all(x: (x/age ge 20) and (x/name eq 'John'))) and (userNames/any(x: (x ge 30)))
console.log(result);
