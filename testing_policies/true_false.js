
var config = {
  token: '2oACsoQXnUyWzkOB90FW84VzcHAHhRwQeuyzVxgX3KXyOiFSYGGsjgBVQGsNvvCl',
  api: 'http://localhost:8080',
  idm: 'http://localhost:3000'
};


//var agile = require('agile-sdk')(config);
var agile = require('../../../dist')(config);

agile.policies.pdp.evaluate([{
    entityId: 'bob!@!agile-local',
    entityType: 'user',
    field: 'password',
    method: 'read'
  }, {
    entityId: 'agile!@!agile-local',
    entityType: 'user',
    field: 'password',
    method: 'read'
  }]).then(function (results) {
  console.log('pdp results' + JSON.stringify(results));
}).catch(function (err) {
  console.log(err);
});


