const RC = require('rc')('CLEDG', require('../../config/default.json'))

module.exports = {
  HOSTNAME: RC.HOSTNAME.replace(/\/$/, ''),
  PORT: RC.PORT,
  DATABASE_URI: RC.DATABASE_URI,
  AMOUNT: RC.AMOUNT,
  ENABLE_TOKEN_AUTH: RC.ENABLE_TOKEN_AUTH === 'true',
  ENABLE_BASIC_AUTH: RC.ENABLE_BASIC_AUTH === 'true',
  LEDGER_ACCOUNT_NAME: RC.LEDGER_ACCOUNT_NAME,
  LEDGER_ACCOUNT_PASSWORD: RC.LEDGER_ACCOUNT_PASSWORD,
  LEDGER_ACCOUNT_EMAIL: RC.LEDGER_ACCOUNT_NAME + '@test.com',
  ADMIN_SECRET: RC.ADMIN_SECRET,
  ADMIN_KEY: RC.ADMIN_KEY,
  ADMIN_PORT: RC.ADMIN_PORT,
  TOKEN_EXPIRATION: RC.TOKEN_EXPIRATION,
  EXPIRES_TIMEOUT: RC.EXPIRES_TIMEOUT,
  SIDECAR: RC.SIDECAR,
  SIDECAR_DISABLED: RC.SIDECAR.DISABLED === 'true',
  EMAIL_USER: RC.EMAIL_USER,
  EMAIL_PASSWORD: RC.EMAIL_PASSWORD,
  EMAIL_SMTP: RC.EMAIL_SMTP,
  TOPICS_KAFKA_HOSTS: RC.TOPICS.KAFKA.HOSTS,
  TOPICS_KAFKA_PRODUCER_OPTIONS: RC.TOPICS.KAFKA.PRODUCER.OPTIONS,
  TOPICS_KAFKA_PRODUCER_ATTRIBUTES: RC.TOPICS.KAFKA.PRODUCER.ATTRIBUTES,
  TOPICS_KAFKA_CONSUMER_CONFIG: RC.TOPICS.KAFKA.CONSUMER.CONFIG,
  TOPICS_KAFKA_CONSUMER_OPTIONS: RC.TOPICS.KAFKA.CONSUMER.OPTIONS,
  TOPICS_PREPARE_TX_TEMPLATE: RC.TOPICS.PREPARE.TX.TEMPLATE,
  TOPICS_PREPARE_TX_REGEX: RC.TOPICS.PREPARE.TX.REGEX,
  TOPICS_PREPARE_NOTIFICATION_TEMPLATE: RC.TOPICS.PREPARE.NOTIFICATION.TEMPLATE,
  TOPICS_PREPARE_NOTIFICATION_REGEX: RC.TOPICS.PREPARE.NOTIFICATION.REGEX,
  TOPICS_PREPARE_POSITION_TEMPLATE: RC.TOPICS.PREPARE.POSITION.TEMPLATE,
  TOPICS_PREPARE_POSITION_REGEX: RC.TOPICS.PREPARE.POSITION.REGEX
}
