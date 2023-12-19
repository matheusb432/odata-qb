import { ODataFilterType, odataQb } from '../src';

const result = odataQb.params({
  filter: {
    age: [ODataFilterType.BetweenInclusive, [20, 30]], // (age ge 20 and age le 30)
    aDate: [ODataFilterType.BetweenExclusive, [new Date(2023, 4, 1), new Date(2023, 5, 1)]], // (aDate gt 2023-05-01 and aDate lt 2023-06-01)
  },
});

// ? $filter=((age ge 20) and (age le 30)) and ((aDate gt 2023-05-01) and (aDate lt 2023-06-01))
console.log(result);
