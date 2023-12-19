import { odataQb } from '../src';

const date = new Date(2023, 4, 1);
const result = odataQb.params({
  filter: { date },
});

// ? $filter=(date eq 2023-05-01)
console.log(result);
