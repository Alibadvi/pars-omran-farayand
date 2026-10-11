import * as migration_20261011_071727_initial_portal_schema from './20261011_071727_initial_portal_schema';

export const migrations = [
  {
    up: migration_20261011_071727_initial_portal_schema.up,
    down: migration_20261011_071727_initial_portal_schema.down,
    name: '20261011_071727_initial_portal_schema'
  },
];
