const {addWorkers} = require('./create-worker')
const {readWorkers} = require('./delete-worker')
require('./read-worker')


module.exports = {addWorkers, readWorkers}