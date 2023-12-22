# odata-qb

Functional **OData** **Q**uery **B**uilder utility to build queries in a simple, flexible way.

## Usage

```ts
import { odataQb, ODataOp, ODataOptions } from 'odata-qb';

const options: ODataOptions = {
  filter: {
    name: 'John', // (name eq 'John')
    age: [ODataOp.Ge, 20], // and (age ge 20)
  },
  orderBy: ['name', 'asc'], // &$orderby=name asc
};
// https://example.com?$filter=(name eq 'John') and (age ge 20)&$orderby=name asc
const result = odataQb.query('https://example.com', options);
```

## Examples

A more comprehensive list of examples can be found in [examples](./examples) folder. To run them, use `ts-node`:

```bash
ts-node examples/basic.ts
```

### Basic Filter

```ts
const options: ODataOptions = {
  filter: {
    name: 'John', // (name eq 'John')
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
```

### Lambda any & all filters

```ts
const result = odataQb.params({
  filter: {
    emails: [ODataFilterType.AnyFunction, [ODataOp.Contains, 'gmail']], // emails/any(x: contains(x, 'gmail'))
    users: [
      ODataFilterType.AllFunction, // and users/all(x: 
      {
        age: [ODataOp.Ge, 20], // (x/age ge 20)
        name: 'John', // and (x/name eq 'John')
      }, // )
    ],
    userNames: [ODataFilterType.AnyFunction, [ODataOp.Ge, 30]], // and userNames/any(x: (x ge 30))
  },
});

// ? $filter=(emails/any(x: contains(x, 'gmail'))) and (users/all(x: (x/age ge 20) and (x/name eq 'John'))) and (userNames/any(x: (x ge 30)))
console.log(result);
```

### Nested Filters

```ts
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
```

### Escape Hatch

If necessary, you can pass the `ODataFilterType.Raw` operator and a string value to pass a hardcoded filter string.

```ts
const result = odataQb.params({
  filter: {
    users: [ODataFilterType.Raw, `/any(w: w/age ge 20)`],
  },
});

// ? $filter=(users/any(w: w/age ge 20))
console.log(result);
```

## Local Build

To locally build this npm package, run the following commands:

```bash
npm i
npm run build
```

To locally link this package to another project in order to test it, run the following command:

```bash
npm link
```

Then, in the other project, run the following command:

```bash
npm link odata-qb
```

## Tests

Unit tests have been built using [Jest](https://jestjs.io/). To run the tests, run the following command:

```bash
npm run test
```
