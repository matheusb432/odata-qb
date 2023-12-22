import { odataQb } from '../odata-qb';
import { ODataFilterType, ODataGuid, ODataOp, odataOps } from '../types';

describe('odata-qb', () => {
  describe('query', () => {
    it('should build an OData query string', () => {
      const result = odataQb.query('https://example.com', {
        filter: { name: 'John', age: [[ODataOp.Ge, 20]] },
        orderBy: ['name', 'asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=name asc',
      };

      expect(result.length).toEqual(
        "https://example.com?$filter=(name eq 'John') and (age ge 20)&$orderby=name asc"
          .length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should remove undefined and NaN filters', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          name: 'John',
          age: undefined,
          someId: NaN,
          lastName: [ODataOp.Contains, undefined],
        },
        orderBy: ['name', 'asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John')",
        orderBy: '$orderby=name asc',
      };

      expect(result.length).toEqual(
        "https://example.com?$filter=(name eq 'John')&$orderby=name asc".length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle raw filters', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          name: 'Store',
          users: [[ODataFilterType.Raw, `/any(w: w/age ${odataOps[ODataOp.Ge]} 20)`]],
          employeeId: [ODataFilterType.Raw, ` in (1, 2, null)`],
        },
        orderBy: ['name', 'asc'],
      });

      const expectedParams = {
        filter:
          "$filter=(name eq 'Store') and (users/any(w: w/age ge 20)) and (employeeId in (1, 2, null))",
        orderBy: '$orderby=name asc',
      };

      expect(result.length).toEqual(
        `https://example.com?${expectedParams.filter}&${expectedParams.orderBy}`.length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle nested orderby props', () => {
      const result = odataQb.query('https://example.com', {
        filter: { name: 'John', age: [ODataOp.Ge, 20] },
        orderBy: ['nested/prop/test', 'asc'],
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (age ge 20)",
        orderBy: '$orderby=nested/prop/test asc',
      };

      expect(result.length).toEqual(
        "https://example.com?$filter=(name eq 'John') and (age ge 20)&$orderby=nested/prop/test asc"
          .length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle date filters', () => {
      const date = new Date(2023, 4, 1);
      const result = odataQb.query('https://example.com', {
        filter: { date },
      });

      const expectedParams = {
        filter: '$filter=(date eq 2023-05-01)',
      };

      expect(result.length).toEqual(
        'https://example.com?$filter=(date eq 2023-05-01)'.length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle Guid filters', () => {
      const guidStr = '64fd1ec3-1d41-ee11-9d4a-86afca43b09d';
      const result = odataQb.query('https://example.com', {
        filter: { guidProp: [ODataOp.Gt, new ODataGuid(guidStr)] },
      });

      const expectedParams = {
        filter: `$filter=(guidProp gt ${guidStr})`,
      };

      expect(result.length).toEqual(
        `https://example.com?$filter=(guidProp gt ${guidStr})`.length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle large queries', () => {
      const date = new Date(2023, 4, 1);
      const guidStr = '64fd1ec3-1d41-ee11-9d4a-86afca43b09d';
      const result = odataQb.query('/example', {
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

      const expectedParams = {
        filter: `$filter=(name eq 'John') and (city eq 'New York') or ((someProp ge 20) or (someProp ge 30) or (someProp ge 40)) and (anotherProp ge 50) and (anotherProp le 100) and (guidProp gt ${guidStr}) and (yetAnotherProp/its/nested eq 2023-05-01)`,
        orderBy: '$orderby=nested/prop/test asc,title asc,city/date desc',
        count: '$count=true',
        skip: '$skip=30',
        top: '$top=10',
      };
      const expectedResult = `/example?$filter=(name eq 'John') and (city eq 'New York') or ((someProp ge 20) or (someProp ge 30) or (someProp ge 40)) and (anotherProp ge 50) and (anotherProp le 100) and (guidProp gt ${guidStr}) and (yetAnotherProp/its/nested eq 2023-05-01)&$orderby=nested/prop/test asc,title asc,city/date desc&$count=true&$skip=30&$top=10`;

      expect(result.length).toEqual(expectedResult.length);

      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should build an OData query string with default options when options are not provided', () => {
      const result = odataQb.query('https://example.com');
      expect(result).toEqual('https://example.com');
    });

    it('should ignore undefined filters', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          name: 'John',
          age: undefined,
          height: [[ODataOp.Le, 180]],
        },
      });

      const expectedParams = {
        filter: "$filter=(name eq 'John') and (height le 180)",
      };

      expect(result.length).toEqual(
        "https://example.com?$filter=(name eq 'John') and (height le 180)".length
      );
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle operator In', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          age: [ODataOp.In, [10, 20, 30]],
          height: [ODataOp.Le, 180],
        },
      });

      const expectedParams = {
        filter: '$filter=(age in (10,20,30)) and (height le 180)',
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle operator StartsWith', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          name: [ODataOp.StartsWith, 'joh'],
          height: [ODataOp.Le, 180],
        },
      });

      const expectedParams = {
        filter: `$filter=startswith(name, 'joh') and (height le 180)`,
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle operator EndsWith', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          name: [ODataOp.EndsWith, 'joh'],
          height: [ODataOp.Le, 180],
        },
      });

      const expectedParams = {
        filter: `$filter=endswith(name, 'joh') and (height le 180)`,
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle operator BetweenInclusive', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          age: [ODataFilterType.BetweenInclusive, [20, 30]],
          height: [ODataOp.Le, 180],
          aDate: [
            ODataFilterType.BetweenInclusive,
            [new Date(2023, 4, 1), new Date(2023, 5, 1)],
          ],
        },
      });

      const expectedParams = {
        filter:
          '$filter=((age ge 20) and (age le 30)) and (height le 180) and ((aDate ge 2023-05-01) and (aDate le 2023-06-01))',
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle operator BetweenExclusive', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          age: [ODataFilterType.BetweenExclusive, [20, 30]],
          height: [ODataOp.Le, 180],
          aDate: [
            ODataFilterType.BetweenExclusive,
            [new Date(2023, 4, 1), new Date(2023, 5, 1)],
          ],
        },
      });

      const expectedParams = {
        filter:
          '$filter=((age gt 20) and (age lt 30)) and (height le 180) and ((aDate gt 2023-05-01) and (aDate lt 2023-06-01))',
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle nested filters', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          height: [ODataOp.Le, 180],
          _0: [
            [
              ODataFilterType.NestedFilter,
              {
                name: [ODataOp.Eq, 'John', ODataOp.Or],
                age: [ODataOp.Ge, 20, ODataOp.Or],
                houseId: [ODataOp.In, [10, 20, 30]],
              },
            ],
          ],
          email: [ODataOp.Contains, 'gmail.com'],
        },
      });

      const expectedParams = {
        filter: `$filter=(height le 180) and ((name eq 'John') or (age ge 20) or (houseId in (10,20,30))) and contains(email, 'gmail.com')`,
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle multiple nested filters', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          height: [ODataOp.Le, 180],
          _0: [
            [
              ODataFilterType.NestedFilter,
              {
                name: [ODataOp.Eq, 'John', ODataOp.Or],
                age: [ODataOp.Ge, 20, ODataOp.Or],
                houseId: [ODataOp.In, [10, 20, 30]],
              },
            ],
          ],
          email: [ODataOp.Contains, 'gmail.com'],
          _1: [
            [
              ODataFilterType.NestedFilter,
              {
                birthDate: [
                  [
                    ODataFilterType.BetweenInclusive,
                    [new Date(2023, 4, 1), new Date(2023, 5, 1)],
                    ODataOp.Or,
                  ],
                ],
                address: [ODataOp.Contains, 'NYC'],
              },
            ],
          ],
        },
      });

      const expectedParams = {
        filter: `$filter=(height le 180) and ((name eq 'John') or (age ge 20) or (houseId in (10,20,30))) and contains(email, 'gmail.com') and (((birthDate ge 2023-05-01) and (birthDate le 2023-06-01)) or contains(address, 'NYC'))`,
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle filter type AnyFunction', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          height: [ODataOp.Le, 180],
          emails: [ODataFilterType.AnyFunction, [ODataOp.Contains, 'gmail']],
          users: [
            ODataFilterType.AnyFunction,
            {
              age: [ODataOp.Ge, 20],
              name: 'John',
            },
          ],
          userNames: [ODataFilterType.AnyFunction, [ODataOp.Ge, 30]],
          employees: [
            ODataFilterType.AnyFunction,
            {
              companyId: 20,
            },
          ],
        },
      });

      const expectedParams = {
        filter: `$filter=(height le 180) and (emails/any(x: contains(x, 'gmail'))) and (users/any(x: (x/age ge 20) and (x/name eq 'John'))) and (userNames/any(x: (x ge 30))) and (employees/any(x: (x/companyId eq 20)))`,
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });

    it('should handle filter type AllFunction', () => {
      const result = odataQb.query('https://example.com', {
        filter: {
          height: [ODataOp.Le, 180],
          emails: [ODataFilterType.AllFunction, [ODataOp.Contains, 'gmail']],
          users: [
            ODataFilterType.AllFunction,
            {
              age: [ODataOp.Ge, 20],
              name: 'John',
            },
          ],
          userNames: [ODataFilterType.AllFunction, [ODataOp.Ge, 30]],
          employees: [
            ODataFilterType.AllFunction,
            {
              companyId: 20,
            },
          ],
        },
      });

      const expectedParams = {
        filter: `$filter=(height le 180) and (emails/all(x: contains(x, 'gmail'))) and (users/all(x: (x/age ge 20) and (x/name eq 'John'))) and (userNames/all(x: (x ge 30))) and (employees/all(x: (x/companyId eq 20)))`,
      };

      expect(result.length).toEqual(`https://example.com?${expectedParams.filter}`.length);
      for (const param of Object.values(expectedParams)) {
        expect(result).toContain(param);
      }
    });
  });

  describe('params', () => {
    it('should return an empty object when options are not provided', () => {
      const result = odataQb.params(undefined as never);
      const expected = '';
      expect(result.length).toEqual(expected.length);
    });

    it('should return an object with filter parameters', () => {
      const result = odataQb.params({
        filter: { name: 'John', age: [ODataOp.Ge, 20] },
      });
      const expected = "$filter=(name eq 'John') and (age ge 20)";
      expect(result.length).toEqual(expected.length);
    });

    it('should return an object with orderby parameters', () => {
      const result = odataQb.params({
        orderBy: ['name', 'asc'],
      });
      const expected = '$orderby=name asc';
      expect(result.length).toEqual(expected.length);
    });

    it('should return an object with multiple parameters', () => {
      const result = odataQb.params({
        filter: { name: 'John' },
        orderBy: [['name', 'asc']],
        select: ['name', 'age'],
      });
      const expected = "$filter=(name eq 'John')&$orderby=name asc&$select=name,age";
      expect(result.length).toEqual(expected.length);
    });

    it('should return an object with $top and $skip parameters', () => {
      const result = odataQb.params({
        top: 5,
        skip: 10,
      });
      const expected = '$top=5&$skip=10';
      expect(result.length).toEqual(expected.length);
    });
  });
});
