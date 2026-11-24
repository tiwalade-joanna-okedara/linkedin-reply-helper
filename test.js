const assert=require('assert');const {parseCsv}=require('./reply.js');
const r=parseCsv('name,comment\nAda,"Hi, ""friend"""\nBo,ok\n');assert.strictEqual(r.length,2);assert.strictEqual(r[0].comment,'Hi, "friend"');console.log('All tests passed');
