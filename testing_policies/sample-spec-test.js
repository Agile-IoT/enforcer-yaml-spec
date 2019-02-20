// TO test this. CREATE A USER CALLED BOB (who is not an admin)
// then execute this script, and you will see that he can do an action on himself but not on agile!@!agile-local



var config = {
  token: 'rDcwSY7UhJBMCtUEtPTJCbWq3VkRxb2RHhqIcJG5cowUUdiABV6ILnGZd5X9LpOA',
  api: 'http://localhost:8080',
  idm: 'http://localhost:3000'
};


var agile = require('agile-sdk')(config);

agile.policies.pdp.evaluate([{
    entityId: 'bob!@!agile-local',
    entityType: 'user',
    field: 'actions.components',
    method: 'read'
  }, {
    entityId: 'agile!@!agile-local',
    entityType: 'user',
    field: 'actions.components',
    method: 'read'
  }]).then(function (results) {
  console.log('pdp results' + JSON.stringify(results));
}).catch(function (err) {
  console.log(err);
});



