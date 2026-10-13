import * as migration_20261011_071727_initial_portal_schema from './20261011_071727_initial_portal_schema';
import * as migration_20261013_060000_message_recipients_usernames from './20261013_060000_message_recipients_usernames';

export const migrations = [
  {
    up: migration_20261011_071727_initial_portal_schema.up,
    down: migration_20261011_071727_initial_portal_schema.down,
    name: '20261011_071727_initial_portal_schema'
  },
  {
    up: migration_20261013_060000_message_recipients_usernames.up,
    down: migration_20261013_060000_message_recipients_usernames.down,
    name: '20261013_060000_message_recipients_usernames'
  },
];
