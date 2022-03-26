const celery = require('celery-node');

const client = celery.createClient(
  "amqp://localhost",
  "amqp://"
);

module.exports = client;