import { ODataGuid, ODataOp, odataQb } from '../src';

const guidStr = '64fd1ec3-1d41-ee11-9d4a-86afca43b09d';
const result = odataQb.params({
  filter: { guidProp: [ODataOp.Gt, new ODataGuid(guidStr)] },
});

// ? $filter=(guidProp gt 64fd1ec3-1d41-ee11-9d4a-86afca43b09d)
console.log(result);
